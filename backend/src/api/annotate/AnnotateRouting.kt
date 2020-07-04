package api.annotate

import api.annotate.dto.*
import application.ApplicationConfig
import application.jsonMapper
import com.fasterxml.jackson.core.type.TypeReference
import common.*
import document.*
import document.annotation.AnnotationMap
import document.annotation.AnnotationResult
import document.annotation.AnnotationResultCreator
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import project.Project
import project.ProjectDAO
import project.ProjectID
import project.annotationschema.generator.GeneratorTiming
import project.annotationschema.generator.HandlingPolicy
import project.annotationschema.generator.generateMissingAnnotationsForAllDocumentsBulk
import user.UserDAO
import java.util.*

private val logger = LoggerFactory.getLogger("AnnotateRouting")

/**
 * Model for annotating a document for the frontend
 */
data class AnnotationDocument(
    val documentID: DocumentID,
    val projectID: ProjectID,
    val documentData: Map<String, Any>,
    /**
     * For potential preselection, these values are already sent to the frontend
     */
    val annotations: AnnotationMap,
    val annotationConditions: List<AnnotationEnableConditionResult>
)

/**
 * Convert a document to a [AnnotationDocument] for frontend processing.
 */
internal suspend fun Document.toAnnotationDocument(project: Project): AnnotationDocument {
    val generatedAnnotations = if (project.annotationSchema.generatedAnnotationResultHandling.handlingPolicy
                is HandlingPolicy.Preselection) {
        projectAnnotationData[project.id]?.generatedAnnotationData?.maxBy { it.timestamp }?.annotations?.let { annotationMap ->
            if(project.annotationSchema.generatedAnnotationResultHandling.handlingPolicy.showProbabilities) {
                annotationMap
            } else {
                // Remove probabilities from the DTO
                annotationMap.removeProbabilities()
            }
        } ?: mutableMapOf()
    } else {
        mutableMapOf()
    }
    return AnnotationDocument(
        id, project.id, applyInputMapping(project.inputMapping),
        generatedAnnotations,
        buildAnnotationConditions(this.id, project.id, project.layout, generatedAnnotations)
    )
}

/**
 * Annotate routes are used by the frontend for users that are annotators for a project. Therefore, it provides
 * endpoints to get projects for annotation as well as documents, and endpoints to post the annotation results
 */
@KtorExperimentalAPI
fun Route.annotate(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, projectDAO: ProjectDAO,
    documentDAO: DocumentDAO
) {
    route("/annotate") {
        getAuthenticatedByJwt("/project", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            measureTimeMillis({ time -> logger.info("Get annotate projects for user in $time ms")}) {
                call.respond(projectDAO.getAnnotateProjectsForUser(user.userIdentifier).map { it.toListProject() })
            }
        }
        getAuthenticatedByJwt("/project/{projectID}", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val projectID = call.parameters["projectID"]
            if (projectID != null) {
                measureTimeMillis({ time -> logger.info("Get annotate project $projectID in $time ms")}) {
                    call.respond(projectDAO.getProjectById(projectID).also {
                        if (!it.userRoles.annotators.contains(user.userIdentifier)) throw ForbiddenException(
                            "UserRoles not allowed to annotate project $projectID"
                        )
                    }.toAnnotateProject(user.userIdentifier))
                }
            } else {
                call.respond(HttpStatusCode.BadRequest)
            }
        }
        getAuthenticatedByJwt("/project/{projectID}/document", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val projectID = call.parameters["projectID"]
            val limit = call.request.queryParameters["limit"]?.toInt() ?: 5
            val ignoreDocuments = call.request.queryParameters["ignoreDocuments"]?.split(",")?.filter { it.isNotBlank() } ?: listOf()
            val subFilter: Map<String, String> = call.request.queryParameters["subFilter"]?.let {
                withContext(Dispatchers.IO) {
                    jsonMapper.readValue(it, object : TypeReference<Map<String, String>>() {})
                }
            } ?: mapOf()
            val dateRange = call.request.queryParameters["dateRange"]?.let {
                withContext(Dispatchers.IO) {
                    jsonMapper.readValue(it, object : TypeReference<List<Long?>>() {})
                }
            }
            if (projectID != null) {
                val project = projectDAO.getProjectById(projectID)
                if (!project.userRoles.annotators.contains(user.userIdentifier)) {
                    throw ForbiddenException("UserRoles not allowed to manage project $projectID")
                }
                measureTimeMillis({ time -> logger.info("Generated missing annotations for $projectID in $time ms")}) {
                    if (project.annotationSchema.generatedAnnotationResultHandling.generatorTiming.let {
                            it == GeneratorTiming.Always || it == GeneratorTiming.OnGetDocumentRequest
                        }) {
                        project.generateMissingAnnotationsForAllDocumentsBulk()
                    }
                }
                val documents = measureTimeMillis({ time -> logger.info("Get documents for $projectID in $time ms")}) {
                    documentDAO.findForAnnotation(
                        project, user.userIdentifier, limit, ignoreDocuments, subFilter, dateRange
                    )
                }
                call.respond(documents.map { it.toAnnotationDocument(project) })
            } else {
                call.respond(HttpStatusCode.BadRequest)
            }
        }
        postAuthenticatedByJwt("/annotationResult", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val postAnnotationResult = call.receive<PostAnnotationResult>()
            val project = projectDAO.getProjectById(postAnnotationResult.projectID)
            if (!project.userRoles.annotators.contains(user.userIdentifier)) {
                throw ForbiddenException("User not allowed to annotate for project ${project.id}")
            }
            val response = documentDAO.byId(postAnnotationResult.documentID).let { document ->
                val validationErrors = postAnnotationResult.validate(document, project, call.preferredSupportedLocaleOrDefault())
                if (validationErrors.isEmpty()) {
                    document.addAnnotationResultForProject(
                        project, AnnotationResult(
                            UUID.randomUUID().toString(),
                            document.id,
                            postAnnotationResult.projectID,
                            System.currentTimeMillis(),
                            postAnnotationResult.annotations.removeProbabilities(), // Annotator results have no probabilities
                            AnnotationResultCreator.Annotator(
                                user.userIdentifier
                            ),
                            postAnnotationResult.interactionLog,
                            postAnnotationResult.documentData,
                            postAnnotationResult.usedProject
                        ), checkWebHooks = true, applyPolicy = true, overwriteFinalizedAnnotations = false,
                        curationRequest = postAnnotationResult.curationRequest
                    )
                    val success = documentDAO.updateAndValidate(postAnnotationResult.documentID, document)
                    if (success) {
                        AnnotationResultStoreResponse(project.id, document.id, true, listOf())
                    } else {
                        AnnotationResultStoreResponse(project.id, document.id, false, listOf())
                    }
                } else {
                    AnnotationResultStoreResponse(project.id, document.id, false, validationErrors)
                }
            }
            call.respond(response)
        }
        postAuthenticatedByJwt("/checkEnableConditions", listOf(applicationConfig.jwt.roleUser)) {
            val body = call.receive<CheckEnableConditionRequestBody>()
            call.respond(CheckEnableConditionResponse(body.documentID, body.usedProject.id, buildAnnotationConditions(
                body.documentID,
                body.usedProject.id,
                body.usedProject.layout,
                body.annotations
            )))
        }
    }
}