package project.policy

import annotationdefinition.AnnotationID
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import common.computeIfAbsentAndGet
import document.Document
import document.ProjectAnnotationData
import document.addAnnotationResultForProject
import document.addFinalizedAnnotationResultForProject
import document.annotation.*
import document.annotation.Annotation
import net.logstash.logback.encoder.org.apache.commons.lang.exception.ExceptionUtils
import org.slf4j.LoggerFactory
import project.Project
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.denormalize
import project.annotationschema.generator.HandlingPolicy
import java.util.*

private val logger = LoggerFactory.getLogger("Policy")


enum class FinalizeAnnotationPolicy {
    /**
     * Don't merge annotations, export every single one created by annotators. No automatic curation requests.
     */
    EXPORT_EVERY_ANNOTATION_SEPARATELY,
    /**
     * for 1 annotator: will automatically be finalized
     * for 2 annotator: identical answers: finalized, else curator
     * for 3 annotator: identical answers: finalized, 2+ identical answers for every annotation: finalized, else curator
     * for 4 annotator: identical answers: finalized, 3+ identical answers for every annotation: finalized, else curator
     * ...
     */
    MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR,
    /**
     * for 1 annotator: will automatically be finalized
     * for 2 annotator: identical answers: finalized, else curator
     * for 3 annotator: identical answers: finalized, else curator
     * for 4 annotator: identical answers: finalized, else curator
     */
    MAJORITY_VOTE_WHOLE_DOCUMENT_OR_CURATOR,
    /**
     * Always require curation, even on full agreement of annotators
     */
    ALWAYS_REQUIRE_CURATION,
    /**
     * On disagreement, instead of curation, ask another annotator (if no more annotators exist, inform manager)
     *
     * for 1 annotator: will automatically be finalized
     * for 2 annotator: identical answers: finalized, else ask additional annotator
     * for 3 annotator: identical answers: finalized, 2+ identical answers for every annotation: finalized, else ask additional annotator
     * for 4 annotator: identical answers: finalized, 3+ identical answers for every annotation: finalized, else ask additional annotator
     */
    MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR,
    /**
     * On disagreement, instead of curation, ask another annotator (if no more annotators exist, inform manager)
     *
     * for 1 annotator: will automatically be finalized
     * for 2 annotator: identical answers: finalized, else ask additional annotator
     * for 3 annotator: identical answers: finalized, else ask additional annotator
     * for 4 annotator: identical answers: finalized, else ask additional annotator
     */
    MAJORITY_VOTE_WHOLE_DOCUMENT_OR_ADDITIONAL_ANNOTATOR
}

/**
 * Data class defining policy of how to handle documents / annotations, especially how and when to finalize an annotation
 * for a document and project.
 */
data class Policy(
    val numberOfAnnotatorsPerDocument: Int = 1,
    val allowManualEscalationToCurator: Boolean = false,
    val finalizeAnnotationPolicy: FinalizeAnnotationPolicy = FinalizeAnnotationPolicy.MAJORITY_VOTE_WHOLE_DOCUMENT_OR_CURATOR
)

/**
 * Sealed class for the different actions that can be required to be taken for a document to get the annotation done
 * properly
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = PolicyAction.ShowToAnnotator::class, name = "ShowToAnnotator"),
        JsonSubTypes.Type(value = PolicyAction.ShowToCurator::class, name = "ShowToCurator"),
        JsonSubTypes.Type(value = PolicyAction.ShowToAdmin::class, name = "ShowToAdmin"),
        JsonSubTypes.Type(value = PolicyAction.SaveUpdatedModel::class, name = "SaveUpdatedModel"),
        JsonSubTypes.Type(value = PolicyAction.DoNothing::class, name = "DoNothing")
    ]
)
sealed class PolicyAction {
    data class ShowToAnnotator(val numberOfMissingAnnotations: Int? = null) : PolicyAction()
    data class ShowToCurator(val message: String? = null) : PolicyAction()
    data class ShowToAdmin(val message: String, val stackTrace: String) : PolicyAction()
    object SaveUpdatedModel : PolicyAction()
    object DoNothing : PolicyAction()
}

/**
 * We need to validate that an [AnnotationResult] has every required annotation
 */
fun isCompleteAnnotationResult(
    annotationResult: AnnotationResult,
    document: Document,
    annotationSchema: DenormalizedAnnotationSchema
): Boolean {
    return annotationSchema.elements.all { element ->
        // Step 1: Check if annotation itself is valid
        val validAnnotation = element.annotationDefinition
            .validateAnnotation(annotationResult.annotations, element.target, null) == null
        val canBeFinalized = when(annotationResult.creator) {
            is AnnotationResultCreator.Generators -> {
                element.annotationGenerator?.finalizeCondition?.execute(
                    annotationResult.annotations[element.annotationDefinition.id] ?:
                    error("Annotation for ID ${element.annotationDefinition.id} missing")) == true
            }
            else -> true
        }

        val requiredByEnableCondition = (element.enableCondition == null ||
                element.enableCondition.execute(document, annotationResult.annotations))

        logger.info("Validation of ${element.annotationDefinition.id}: ValidAnnotation $validAnnotation canBeFinalized $canBeFinalized," +
                " requiredByEnableCondition? $requiredByEnableCondition for data ${annotationResult.annotations[element.annotationDefinition.id]}")
        validAnnotation && canBeFinalized || !requiredByEnableCondition
    }
}

/**
 * For agreement logic, we need to filter the annotationResults
 */
private fun filterValidAnnotationResultsForAgreement(
    annotationResults: List<AnnotationResult>,
    document: Document,
    annotationSchema: DenormalizedAnnotationSchema
): List<AnnotationResult> {
    return annotationResults.filter {
        (it.creator is AnnotationResultCreator.Annotator || (
                annotationSchema.generatedAnnotationResultHandling.handlingPolicy is HandlingPolicy.GeneratorAsAnnotator &&
                        (it.creator is AnnotationResultCreator.Generators || it.creator is AnnotationResultCreator.Import))
                ) && isCompleteAnnotationResult(it, document, annotationSchema)
    }.groupBy { it.creator }.mapNotNull {
        it.value.maxBy { it.timestamp }
    }
}

suspend fun Policy.applyPolicy(
    project: Project, document: Document, overwriteFinalizedAnnotations: Boolean = false, curationRequest: String? = null,
    annotationSchema: DenormalizedAnnotationSchema? = null
): PolicyAction {
    try {
        return document.projectAnnotationData.computeIfAbsentAndGet(project.id, { ProjectAnnotationData() }).let { projectAnnotationData ->
            val denormalizedAnnotationSchema = annotationSchema ?: project.annotationSchema.denormalize()
            val validAnnotationResults = filterValidAnnotationResultsForAgreement(
                projectAnnotationData.annotationResults, document, denormalizedAnnotationSchema
            )
            if (allowManualEscalationToCurator && !curationRequest.isNullOrBlank()) {
                PolicyAction.ShowToCurator(curationRequest)
            } else if (((validAnnotationResults.size) < numberOfAnnotatorsPerDocument)) {
                PolicyAction.ShowToAnnotator(numberOfAnnotatorsPerDocument - validAnnotationResults.size)
            } else if (overwriteFinalizedAnnotations || projectAnnotationData.finalizedAnnotationResults.isEmpty()) {

                suspend fun saveAnnotations(annotations: AnnotationMap?, missingMajorityActionCreator: () -> PolicyAction):
                        PolicyAction {
                    return if (annotations != null) {
                        val resultID = UUID.randomUUID().toString()
                        document.addAnnotationResultForProject(
                            project,
                            AnnotationResult(
                                resultID,
                                document.id,
                                project.id,
                                System.currentTimeMillis(),
                                annotations,
                                AnnotationResultCreator.Consensus(validAnnotationResults.map { it.creator }.toSet())
                            ), checkWebHooks = false, applyPolicy = false
                        )
                        document.addFinalizedAnnotationResultForProject(
                            project,
                            FinalizedAnnotationResult(
                                listOf(resultID),
                                FinalizedReason.Policy,
                                this,
                                System.currentTimeMillis(),
                                ExportStatistics()
                            ), checkWebHooks = false, applyPolicy = false
                        )
                        PolicyAction.SaveUpdatedModel
                    } else {
                        missingMajorityActionCreator()
                    }
                }

                when (finalizeAnnotationPolicy) {
                    FinalizeAnnotationPolicy.EXPORT_EVERY_ANNOTATION_SEPARATELY -> {
                        document.addFinalizedAnnotationResultForProject(
                            project,
                            FinalizedAnnotationResult(
                                validAnnotationResults.map { it.id },
                                FinalizedReason.Policy,
                                this,
                                System.currentTimeMillis(),
                                ExportStatistics()
                            ), checkWebHooks = false, applyPolicy = false
                        )
                        PolicyAction.SaveUpdatedModel
                    }
                    FinalizeAnnotationPolicy.MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR -> {
                        if(numberOfAnnotatorsPerDocument == 1 && validAnnotationResults.size == 1) {
                            document.addFinalizedAnnotationResultForProject(
                                project,
                                FinalizedAnnotationResult(
                                    validAnnotationResults.map { it.id },
                                    FinalizedReason.Policy,
                                    this,
                                    System.currentTimeMillis(),
                                    ExportStatistics()
                                ), checkWebHooks = false, applyPolicy = false
                            )
                            PolicyAction.SaveUpdatedModel
                        } else {
                            val annotations = buildMajorityPerAnnotation(
                                validAnnotationResults,
                                numberOfAnnotatorsPerDocument
                            )
                            saveAnnotations(annotations) {
                                PolicyAction.ShowToCurator()
                            }
                        }
                    }
                    FinalizeAnnotationPolicy.MAJORITY_VOTE_WHOLE_DOCUMENT_OR_CURATOR -> {
                        if(numberOfAnnotatorsPerDocument == 1 && validAnnotationResults.size == 1) {
                            document.addFinalizedAnnotationResultForProject(
                                project,
                                FinalizedAnnotationResult(
                                    validAnnotationResults.map { it.id },
                                    FinalizedReason.Policy,
                                    this,
                                    System.currentTimeMillis(),
                                    ExportStatistics()
                                ), checkWebHooks = false, applyPolicy = false
                            )
                            PolicyAction.SaveUpdatedModel
                        } else {
                            val annotations = buildMajorityPerDocument(
                                validAnnotationResults,
                                numberOfAnnotatorsPerDocument
                            )
                            saveAnnotations(annotations) {
                                PolicyAction.ShowToCurator()
                            }
                        }
                    }
                    FinalizeAnnotationPolicy.ALWAYS_REQUIRE_CURATION -> {
                        if (projectAnnotationData.finalizedAnnotationResults.isEmpty()) {
                            PolicyAction.ShowToCurator()
                        } else {
                            PolicyAction.DoNothing
                        }
                    }
                    FinalizeAnnotationPolicy.MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR -> {
                        if(numberOfAnnotatorsPerDocument == 1 && validAnnotationResults.size == 1) {
                            document.addFinalizedAnnotationResultForProject(
                                project,
                                FinalizedAnnotationResult(
                                    validAnnotationResults.map { it.id },
                                    FinalizedReason.Policy,
                                    this,
                                    System.currentTimeMillis(),
                                    ExportStatistics()
                                ), checkWebHooks = false, applyPolicy = false
                            )
                            PolicyAction.SaveUpdatedModel
                        } else {
                            val annotations = buildMajorityPerAnnotation(
                                validAnnotationResults,
                                numberOfAnnotatorsPerDocument
                            )
                            saveAnnotations(annotations) {
                                PolicyAction.ShowToAnnotator(1)
                            }
                        }
                    }
                    FinalizeAnnotationPolicy.MAJORITY_VOTE_WHOLE_DOCUMENT_OR_ADDITIONAL_ANNOTATOR -> {
                        if(numberOfAnnotatorsPerDocument == 1 && validAnnotationResults.size == 1) {
                            document.addFinalizedAnnotationResultForProject(
                                project,
                                FinalizedAnnotationResult(
                                    validAnnotationResults.map { it.id },
                                    FinalizedReason.Policy,
                                    this,
                                    System.currentTimeMillis(),
                                    ExportStatistics()
                                ), checkWebHooks = false, applyPolicy = false
                            )
                            PolicyAction.SaveUpdatedModel
                        } else {
                            val annotations = buildMajorityPerDocument(
                                validAnnotationResults,
                                numberOfAnnotatorsPerDocument
                            )
                            saveAnnotations(annotations) {
                                PolicyAction.ShowToAnnotator(1)
                            }
                        }
                    }
                }
            } else {
                PolicyAction.DoNothing
            }
        }
    } catch (t: Throwable) {
        logger.error("Error handling policy $this", t)
        return PolicyAction.ShowToAdmin(t.localizedMessage, ExceptionUtils.getFullStackTrace(t))
    }
}

/**
 *  To be a valid majority, the count*2 of equal annotations needs to be higher than the number or annotators per single annotation
 *  Every annotation will be handeled independently
Examples:
numberOfAnnotatorsPerDocument | majorityAnnotation.count | majorityAnnotation.count * 2 | Valid majority
1                               1                          2                              yes
2                               1                          2                              no
2                               2                          4                              yes
3                               1                          2                              no
3                               2                          4                              yes
3                               3                          6                              yes
4                               2                          4                              no
4                               3                          6                              yes
 */
internal fun buildMajorityPerAnnotation(validAnnotationResults: List<AnnotationResult>, numberOfAnnotatorsPerDocument: Int)
        : AnnotationMap? {
    val equalAnnotations: MutableMap<AnnotationID, MutableMap<Annotation<*>, Int>> = mutableMapOf()
    validAnnotationResults.forEach { annotationResult ->
        annotationResult.annotations.map { entry ->
            if(equalAnnotations.containsKey(entry.key)) {
                if(equalAnnotations[entry.key]!![entry.value] != null) {
                    equalAnnotations[entry.key]!![entry.value] = equalAnnotations[entry.key]!![entry.value]!! + 1
                } else {
                    equalAnnotations[entry.key]!![entry.value] = 1
                }
            } else {
                equalAnnotations[entry.key] = mutableMapOf(entry.value to 1)
            }
        }
    }
    val majorityAnnotations: MutableMap<AnnotationID, Annotation<*>> = mutableMapOf()
    return try {
        equalAnnotations.forEach { (annotationID, annotationToCountMap) ->
            val majorityAnnotation = annotationToCountMap.toList().maxBy { it.second }!!
            println("MajorityAnnotation $majorityAnnotation")
            if (majorityAnnotation.second * 2 > numberOfAnnotatorsPerDocument) {
                majorityAnnotations[annotationID] = majorityAnnotation.first
            } else {
                throw PolicyFailureException("No majority possible")
            }
        }
        majorityAnnotations
    } catch (e: Exception) {
        logger.info("Could not build majority", e)
        null
    }
}

/**
 * To be a valid majority, the count*2 of equal annotations needs to be higher than the number or annotators per document
Examples:
numberOfAnnotatorsPerDocument | majorityAnnotation.count | majorityAnnotation.count * 2 | Valid majority
1                               1                          2                              yes
2                               1                          2                              no
2                               2                          4                              yes
3                               1                          2                              no
3                               2                          4                              yes
3                               3                          6                              yes
4                               2                          4                              no
4                               3                          6                              yes
 */
internal fun buildMajorityPerDocument(validAnnotationResults: List<AnnotationResult>, numberOfAnnotatorsPerDocument: Int)
        : AnnotationMap? {
    val equalsAnnotations: MutableMap<AnnotationMap, Int> = mutableMapOf()
    validAnnotationResults.map { it.annotations }
        .forEach { annotations ->
            if (equalsAnnotations.containsKey(annotations)) {
                equalsAnnotations[annotations] = equalsAnnotations[annotations]!! + 1
            } else {
                equalsAnnotations[annotations] = 1
            }
        }
    val majorityAnnotation = equalsAnnotations.toList().maxBy { it.second }!!
    return if (majorityAnnotation.second * 2 > numberOfAnnotatorsPerDocument) {
        majorityAnnotation.first
    } else {
        null
    }
}