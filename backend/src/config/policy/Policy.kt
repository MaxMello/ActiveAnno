package config.policy

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import document.*
import document.annotation.*
import org.slf4j.LoggerFactory
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
     * On disagreement, instead of curation, ask another annotator (if no more annotators exist, ask curator)
     *
     * for 1 annotator: will automatically be finalized
     * for 2 annotator: identical answers: finalized, else ask additional annotator
     * for 3 annotator: identical answers: finalized, 2+ identical answers for every annotation: finalized, else ask additional annotator
     * for 4 annotator: identical answers: finalized, 3+ identical answers for every annotation: finalized, else ask additional annotator
     */
    MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR,
    /**
     * On disagreement, instead of curation, ask another annotator (if no more annotators exist, ask curator)
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
 * for a document and configuration.
 */
data class Policy(
    val numberOfAnnotatorsPerDocument : Int = 1,
    val allowManualEscalationToCurator : Boolean = false,
    val finalizeAnnotationPolicy : FinalizeAnnotationPolicy = FinalizeAnnotationPolicy.MAJORITY_VOTE_WHOLE_DOCUMENT_OR_CURATOR
)

/**
 * Sealed class for the different actions that can be required to be taken for a document to get the annotation done
 * properly
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = PolicyAction.ShowToAnnotator::class, name = "ShowToAnnotator"),
    JsonSubTypes.Type(value = PolicyAction.ShowToCurator::class, name = "ShowToCurator"),
    JsonSubTypes.Type(value = PolicyAction.SaveUpdatedModel::class, name = "SaveUpdatedModel"),
    JsonSubTypes.Type(value = PolicyAction.DoNothing::class, name = "DoNothing")
])
sealed class PolicyAction {
    data class ShowToAnnotator(val numberOfMissingAnnotations: Int? = null) : PolicyAction()
    data class ShowToCurator(val message: String? = null) : PolicyAction()
    object SaveUpdatedModel : PolicyAction()
    object DoNothing: PolicyAction()
}

/**
 * Data class holding the documentAnnotations and spanAnnotations, used for easier handling of policy logic.
 */
private data class AnnotatedDocumentData(
    val documentAnnotations: Map<String, DocumentAnnotation>,
    val spanAnnotations: Map<String, List<SpanAnnotation>>)

fun Policy.applyPolicy(configurationID: String, document: Document, overwriteFinalizedAnnotations: Boolean = false, curationRequest: String? = null): PolicyAction {
    if(!document.configAnnotationData.containsKey(configurationID)) {
        document.configAnnotationData[configurationID] = ConfigAnnotationData()
    }
    return document.configAnnotationData[configurationID]!!.let { configAnnotationData ->
        if(allowManualEscalationToCurator && !curationRequest.isNullOrBlank()) {
            PolicyAction.ShowToCurator(curationRequest)
        } else if(((configAnnotationData.annotations.size) < numberOfAnnotatorsPerDocument)) {
            PolicyAction.ShowToAnnotator(numberOfAnnotatorsPerDocument - configAnnotationData.annotations.size)
        } else if(overwriteFinalizedAnnotations || configAnnotationData.finalizedAnnotations.isEmpty()) {
            logger.info("Try to calculate finalized annotation")
            when(finalizeAnnotationPolicy) {
                FinalizeAnnotationPolicy.EXPORT_EVERY_ANNOTATION_SEPARATELY -> {
                    configAnnotationData.finalizedAnnotations.add(
                        FinalizedAnnotation(
                            configAnnotationData.annotations.map { it.id },
                            FinalizedReason.Policy,
                            this,
                            System.currentTimeMillis(),
                            ExportStatistics()
                        )
                    )
                    PolicyAction.SaveUpdatedModel
                }
                FinalizeAnnotationPolicy.MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR -> {
                    val annotations = buildMajorityPerDocument(document, configurationID)
                    if(annotations != null) {
                        val resultID = UUID.randomUUID().toString()
                        configAnnotationData.annotations.add(
                            AnnotationResult(resultID,
                                document._id!!,
                                configurationID,
                                System.currentTimeMillis(),
                                annotations.documentAnnotations,
                                annotations.spanAnnotations,
                                configAnnotationData.annotations.flatMap { it.creator }.toSet().toList()
                            )
                        )
                        configAnnotationData.finalizedAnnotations.add(
                            FinalizedAnnotation(
                                listOf(resultID),
                                FinalizedReason.Policy,
                                this,
                                System.currentTimeMillis(),
                                ExportStatistics()
                            )
                        )
                        PolicyAction.SaveUpdatedModel
                    } else {
                        PolicyAction.ShowToCurator()
                    }
                }
                FinalizeAnnotationPolicy.MAJORITY_VOTE_WHOLE_DOCUMENT_OR_CURATOR -> {
                    val annotations = buildMajorityPerAnnotation(document, configurationID)
                    if(annotations != null) {
                        val resultID = UUID.randomUUID().toString()
                        configAnnotationData.annotations.add(
                            AnnotationResult(resultID,
                                document._id!!,
                                configurationID,
                                System.currentTimeMillis(),
                                annotations.documentAnnotations,
                                annotations.spanAnnotations,
                                configAnnotationData.annotations.flatMap { it.creator }.toSet().toList()
                            )
                        )
                        configAnnotationData.finalizedAnnotations.add(
                            FinalizedAnnotation(
                                listOf(resultID),
                                FinalizedReason.Policy,
                                this,
                                System.currentTimeMillis(),
                                ExportStatistics()
                            )
                        )
                        PolicyAction.SaveUpdatedModel
                    } else {
                        PolicyAction.ShowToCurator()
                    }
                }
                FinalizeAnnotationPolicy.ALWAYS_REQUIRE_CURATION -> {
                    if(configAnnotationData.finalizedAnnotations.isEmpty()) {
                        PolicyAction.ShowToCurator()
                    } else {
                        PolicyAction.DoNothing
                    }
                }
                FinalizeAnnotationPolicy.MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR -> {
                    val annotations = buildMajorityPerAnnotation(document, configurationID)
                    if(annotations != null) {
                        val resultID = UUID.randomUUID().toString()
                        configAnnotationData.annotations.add(
                            AnnotationResult(resultID,
                                document._id!!,
                                configurationID,
                                System.currentTimeMillis(),
                                annotations.documentAnnotations,
                                annotations.spanAnnotations,
                                configAnnotationData.annotations.flatMap { it.creator }.toSet().toList()
                            )
                        )
                        configAnnotationData.finalizedAnnotations.add(
                            FinalizedAnnotation(
                                listOf(resultID),
                                FinalizedReason.Policy,
                                this,
                                System.currentTimeMillis(),
                                ExportStatistics()
                            )
                        )
                        PolicyAction.SaveUpdatedModel
                    } else {
                        PolicyAction.ShowToAnnotator(1)
                    }
                }
                FinalizeAnnotationPolicy.MAJORITY_VOTE_WHOLE_DOCUMENT_OR_ADDITIONAL_ANNOTATOR -> {
                    val annotations = buildMajorityPerDocument(document, configurationID)
                    if(annotations != null) {
                        val resultID = UUID.randomUUID().toString()
                        configAnnotationData.annotations.add(
                            AnnotationResult(resultID,
                                document._id!!,
                                configurationID,
                                System.currentTimeMillis(),
                                annotations.documentAnnotations,
                                annotations.spanAnnotations,
                                configAnnotationData.annotations.flatMap { it.creator }.toSet().toList()
                            )
                        )
                        configAnnotationData.finalizedAnnotations.add(
                            FinalizedAnnotation(
                                listOf(resultID),
                                FinalizedReason.Policy,
                                this,
                                System.currentTimeMillis(),
                                ExportStatistics()
                            )
                        )
                        PolicyAction.SaveUpdatedModel
                    } else {
                        PolicyAction.ShowToAnnotator(1)
                    }
                }
            }
        } else {
            PolicyAction.DoNothing
        }
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
private fun Policy.buildMajorityPerAnnotation(document: Document, configurationID: String): AnnotatedDocumentData? {
    val annotations = document.configAnnotationData[configurationID]?.annotations?.map {
        AnnotatedDocumentData(it.documentAnnotations, it.spanAnnotations)
    } ?: listOf()
    val equalDocAnnotations: MutableMap<String, MutableMap<DocumentAnnotation, Int>> = mutableMapOf()
    val equalSpanAnnotations: MutableMap<String, MutableMap<List<SpanAnnotation>, Int>> = mutableMapOf()
    annotations.forEach { a ->
        a.documentAnnotations.toList().forEach { pair ->
            if(equalDocAnnotations.containsKey(pair.first)) {
                equalDocAnnotations[pair.first]!![pair.second] = equalDocAnnotations[pair.first]!![pair.second]!! + 1
            } else {
                equalDocAnnotations[pair.first] = mutableMapOf(pair.second to 1)
            }
        }
        a.spanAnnotations.toList().forEach { pair ->
            if(equalSpanAnnotations.containsKey(pair.first)) {
                equalSpanAnnotations[pair.first]!![pair.second] = equalSpanAnnotations[pair.first]!![pair.second]!! + 1
            } else {
                equalSpanAnnotations[pair.first] = mutableMapOf(pair.second to 1)
            }
        }
    }
    val majorityDocAnnotations: MutableMap<String, DocumentAnnotation> = mutableMapOf()
    val majoritySpanAnnotations: MutableMap<String, List<SpanAnnotation>> = mutableMapOf()
    try {
        equalDocAnnotations.forEach { annotationID, annotationToCountMap ->
            val majorityAnnotation = annotationToCountMap.toList().sortedByDescending { it.second }.first()
            if (majorityAnnotation.second * 2 > numberOfAnnotatorsPerDocument) {
                majorityDocAnnotations[annotationID] = majorityAnnotation.first
            } else {
                throw Exception("No majority possible")
            }
        }
        equalSpanAnnotations.forEach { annotationID, annotationToCountMap ->
            val majorityAnnotation = annotationToCountMap.toList().sortedByDescending { it.second }.first()
            if (majorityAnnotation.second * 2 > numberOfAnnotatorsPerDocument) {
                majoritySpanAnnotations[annotationID] = majorityAnnotation.first
            } else {
                throw Exception("No majority possible")
            }
        }
        return AnnotatedDocumentData(majorityDocAnnotations, majoritySpanAnnotations)
    } catch (e: Exception) {
        return null
    }
}

/**
 *  To be a valid majority, the count*2 of equal annotations needs to be higher than the number or annotators per document
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
private fun Policy.buildMajorityPerDocument(document: Document, configurationID: String): AnnotatedDocumentData? {
    val equalsAnnotations: MutableMap<AnnotatedDocumentData, Int> = mutableMapOf()
    document.configAnnotationData[configurationID]?.annotations
        ?.map { AnnotatedDocumentData(it.documentAnnotations, it.spanAnnotations) }
        ?.forEach { doc ->
            if(equalsAnnotations.containsKey(doc)) {
                equalsAnnotations[doc] = equalsAnnotations[doc]!! + 1
            } else {
                equalsAnnotations[doc] = 1
            }
        }
    val majorityAnnotation = equalsAnnotations.toList().sortedByDescending { it.second }.first()
    return if(majorityAnnotation.second * 2 > numberOfAnnotatorsPerDocument) {
        AnnotatedDocumentData(
            majorityAnnotation.first.documentAnnotations,
            majorityAnnotation.first.spanAnnotations
        )
    } else {
        null
    }
}