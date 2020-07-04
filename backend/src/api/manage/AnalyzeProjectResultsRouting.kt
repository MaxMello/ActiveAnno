package api.manage

import annotationdefinition.AnnotationID
import api.annotate.dto.AnnotateProject
import api.annotate.dto.toAnnotateProject
import application.ApplicationConfig
import application.userDAO
import common.*
import document.Document
import document.DocumentDAO
import document.DocumentID
import document.annotation.*
import document.applyInputMapping
import io.ktor.application.call
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import project.Project
import project.ProjectDAO
import project.ProjectID
import project.annotationschema.denormalize
import project.annotationschema.generator.HandlingPolicy
import project.annotationschema.generator.HandlingPolicyType
import project.filter.*
import project.policy.Policy
import project.userroles.UserIdentifier
import user.UserDAO

private val logger = LoggerFactory.getLogger("AnalyzeProjectResults")

/**
 * Request body for analyze endpoint
 */
data class AnalyzeProjectRequest(
    val projectID: ProjectID,
    /**
     * Only analyze annotation results by these annotators (or all if empty)
     */
    val annotators: List<UserIdentifier>,
    /**
     * Only analyze annotation results and finalized annotation results by these curators (or all if empty)
     */
    val curators: List<UserIdentifier>,
    val finalizedBefore: Long? = null,
    val finalizedAfter: Long? = null,
    val ignoreDocumentIDs: List<DocumentID>,
    val ignoreAnnotationResultIDs: List<AnnotationResultID>,
    /**
     * Only analyze documents where all annotation results by all [annotators] have that [HandlingPolicyType]
     */
    val generatedAnnotationResultHandlingPolicyType: HandlingPolicyType? = null,
    /**
     * Only analyze documents where the generator is wrong.
     * For duration statistics as well as all document-level statistics, this will apply to check if the generator was wrong anywhere on the whole
     * document / all annotations. For the annotation-specific statistics, this will apply to check if the generator was wrong for that specific
     * annotation.
     */
    val onlyGeneratorIncorrect: Boolean = false,
    /**
     * Only analyze documents where the annotators disagree
     */
    val onlyAnnotatorDisagreement: Boolean = false,
    /**
     * Only analyze documents where at least 1 annotator is wrong
     */
    val onlyAnyAnnotatorIncorrect: Boolean = false,
    val additionalFilter: FilterCondition? = null
)

/**
 * Analyze response with [TopLevelStatistics] and a list of [AnalyzedDocument]s
 */
data class AnalyzeProjectResponse(
    val projectID: ProjectID,
    val analyzedDocuments: List<AnalyzedDocument>,
    val topLevelStatistics: TopLevelStatistics?,
    val annotateProject: AnnotateProject?,
    val annotationNames: Map<AnnotationID, String>,
    val userNames: Map<UserIdentifier, String>,
    val errorMessage: String? = null
)

/**
 * Statistics calculated over all documents
 */
data class TopLevelStatistics(
    val documentAccuracyStatistics: AccuracyStatistics,
    val perAnnotationAccuracyStatistics: Map<AnnotationID, AccuracyStatistics>,
    val perAnnotatorAverageFullDuration: Map<UserIdentifier, TimeWrapper>,
    val averageAnnotatorFullDuration: Double,
    val perAnnotatorAverageInteractionDuration: Map<UserIdentifier, TimeWrapper>,
    val averageAnnotatorInteractionDuration: Double
)

/**
 * Statistics about the accuracy and IAA
 */
data class AccuracyStatistics(
    val interAnnotatorAgreement: PercentWrapper,
    val annotatorAccuracy: Map<String, PercentWrapper>,
    val averageAnnotatorAccuracy: Double,
    val generatorAccuracy: PercentWrapper? = null
)

/**
 * A document with additional statistics like agreement and correctness
 */
data class AnalyzedDocument(
    val documentID: DocumentID,
    val storeTimestamp: Long,
    val documentData: Map<String, Any>,
    val documentStatistics: DocumentStatistics,
    val perAnnotationStatistics: Map<AnnotationID, DocumentStatistics>,
    val analyzedAnnotationResults: List<AnalyzedAnnotationResult>,
    val finalizedAnnotationResult: FinalizedAnnotationResultForAnalysis
)

/**
 * Individual statistics for a document
 */
data class DocumentStatistics(
    val annotatorCorrectness: Map<UserIdentifier, Boolean>,
    val annotatorsAgree: Boolean,
    val generatorCorrect: Boolean? = null
)

/**
 * Wrap the percent by storing [n], the [absolute] value as well as the calulcated percent value.
 */
data class PercentWrapper(
    val absolute: Int,
    val n: Int,
    val percentage: Double
)

/**
 * Wrap a time [average] with the [n] over which it was calculated
 */
data class TimeWrapper(
    val average: Double,
    val n: Int
)

/**
 * Analyzed individual annotation result
 */
data class AnalyzedAnnotationResult(
    val annotationResultID: AnnotationResultID,
    val timestamp: Long,
    val annotations: AnnotationMap,
    val creator: AnnotationResultCreator,
    val fullDuration: Long? = null,
    val interactionDuration: Long? = null
)

/**
 * Finalized annotation result used for the analze response
 */
data class FinalizedAnnotationResultForAnalysis(
    val annotationResultIDs: List<String>,
    val finalizedReason: FinalizedReason,
    val usedPolicy: Policy,
    val timestamp: Long
)

/**
 * Endpoint to analyze finalized results for a project
 */
@KtorExperimentalAPI
fun Route.analyzeProjectResults(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, projectDAO: ProjectDAO,
    documentDAO: DocumentDAO
) {
    route("/analyzeResults") {
        postAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val analyzeProject = call.receive<AnalyzeProjectRequest>()
            logger.info("Analyze results for query $analyzeProject")
            val projectID = analyzeProject.projectID
            try {
                val project = projectDAO.getProjectById(projectID)
                if (!project.userRoles.managers.contains(user.userIdentifier)) {
                    throw ForbiddenException(
                        "User not allowed to manage project ${project.id}"
                    )
                }
                val searchFilter = And(
                    KeyExists(
                        "projectAnnotationData.$projectID.finalizedAnnotationResults.timestamp",
                        true
                    ),
                    *(listOfNotNull(
                        if (analyzeProject.finalizedAfter != null) {
                            GreaterThanEquals("projectAnnotationData.$projectID.finalizedAnnotationResults.timestamp", analyzeProject.finalizedAfter)
                        } else {
                            null
                        }
                    ).toTypedArray()),
                    *(listOfNotNull(
                        if (analyzeProject.finalizedBefore != null) {
                            LessThanEquals("projectAnnotationData.$projectID.finalizedAnnotationResults.timestamp", analyzeProject.finalizedBefore)
                        } else {
                            null
                        }
                    ).toTypedArray()),
                    NotIn("_id", analyzeProject.ignoreDocumentIDs),
                    *(listOfNotNull(analyzeProject.additionalFilter).toTypedArray())
                )
                val documentsToAnalyze = documentDAO.findForSearch(
                    project,
                    searchFilter
                ).asSequence().filter {
                    it.projectAnnotationData[projectID]?.let { pad ->
                        pad.finalizedAnnotationResults.isNotEmpty() && when (val finalizedReason = pad.finalizedAnnotationResults
                            .maxBy { it.timestamp }?.finalizedReason) {
                            null -> false
                            is FinalizedReason.Policy -> true
                            is FinalizedReason.Curator -> analyzeProject.curators.isEmpty() || finalizedReason.curator in analyzeProject.curators
                        }
                    } == true }
                    .filter {
                        it.projectAnnotationData[projectID]?.let { pad ->
                            (analyzeProject.annotators.isEmpty() || pad.annotationResults.filter {
                                it.creator is AnnotationResultCreator.Annotator
                            }.allAndNotEmpty {
                                (it.creator as AnnotationResultCreator.Annotator).identifier in analyzeProject.annotators
                            }) && (analyzeProject.curators.isEmpty() || pad.annotationResults.filter {
                                it.creator is AnnotationResultCreator.Curator
                            }.all {
                                (it.creator as AnnotationResultCreator.Curator).identifier in analyzeProject.curators
                            })
                        } == true }
                    .filter {
                        it.projectAnnotationData[projectID]?.let { pad ->
                            analyzeProject.generatedAnnotationResultHandlingPolicyType == null || pad.annotationResults.filter {
                                it.creator is AnnotationResultCreator.Annotator
                            }.allAndNotEmpty { aR ->
                                when(analyzeProject.generatedAnnotationResultHandlingPolicyType) {
                                    HandlingPolicyType.IGNORE -> {
                                        aR.usedProject?.generatedAnnotationResultHandlingPolicy is HandlingPolicy.Ignore
                                    }
                                    HandlingPolicyType.PRESELECTION -> {
                                        aR.usedProject?.generatedAnnotationResultHandlingPolicy is
                                                HandlingPolicy.Preselection
                                    }
                                    HandlingPolicyType.GENERATOR_AS_ANNOTATOR -> {
                                        aR.usedProject?.generatedAnnotationResultHandlingPolicy is
                                                HandlingPolicy.GeneratorAsAnnotator
                                    }
                                }
                            }
                        } == true
                    }.map { doc ->
                        doc to (doc.projectAnnotationData[projectID]?.annotationResults?.filter {
                            it.id !in analyzeProject.ignoreAnnotationResultIDs
                        } ?: listOf()) }
                    .filter { it.second.isNotEmpty() }.toList().also { logger.warn("documentsToAnalyze size: ${it.size}") }
                .toMap()
                call.respond(analyzeDocuments(documentsToAnalyze, project, analyzeProject, user.userIdentifier))
            } catch (e: Exception) {
                call.respond(AnalyzeProjectResponse(projectID, listOf(), null, null, mapOf(), mapOf(), e.message))
            }
        }
    }
}

/**
 * Apply the filter from the [AnalyzeProjectRequest] to the list of to analyze documents for aggregation values
 */
fun List<AnalyzedDocument>.filterByRequestDocumentLevel(analyzeProject: AnalyzeProjectRequest): List<AnalyzedDocument> {
    return this.filter { doc ->
        if(analyzeProject.onlyGeneratorIncorrect) {
            // Here, we restrict analyzed Documents for accuracy to those, where the generator was incorrect
            doc.documentStatistics.generatorCorrect != null && !doc.documentStatistics.generatorCorrect
        } else {
            true
        } && if(analyzeProject.onlyAnnotatorDisagreement) {
            !doc.documentStatistics.annotatorsAgree
        } else {
            true
        } && if(analyzeProject.onlyAnyAnnotatorIncorrect) {
            doc.documentStatistics.annotatorCorrectness.any { !it.value }
        } else {
            true
        }
    }
}

/**
 * Analyze the given [documents] w.r.t accuracy, agreement etc.
 */
suspend fun analyzeDocuments(
    documents: Map<Document, List<AnnotationResult>>,
    project: Project,
    analyzeProject: AnalyzeProjectRequest,
    userIdentifier: UserIdentifier
): AnalyzeProjectResponse {
    val annotationSchema = project.annotationSchema.denormalize()
    logger.info("Analyzing agreement for AnnotationSchema elements ${annotationSchema.elements.joinToString(",") {
        it.annotationDefinition.id
    }}")
    val annotationNames = annotationSchema.elements.map { it.annotationDefinition.id to (it.annotationDefinition.shortName ?: it
        .annotationDefinition.name) }.toMap()
    logger.info("Input to AnalyzeAgreement: documents #${documents.size}, annotationResults #${documents.values.flatten().size}")
    val analyzedDocuments = documents.mapNotNull { (document, annotationResults) ->
        val finalizedAnnotationResult = document.projectAnnotationData[project.id]?.finalizedAnnotationResults?.maxBy { it.timestamp }
        val correctAnnotations = finalizedAnnotationResult?.annotationResultIDs?.firstOrNull()
            ?.let { resultID -> annotationResults.firstOrNull { it.id == resultID } }?.annotations
        if (finalizedAnnotationResult != null && correctAnnotations != null) {
            val analyzedAnnotationResults = annotationResults.map { annotationResult ->
                AnalyzedAnnotationResult(annotationResult.id, annotationResult.timestamp, annotationSchema.elements.mapNotNull { element ->
                    // We streamline annotation results to make sure they conform to the annotationSchema fully, removing unnecessary annotations
                    if ((element.enableCondition == null || element.enableCondition.execute(
                            document,
                            annotationResult.annotations
                        ))
                    ) {
                        if (annotationResult.annotations[element.annotationDefinition.id] != null) {
                            element.annotationDefinition.id to annotationResult.annotations[element.annotationDefinition.id]!!
                        } else {
                            null
                        }
                    } else {
                        null
                    }
                }.toMap().toMutableMap(), annotationResult.creator, annotationResult.interactionLog?.let {
                    if(it.lastInteractionTimestamp == 0L) {
                        logger.warn("AnnotationResult ${annotationResult.id} has 0 lastInteractionTimestamp (document ${document.id})")
                    }
                    it.lastInteractionTimestamp - it.firstShownTimestamp
                }, annotationResult.interactionLog?.let {
                    it.lastInteractionTimestamp - it.firstInteractionTimestamp
                })
            }
            AnalyzedDocument(document.id, document.storeTimestamp, document.applyInputMapping(project.inputMapping),
                documentStatistics = DocumentStatistics(
                    annotatorCorrectness = analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Annotator }
                        .map { (it.creator as AnnotationResultCreator.Annotator).identifier to (it.annotations == correctAnnotations) }.toMap(),
                    annotatorsAgree = analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Annotator }.all { outer ->
                        analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Annotator }
                            .all { it.annotations == outer.annotations }
                    },
                    generatorCorrect = analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Generators }
                            .maxBy { it.timestamp }?.let { it.annotations == correctAnnotations }
                ),
                perAnnotationStatistics = correctAnnotations.map { correct ->
                    correct.key to DocumentStatistics(
                        annotatorCorrectness = analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Annotator }
                            .map { (it.creator as AnnotationResultCreator.Annotator).identifier to (it.annotations[correct.key] == correct.value) }
                            .toMap(),
                        annotatorsAgree = analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Annotator }
                            .all { outer ->
                                analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Annotator }.all {
                                    it.annotations[correct.key] == outer.annotations[correct.key]
                                }
                            },
                        generatorCorrect = analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Generators }
                            .maxBy { it.timestamp }?.let { it.annotations[correct.key] == correct.value }
                    )
                }.toMap(),
                analyzedAnnotationResults = analyzedAnnotationResults,
                finalizedAnnotationResult = FinalizedAnnotationResultForAnalysis(
                    finalizedAnnotationResult.annotationResultIDs, finalizedAnnotationResult.finalizedReason, finalizedAnnotationResult.usedPolicy,
                    finalizedAnnotationResult.timestamp
                )
            )
        } else {
            logger.warn(
                "Document ${document.id} does not have correct annotations in results ${annotationResults
                    .joinToString(", ") { it.id }}"
            )
            null
        }
    }
    val allAnnotators = analyzedDocuments.flatMap {
        it.analyzedAnnotationResults.filter { it.creator is AnnotationResultCreator.Annotator }
            .map { (it.creator as AnnotationResultCreator.Annotator).identifier }
    }.toSet().sorted()
    // Per document statistics
    val analyzedDocumentsFilteredDocumentLevel = analyzedDocuments.filterByRequestDocumentLevel(analyzeProject)
    val annotatorAccuracy = allAnnotators.map { annotator ->
        annotator to analyzedDocumentsFilteredDocumentLevel
            .count { analyzedDocument -> analyzedDocument.documentStatistics
            .annotatorCorrectness[annotator] == true
        }.let { annotatorCorrectCount ->
            val numberOfResultsByAnnotator = analyzedDocumentsFilteredDocumentLevel
                .count { it.documentStatistics.annotatorCorrectness.containsKey(annotator) }
            PercentWrapper(
                annotatorCorrectCount, numberOfResultsByAnnotator, (annotatorCorrectCount.toDouble() /
                        numberOfResultsByAnnotator.toDouble())
            )
        }
    }.toMap()
    val documentAccuracyStatistics = AccuracyStatistics(
        interAnnotatorAgreement = PercentWrapper(
            analyzedDocumentsFilteredDocumentLevel.filter { it.documentStatistics.annotatorsAgree }.size,
            analyzedDocumentsFilteredDocumentLevel.size,
            (analyzedDocumentsFilteredDocumentLevel.filter {
                it.documentStatistics.annotatorsAgree
            }.size.toDouble() / analyzedDocumentsFilteredDocumentLevel.size.toDouble()).let {
                    if(it.isNaN()) 0.0 else it
            }
        ),
        annotatorAccuracy = annotatorAccuracy,
        averageAnnotatorAccuracy = annotatorAccuracy.values.let { it.map { it.percentage }.sum() / it.size.toDouble() },
        generatorAccuracy = analyzedDocumentsFilteredDocumentLevel.filter { it.documentStatistics.generatorCorrect != null }
            .map { it.documentStatistics.generatorCorrect }.let { generatorCorrectness ->
                PercentWrapper(generatorCorrectness.filter { it == true }.size,
                    generatorCorrectness.size,
                    (generatorCorrectness.filter { it == true }.size.toDouble() / generatorCorrectness.size.toDouble()).let {
                        if(it.isNaN()) 0.0 else it
                    }
                )
            }
    )
    // Per annotation statistics
    val perAnnotationAccuracyStatistics = annotationSchema.elements.map { element ->
        val annotationID = element.annotationDefinition.id
        val analyzedDocumentsFilteredForAnnotation = analyzedDocuments.filter { doc ->
            val annotationStatistics = doc.perAnnotationStatistics[annotationID]
            // If the annotation is not part of the document, filter it out anyway
            annotationStatistics != null && (if(analyzeProject.onlyGeneratorIncorrect) {
                // Here, we restrict analyzed Documents for accuracy to those, where the generator was incorrect for the annotation
                annotationStatistics.generatorCorrect != null && !annotationStatistics.generatorCorrect
            } else {
                true
            } && if(analyzeProject.onlyAnnotatorDisagreement) {
                !annotationStatistics.annotatorsAgree
            } else {
                true
            } && if(analyzeProject.onlyAnyAnnotatorIncorrect) {
                annotationStatistics.annotatorCorrectness.any { !it.value }
            } else {
                true
            })
        }
        val perAnnotatorAccuracy = allAnnotators.map { annotator ->
            annotator to analyzedDocumentsFilteredForAnnotation.mapNotNull {
                it.perAnnotationStatistics[annotationID]?.annotatorCorrectness?.get(annotator)
            }.let { PercentWrapper(it.filter { it }.size, it.size, (it.filter { it }.size.toDouble() / it.size.toDouble()).let {
                if(it.isNaN()) 0.0 else it
            })}
        }.toMap()

        element.annotationDefinition.id to AccuracyStatistics(
            interAnnotatorAgreement = analyzedDocumentsFilteredForAnnotation.mapNotNull {
                it.perAnnotationStatistics[element.annotationDefinition.id]?.annotatorsAgree
            }.let { PercentWrapper(it.filter { it }.size, it.size, (it.filter { it }.size.toDouble() / it.size.toDouble()).let {
                if(it.isNaN()) 0.0 else it
            })},
            annotatorAccuracy = perAnnotatorAccuracy,
            averageAnnotatorAccuracy = perAnnotatorAccuracy.values.let { it.map { it.percentage }.sum() / it.size.toDouble() }.let {
                if(it.isNaN()) 0.0 else it
            },
            generatorAccuracy = analyzedDocumentsFilteredForAnnotation.mapNotNull {
                it.perAnnotationStatistics[element.annotationDefinition.id]?.generatorCorrect
            }.let { PercentWrapper(it.filter { it }.size, it.size, (it.filter { it }.size.toDouble() / it.size.toDouble()).let {
                if(it.isNaN()) 0.0 else it
            })}
        )
    }.toMap()
    // Response
    return AnalyzeProjectResponse(project.id,
        // We use thr document level filtered results, because those are most inclusive because 1 error / disagreement is enough
        analyzedDocumentsFilteredDocumentLevel,
        TopLevelStatistics(
            documentAccuracyStatistics = documentAccuracyStatistics,
            perAnnotationAccuracyStatistics = perAnnotationAccuracyStatistics,
            perAnnotatorAverageFullDuration = allAnnotators.map { annotator ->
                annotator to analyzedDocumentsFilteredDocumentLevel.flatMap { it.analyzedAnnotationResults }
                    .filter { it.creator is AnnotationResultCreator.Annotator && it.creator.identifier == annotator }
                    .let {
                        it.filter { it.fullDuration != null }.let {
                            TimeWrapper((it.map { it.fullDuration!! }.sum() / it.size.toDouble()).let {
                                if(it.isNaN()) 0.0 else it
                            }, it.size)
                        }
                    }
            }.toMap(),
            averageAnnotatorFullDuration = allAnnotators.map { annotator ->
                analyzedDocumentsFilteredDocumentLevel.flatMap { it.analyzedAnnotationResults }.filter {
                    it.creator is AnnotationResultCreator.Annotator && it.creator
                        .identifier == annotator
                }.let {
                    it.filter { it.fullDuration != null }.let {
                        (it.map { it.fullDuration!! }.sum() / it.size.toDouble()).let {
                            if(it.isNaN()) 0.0 else it
                        }
                    }
                }
            }.let { it.sum() / it.size.toDouble() },
            perAnnotatorAverageInteractionDuration = allAnnotators.map { annotator ->
                annotator to analyzedDocumentsFilteredDocumentLevel.flatMap { it.analyzedAnnotationResults }.filter {
                    it.creator is AnnotationResultCreator.Annotator && it.creator
                        .identifier == annotator
                }.let {
                    it.filter { it.interactionDuration != null }.let {
                        TimeWrapper((it.map { it.interactionDuration!! }.sum() / it.size.toDouble()).let {
                            if(it.isNaN()) 0.0 else it
                        }, it.size)
                    }
                }
            }.toMap(),
            averageAnnotatorInteractionDuration = allAnnotators.map { annotator ->
                analyzedDocumentsFilteredDocumentLevel.flatMap { it.analyzedAnnotationResults }.filter {
                    it.creator is AnnotationResultCreator.Annotator && it.creator
                        .identifier == annotator
                }.let {
                    it.filter { it.interactionDuration != null }.let {
                        (it.map { it.interactionDuration!! }.sum() / it.size.toDouble()).let {
                            if(it.isNaN()) 0.0 else it
                        }
                    }
                }
            }.let { (it.sum() / it.size.toDouble()).let {
                if(it.isNaN()) 0.0 else it
            }}
        ),
        project.toAnnotateProject(userIdentifier, true),
        annotationNames,
        allAnnotators.map { it to (userDAO.byUserIdentifier(it)?.userName ?: it) }.toMap()
    )
}