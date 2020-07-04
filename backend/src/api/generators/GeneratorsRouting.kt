package api.generators

import annotationdefinition.TagSetAnnotationDefinition
import annotationdefinition.generator.AnnotationGenerator
import annotationdefinition.generator.UpdatableAnnotationGenerator
import annotationdefinition.generator.UpdatableAnnotationGeneratorVersion
import annotationdefinition.generator.UpdateState
import annotationdefinition.generator.documenttarget.toTrainingData
import annotationdefinition.target.TargetType
import application.ApplicationConfig
import application.annotationDefinitionDAO
import application.annotationGeneratorDAO
import common.getAuthenticatedByJwt
import common.postAuthenticatedByJwt
import document.DocumentDAO
import document.annotation.DocumentTargetAnnotation
import document.annotation.SpanTargetAnnotation
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import project.ProjectDAO
import project.annotationschema.generator.GeneratorTiming
import project.annotationschema.generator.generateMissingAnnotationsForAllDocumentsBulk
import project.filter.And
import project.filter.FilterCondition


private val logger = LoggerFactory.getLogger("GeneratorsRouting")

/**
 * Routes related to interacting with [AnnotationGenerator]s, especially the [UpdatableAnnotationGenerator]s.
 */
@KtorExperimentalAPI
fun Route.generators(applicationConfig: ApplicationConfig, projectDAO: ProjectDAO, documentDAO: DocumentDAO) {
    route("/generators") {
        /*
         * Generate annotations for all documents with missing annotation generations for all projects with automation activated
         */
        getAuthenticatedByJwt("/generateAnnotations", listOf(applicationConfig.jwt.roleProducer)) {
            val chunkSize = call.request.queryParameters["chunkSize"]?.toInt() ?: 100
            val limit = call.request.queryParameters["limit"]?.toInt() ?: Int.MAX_VALUE
            projectDAO.getAllActive().forEach { project ->
                if(project.annotationSchema.generatedAnnotationResultHandling.generatorTiming.let {
                        it == GeneratorTiming.Always || it == GeneratorTiming.OnGenerateMissingAnnotationsRequest
                    }) {
                    project.generateMissingAnnotationsForAllDocumentsBulk(chunkSize, limit)
                }
            }
            call.respond(HttpStatusCode.OK)
        }

        /*
         * Generate annotations for a specific project, will only generate missing annotations or when new versions of generators exist
         */
        getAuthenticatedByJwt("/generateAnnotations/project/{projectID}", listOf(applicationConfig.jwt.roleProducer)) {
            val chunkSize = call.request.queryParameters["chunkSize"]?.toInt() ?: 100
            val limit = call.request.queryParameters["limit"]?.toInt() ?: Int.MAX_VALUE
            val projectID = call.parameters["projectID"] ?: throw IllegalArgumentException("Project ID cannot be null")
            projectDAO.getProjectById(projectID).let { project ->
                if(project.annotationSchema.generatedAnnotationResultHandling.generatorTiming.let {
                        logger.info("GeneratorTiming of ${project.id} is $it")
                        (it == GeneratorTiming.Always || it == GeneratorTiming.OnGenerateMissingAnnotationsRequest)
                    }) {
                    project.generateMissingAnnotationsForAllDocumentsBulk(chunkSize, limit)
                } else {
                    logger.warn("Project does not support generation of annotation data via this API")
                }
            }
            call.respond(HttpStatusCode.OK)
        }

        /*
         * Call [UpdatableAnnotationGenerator]s update method to let them allow to update themselves. Call this through a cron job or something
         * similar.
         */
        getAuthenticatedByJwt("/update", listOf(applicationConfig.jwt.roleProducer)) {
            annotationGeneratorDAO.getAll().forEach { annotationGenerator ->
                updateAnnotationGenerator(annotationGenerator, documentDAO)
            }
            call.respond(HttpStatusCode.OK)
        }

        getAuthenticatedByJwt("/update/{generatorID}", listOf(applicationConfig.jwt.roleProducer)) {
            val generatorID = call.parameters["generatorID"] ?: throw IllegalArgumentException("GeneratorID cannot be null")
            updateAnnotationGenerator(annotationGeneratorDAO.byId(generatorID), documentDAO)
            call.respond(HttpStatusCode.OK)
        }

        /*
         * Given a generator, get the associated data
         * currently only works for tag set annotation definitions
         */
        postAuthenticatedByJwt("/data/{generatorID}", listOf(applicationConfig.jwt.roleProducer, applicationConfig.jwt.roleAdmin),
            onlyOneMustMatch = true) {
            val request: DataForGeneratorRequest = call.receive()
            val generatorID = call.parameters["generatorID"] ?: throw IllegalArgumentException("GeneratorID cannot be null")
            val generator = annotationGeneratorDAO.byId(generatorID)
            val annotationDefinition = annotationDefinitionDAO.byId(generator.annotationDefinitionID)
            if(generator is UpdatableAnnotationGenerator && annotationDefinition is TagSetAnnotationDefinition) {
                val data = documentDAO.findForFilter(And(generator.dataFilter,
                    *listOfNotNull(request.filter).toTypedArray()))
                    .map { document ->
                        document to document.projectAnnotationData.mapNotNull { entry ->
                            entry.value.finalizedAnnotationResults.maxBy { it.timestamp }?.let { finalizedAnnotationResult ->
                                finalizedAnnotationResult.annotationResultIDs
                                    .map { id -> entry.value.annotationResults.first { it.id == id } }
                            }
                        }.flatten()
                    }.toMap()
                val trainingData = data.map { it.key to it.value.map { it.annotations } }
                    .toMap().toTrainingData(annotationDefinition, generator.input)
                call.respond(trainingData)
            } else {
                call.respond(HttpStatusCode.BadRequest)
            }
        }
    }
}

data class DataForGeneratorRequest(
    val filter: FilterCondition? = null
)

suspend fun updateAnnotationGenerator(annotationGenerator: AnnotationGenerator, documentDAO: DocumentDAO) {
    if (annotationGenerator is UpdatableAnnotationGenerator) {
        logger.info("Starting update of ${annotationGenerator.id}")
        annotationGenerator.versions.maxBy { it.createdTimestamp }.let { latestVersion ->
            when (latestVersion?.updateState) {
                UpdateState.UPDATING -> {
                    logger.warn("Update in progress, skipping this update call for $annotationGenerator")
                }
                null, UpdateState.NOT_UPDATED, UpdateState.UPDATED -> {
                    val annotationDefinition = annotationDefinitionDAO.byIdOrNull(annotationGenerator.annotationDefinitionID)
                    requireNotNull(annotationDefinition) {
                        "AnnotationDefinition for id ${annotationGenerator.annotationDefinitionID} not found"
                    }
                    // For every document, get the most common annotation value for the related annotation
                    // Normally, this should be either only one anyway, or always the same
                    // Just for edge cases, we do a groupingBy + eachCount + maxBy, to get one DocumentAnnotation per Document
                    val data = documentDAO.findForFilter(annotationGenerator.dataFilter)
                        .map { document ->
                            document to document.projectAnnotationData.mapNotNull { entry ->
                                entry.value.finalizedAnnotationResults.maxBy { it.timestamp }?.let { finalizedAnnotationResult ->
                                    finalizedAnnotationResult.annotationResultIDs
                                        .map { id -> entry.value.annotationResults.first { it.id == id } }
                                }
                            }.flatten()
                        }.toMap()
                    val dataForAnnotation = data.mapNotNull { entry ->
                        val annotationResult = entry.value.mapNotNull {
                            it.annotations[annotationDefinition.id]?.let { annotation ->
                                when(annotationGenerator.targetType) {
                                    TargetType.DOCUMENT_TARGET -> {
                                        if(annotation is DocumentTargetAnnotation) it else null
                                    }
                                    TargetType.SPAN_TARGET -> {
                                        if(annotation is SpanTargetAnnotation) it else null
                                    }
                                }
                            }
                        }.groupingBy { it }.eachCount().maxBy { it.value }?.key
                        if(annotationResult != null) entry.key to annotationResult else null
                    }.toMap()
                    logger.info("Queried data for ${annotationGenerator.id}: ${data.size} documents, ${dataForAnnotation.size} " +
                            "for the annotation ${annotationDefinition.id}")
                    if (dataForAnnotation.size >= annotationGenerator.startThreshold) {
                        val doUpdate = when (latestVersion?.updateState) {
                            null -> {
                                // No existing version yet, we can start now
                                annotationGenerator.versions.add(
                                    UpdatableAnnotationGeneratorVersion(
                                        System.currentTimeMillis(), UpdateState.UPDATING, null
                                    )
                                )
                                true
                            }
                            UpdateState.NOT_UPDATED -> {
                                // A not updated version exists, indicating something went wrong the last time. Will retry
                                true
                            }
                            UpdateState.UPDATED -> {
                                val previousDataSize = latestVersion.updateResponse?.numberOfExamples ?: 0
                                logger.info("${annotationGenerator.id}: ${dataForAnnotation.size} documents for annotation " +
                                        "${annotationDefinition.id} (previous size: $previousDataSize, updateThreshold: " +
                                        "${annotationGenerator.updateThreshold})")
                                if (dataForAnnotation.size - previousDataSize >= annotationGenerator.updateThreshold) {
                                    // We add a new version here
                                    annotationGenerator.versions.add(
                                        UpdatableAnnotationGeneratorVersion(
                                            System.currentTimeMillis(), UpdateState.UPDATING, null
                                        )
                                    )
                                    true
                                } else {
                                    false
                                }
                            }
                            else -> false
                        }
                        if (doUpdate) {
                            try {
                                logger.info("Will update ${annotationGenerator.id}")
                                annotationGenerator.update(annotationGenerator.versions.maxBy { it.createdTimestamp }!!, data)
                            } catch (e: Exception) {
                                annotationGenerator.versions.maxBy { it.createdTimestamp }!!.updateState = UpdateState.NOT_UPDATED
                                logger.error("Could not update $annotationGenerator", e)
                            } finally {
                                annotationGeneratorDAO.save(annotationGenerator)
                            }
                        }
                    } else {
                        logger.info("Not enough data yet for any training")
                    }
                }
            }
        }

    } else {
        logger.warn("Update in progress, skipping this update call")
    }
}