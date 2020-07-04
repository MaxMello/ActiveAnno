package api.annotate

import api.annotate.dto.*
import application.ApplicationConfig
import application.annotationGeneratorDAO
import application.jsonMapper
import application.userDAO
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.core.type.TypeReference
import common.*
import document.*
import document.annotation.*
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
import project.UsedAnnotateProject
import user.UserDAO
import java.util.*

private val logger = LoggerFactory.getLogger("CurateRouting")

/**
 * Data class for receiving an accepted annotation result by ID
 */
internal data class AcceptAnnotationResult(
    val acceptedAnnotationResultID: AnnotationResultID,
    val documentID: DocumentID,
    val projectID: ProjectID
)

/**
 * Model for curation processes in the frontend, similar to [AnnotationDocument], but also containing the existing
 * annotations
 */
internal data class CurationDocument(
    val documentID: DocumentID,
    val projectID: ProjectID,
    val documentData: Map<String, Any>,
    val annotationResults: List<AnnotationResultDTO>,
    val annotations: AnnotationMap,
    val annotationConditions: List<AnnotationEnableConditionResult>
)

/**
 * DTO for an [AnnotationResult] with merged usernames for [AnnotationResultCreator] as [AnnotationResultCreatorDTO]
 */
internal data class AnnotationResultDTO(
    val id: AnnotationResultID,
    val documentID: DocumentID,
    val projectID: ProjectID,
    val timestamp: Long,
    val annotations: AnnotationMap,
    val creator: AnnotationResultCreatorDTO,
    val interactionLog: InteractionLog? = null,
    val documentData: Map<String, Any>? = null,
    val usedProject: UsedAnnotateProject? = null
)

/**
 * Equivalent to [AnnotationResultCreator] but streamlined to a single [displayName] for the frontend
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = AnnotationResultCreatorDTO.Annotator::class, name = "Annotator"),
        JsonSubTypes.Type(value = AnnotationResultCreatorDTO.Curator::class, name = "Curator"),
        JsonSubTypes.Type(value = AnnotationResultCreatorDTO.Generators::class, name = "Generators"),
        JsonSubTypes.Type(value = AnnotationResultCreatorDTO.Import::class, name = "Import"),
        JsonSubTypes.Type(value = AnnotationResultCreatorDTO.Consensus::class, name = "Consensus")
    ]
)
sealed class AnnotationResultCreatorDTO {
    abstract val displayName: String

    data class Annotator(override val displayName: String) : AnnotationResultCreatorDTO()
    data class Curator(override val displayName: String) : AnnotationResultCreatorDTO()
    data class Generators(override val displayName: String): AnnotationResultCreatorDTO()
    data class Import(override val displayName: String): AnnotationResultCreatorDTO()
    data class Consensus(override val displayName: String) : AnnotationResultCreatorDTO()
}

/**
 * Convert [AnnotationResultCreator] to [AnnotationResultCreatorDTO]
 */
suspend fun AnnotationResultCreator.mapAnnotationResultCreatorToDTO(): AnnotationResultCreatorDTO {
    return when(this) {
        is AnnotationResultCreator.Annotator -> {
            AnnotationResultCreatorDTO.Annotator(
                userDAO.byUserIdentifier(identifier)?.userName ?: identifier
            )
        }
        is AnnotationResultCreator.Curator -> {
            AnnotationResultCreatorDTO.Curator(
                userDAO.byUserIdentifier(identifier)?.userName ?: identifier
            )
        }
        is AnnotationResultCreator.Generators -> {
            AnnotationResultCreatorDTO.Generators(
                ids.map { annotationGeneratorDAO.byIdOrNull(it)?.name ?: it }.joinToString(", ")
            )
        }
        is AnnotationResultCreator.Import -> {
            AnnotationResultCreatorDTO.Import(
                userDAO.byUserIdentifier(identifier)?.userName ?: identifier
            )
        }
        is AnnotationResultCreator.Consensus -> {
            AnnotationResultCreatorDTO.Consensus(
                creators.map { it.mapAnnotationResultCreatorToDTO() }.sortedBy { it.displayName }.joinToString(", ")
            )
        }
    }
}

/**
 * Convert [AnnotationResult] to [AnnotationResultDTO]
 */
internal suspend fun AnnotationResult.toAnnotationResultDTO(): AnnotationResultDTO {
    return AnnotationResultDTO(id, documentID, projectID, timestamp,
        annotations, creator.mapAnnotationResultCreatorToDTO(), interactionLog, documentData, usedProject)
}

/**
 * Convert a [Document] to a [CurationDocument] for the frontend
 */
internal suspend fun Document.toCurationDocument(project: Project): CurationDocument {
    return CurationDocument(
        id,
        project.id,
        applyInputMapping(project.inputMapping),
        projectAnnotationData[project.id]?.annotationResults?.map { it.toAnnotationResultDTO() } ?: listOf(),
        mutableMapOf(),
        buildAnnotationConditions(this.id, project.id, project.layout, mutableMapOf())
    )
}

/**
 * Curate routes are used by the frontend for users that are curators for a project. Therefore, it provides
 * endpoints to get projects for curation as well as documents, and endpoints to post the annotation results
 */
@KtorExperimentalAPI
fun Route.curate(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, projectDAO: ProjectDAO,
    documentDAO: DocumentDAO
) {
    route("/curate") {
        getAuthenticatedByJwt("/project", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.respond(projectDAO.getCurateProjectsForUser(user.userIdentifier).map { it.toListProject() })
        }
        getAuthenticatedByJwt("/project/{projectID}", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val projectID = call.parameters["projectID"]
            if (projectID != null) {
                measureTimeMillis({ time -> logger.info("Get curate project $projectID in $time ms")}) {
                    call.respond(projectDAO.getProjectById(projectID).also {
                        if (!it.userRoles.curators.contains(user.userIdentifier)) throw ForbiddenException(
                            "User not allowed to curate project $projectID"
                        )
                    }.toAnnotateProject(user.userIdentifier, true))
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
                if (!project.userRoles.curators.contains(user.userIdentifier)) {
                    throw ForbiddenException("UserRoles not allowed to curate project $projectID")
                }
                measureTimeMillis({ time -> logger.info("Get documents to curate for $projectID in $time ms")}) {
                    call.respond(
                        documentDAO.findForCuration(project, user.userIdentifier, limit, ignoreDocuments, subFilter, dateRange).map {
                            it.toCurationDocument(
                                project
                            )
                        })
                }
            } else {
                call.respond(HttpStatusCode.BadRequest)
            }
        }
        postAuthenticatedByJwt("/annotationResult", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val postAnnotationResult = call.receive<PostAnnotationResult>()
            val project = projectDAO.getProjectById(postAnnotationResult.projectID)
            if (!project.userRoles.curators.contains(user.userIdentifier)) {
                throw ForbiddenException("User not allowed to curate for project ${project.id}")
            }
            val response = documentDAO.byId(postAnnotationResult.documentID).let { document ->
                val validationErrors = postAnnotationResult
                    .validate(document, project, call.preferredSupportedLocaleOrDefault())
                if (validationErrors.isEmpty()) {
                    val resultID = UUID.randomUUID().toString()
                    document.addAnnotationResultForProject(
                        project, AnnotationResult(
                            resultID,
                            document.id,
                            postAnnotationResult.projectID,
                            System.currentTimeMillis(),
                            postAnnotationResult.annotations.removeProbabilities(), // Annotator results have no probabilities
                            AnnotationResultCreator.Curator(
                                user.userIdentifier
                            ),
                            postAnnotationResult.interactionLog,
                            postAnnotationResult.documentData,
                            postAnnotationResult.usedProject
                        ), checkWebHooks = false, applyPolicy = false
                    )
                    document.addFinalizedAnnotationResultForProject(
                        project,
                        FinalizedAnnotationResult(
                            listOf(resultID),
                            FinalizedReason.Curator(user.userIdentifier),
                            project.policy,
                            System.currentTimeMillis()
                        ),
                        checkWebHooks = true, applyPolicy = true
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
        postAuthenticatedByJwt("/acceptAnnotationResult", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val acceptAnnotationResult = call.receive<AcceptAnnotationResult>()
            val project = projectDAO.getProjectById(acceptAnnotationResult.projectID)
            if (!project.userRoles.curators.contains(user.userIdentifier)) {
                throw ForbiddenException("User not allowed to curate for project ${project.id}")
            }
            val response = documentDAO.byId(acceptAnnotationResult.documentID).let { document ->
                document.addFinalizedAnnotationResultForProject(
                    project,
                    FinalizedAnnotationResult(
                        listOf(acceptAnnotationResult.acceptedAnnotationResultID),
                        FinalizedReason.Curator(user.userIdentifier), project.policy,
                        System.currentTimeMillis(), ExportStatistics()
                    ),
                    checkWebHooks = true, applyPolicy = true
                )
                val success = documentDAO.updateAndValidate(acceptAnnotationResult.documentID, document)
                if (success) {
                    AnnotationResultStoreResponse(project.id, document.id, true, listOf())
                } else {
                    AnnotationResultStoreResponse(project.id, document.id, false, listOf())
                }
            }
            call.respond(response)
        }
    }
}