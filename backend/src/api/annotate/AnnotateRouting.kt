package api.annotate

import application.ApplicationConfig
import common.*
import config.*
import config.export.checkWebHooks
import config.inputmapping.InputMapping
import config.policy.applyPolicy
import document.*
import document.annotation.*
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import user.UserDAO
import java.util.*

private val logger = LoggerFactory.getLogger("AnnotateRouting")

/**
 * Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into
 * other data structures for storing.
 */
data class PostAnnotationResult(
    val documentID: String,
    val configurationID: String,
    val documentData: Map<String, Any>,
    val documentAnnotations: Map<String, DocumentAnnotation>,
    val spanAnnotations: Map<String, List<SpanAnnotation>>,
    val usedConfig: AnnotateConfig,
    val interactionLog: InteractionLog,
    val curationRequest: String? = null
)

/**
 * Wrapper data class for reciving annotations
 */
data class PostAnnotationResults(
    val annotations: List<PostAnnotationResult>
)

/**
 * Model for annotating a document for the frontend
 */
data class AnnotationDocument(
    val documentID: String,
    val configurationID: String,
    val documentData: Map<String, Any>
)

/**
 * Return model for storing endpoints, letting the frontend know the data was stored successfully.
 */
data class AnnotationStored(
    val configurationID: String,
    val documentID: String
)

/**
 * Convert a document to a [AnnotationResult] for frontend processing.
 */
internal fun Document.toAnnotationDocument(configurationID: String, inputMapping: InputMapping): AnnotationDocument {
    return AnnotationDocument(_id!!, configurationID, applyInputMapping(inputMapping))
}

/**
 * Annotate routes are used by the frontend for users that are annotators for a config. Therefore, it provides
 * endpoints to get configs for annotation as well as documents, and endpoints to post the annotation results
 */
@KtorExperimentalAPI
fun Route.annotate(applicationConfig: ApplicationConfig, userDAO: UserDAO, projectConfigDAO: ProjectConfigDAO,
                   documentDAO: DocumentDAO) {
    route("/annotate") {
        getAuthenticatedByJwt("/config", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.respond(projectConfigDAO.getAnnotateConfigsForUser(user.userIdentifier).map { it.toListConfig() })
        }
        getAuthenticatedByJwt("/config/{configID}", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val configID = call.parameters["configID"]
            if (configID != null) {
                call.respond(projectConfigDAO.getConfigById(configID).also {
                    if (!it.userRoles.annotators.contains(user.userIdentifier)) throw AuthorizationException(
                        "UserRoles not allowed to annotate config $configID"
                    )
                }.toAnnotateConfig())
            } else {
                call.respond(HttpStatusCode.BadRequest)
            }
        }
        getAuthenticatedByJwt("/config/{configID}/document", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val configID = call.parameters["configID"]
            val limit = call.request.queryParameters["limit"]?.toInt() ?: 3
            val ignoreDocuments = call.request.queryParameters["ignoreDocuments"]?.split(",") ?: listOf()
            if(configID != null) {
                val config = projectConfigDAO.getConfigById(configID)
                if(!config.userRoles.annotators.contains(user.userIdentifier)) {
                    throw AuthorizationException("UserRoles not allowed to manage config $configID")
                }
                call.respond(
                    documentDAO.findForAnnotation(config, user.userIdentifier, limit, ignoreDocuments).map {
                        it.toAnnotationDocument(
                            configID,
                            config.inputMapping
                        )
                    })
            } else {
                call.respond(HttpStatusCode.BadRequest)
            }
        }
        postAuthenticatedByJwt("/annotation") {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val annotations = call.receive<PostAnnotationResults>().annotations
            logger.info("Annotations: $annotations")
            val successfullyStored = annotations.mapNotNull { postAnnotationResult ->
                documentDAO.byId(postAnnotationResult.documentID)?.let { document ->
                    if (!document.configAnnotationData.containsKey(postAnnotationResult.configurationID)) {
                        document.configAnnotationData[postAnnotationResult.configurationID] = ConfigAnnotationData()
                    }
                    document.configAnnotationData[postAnnotationResult.configurationID]!!.run {
                        this.annotations.add(
                            AnnotationResult(
                                UUID.randomUUID().toString(),
                                document._id!!,
                                postAnnotationResult.configurationID,
                                System.currentTimeMillis(),
                                postAnnotationResult.documentAnnotations,
                                postAnnotationResult.spanAnnotations,
                                listOf(
                                    AnnotationResultCreator(
                                        user.userIdentifier,
                                        AnnotationResultCreatorType.ANNOTATOR
                                    )
                                ),
                                postAnnotationResult.interactionLog,
                                postAnnotationResult.documentData,
                                postAnnotationResult.usedConfig
                            )
                        )
                        val config = projectConfigDAO.getConfigById(postAnnotationResult.configurationID)
                        this.policyAction = config.policy.applyPolicy(
                                postAnnotationResult.configurationID,
                                document,
                                false,
                                postAnnotationResult.curationRequest
                            )
                        config.export.checkWebHooks(postAnnotationResult.configurationID, document)
                    }
                    documentDAO.update(postAnnotationResult.documentID, document).let {
                        if (it.wasAcknowledged()) {
                            AnnotationStored(
                                postAnnotationResult.configurationID,
                                postAnnotationResult.documentID
                            )
                        } else {
                            logger.error("Could not update document table, was not acknowledged: $it")
                            null
                        }
                    }
                } ?: null.also { logger.error("Could not store annotation because document not found: $postAnnotationResult") }
            }
            logger.info("Successfully stored: $successfullyStored")
            call.respond(successfullyStored)
        }
    }
}
