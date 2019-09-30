package api.curate

import api.annotate.AnnotationStored
import api.annotate.PostAnnotationResult
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

private val logger = LoggerFactory.getLogger("CurateRouting")

/**
 * Wrapper model for [PostCurationResult]
 */
internal data class PostCurationResults(
    val annotations: List<PostCurationResult>
)

/**
 * A [PostCurationResult] contains either a [PostAnnotationResult] or an [acceptedAnnotationResultID], as well as the
 * [configurationID]
 */
internal data class PostCurationResult(
    val annotatedDocument: PostAnnotationResult? = null,
    val acceptedAnnotationResultID: String? = null,
    val documentID: String,
    val configurationID: String
)

/**
 * Model for curation processes in the frontend, similar to [AnnotationDocument], but also containing the existing
 * annotations
 */
internal data class CurationDocument(
    val documentID: String,
    val configurationID: String,
    val documentData: Map<String, Any>,
    val annotations: List<AnnotationResult>
)

/**
 * Convert a [Document] to a [CurationDocument] for the frontend
 */
internal fun Document.toCurationDocument(configurationID: String, inputMapping: InputMapping): CurationDocument {
    return CurationDocument(
        _id!!,
        configurationID,
        applyInputMapping(inputMapping),
        configAnnotationData[configurationID]?.annotations ?: listOf()
    )
}

/**
 * Curate routes are used by the frontend for users that are curators for a config. Therefore, it provides
 * endpoints to get configs for curation as well as documents, and endpoints to post the annotation results
 */
@KtorExperimentalAPI
fun Route.curate(applicationConfig: ApplicationConfig, userDAO: UserDAO, projectConfigDAO: ProjectConfigDAO,
                 documentDAO: DocumentDAO) {
    route("/curate") {
        getAuthenticatedByJwt("/config", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.respond(projectConfigDAO.getCurateConfigsForUser(user.userIdentifier).map { it.toListConfig() })
        }
        getAuthenticatedByJwt("/config/{configID}", listOf(applicationConfig.jwt.roleUser)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val configID = call.parameters["configID"]
            if (configID != null) {
                call.respond(projectConfigDAO.getConfigById(configID).also {
                    if (!it.userRoles.curators.contains(user.userIdentifier)) throw AuthorizationException(
                        "UserRoles not allowed to curate config $configID"
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
                if(!config.userRoles.curators.contains(user.userIdentifier)) {
                    throw AuthorizationException("UserRoles not allowed to curate config $configID")
                }
                call.respond(
                    documentDAO.findForCuration(config, user.userIdentifier, limit, ignoreDocuments).map {
                        it.toCurationDocument(
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
            val annotations = call.receive<PostCurationResults>().annotations
            logger.info("Annotations: $annotations")
            val successfullyStored = (annotations
                .filter { it.acceptedAnnotationResultID != null }.mapNotNull { result ->
                    documentDAO.byId(result.documentID)?.let { document ->
                        val config = projectConfigDAO.getConfigById(result.configurationID)
                        document.configAnnotationData[result.configurationID]!!.run {
                            this.finalizedAnnotations.add(
                                FinalizedAnnotation(
                                    listOf(result.acceptedAnnotationResultID!!),
                                    FinalizedReason.Curator(user.userIdentifier), config.policy,
                                    System.currentTimeMillis(), ExportStatistics()
                                )
                            )
                            this.policyAction = config.policy.applyPolicy(result.configurationID, document)
                        }
                        config.export.checkWebHooks(result.configurationID, document)
                        documentDAO.update(result.documentID, document).let {
                            if (it.wasAcknowledged()) {
                                AnnotationStored(result.configurationID, result.documentID)
                            } else {
                                logger.error("Could not update document table, was not acknowledged: $it")
                                null
                            }
                        }
                    } ?: null.also { logger.error("Could not store annotation because document not found: $result") }
                }) + (annotations.filter { it.acceptedAnnotationResultID == null && it.annotatedDocument != null }
                .map { it.annotatedDocument!! }
                .mapNotNull {
                    documentDAO.byId(it.documentID)?.let { document ->
                        if(!document.configAnnotationData.containsKey(it.configurationID)) {
                            document.configAnnotationData[it.configurationID] = ConfigAnnotationData()
                        }
                        val config = projectConfigDAO.getConfigById(it.configurationID)
                        document.configAnnotationData[it.configurationID]!!.run {
                            val resultID = UUID.randomUUID().toString()
                            this.annotations.add(
                                AnnotationResult(
                                    resultID,
                                    it.documentID,
                                    it.configurationID,
                                    System.currentTimeMillis(),
                                    it.documentAnnotations,
                                    it.spanAnnotations,
                                    listOf(
                                        AnnotationResultCreator(
                                            user.userIdentifier,
                                            AnnotationResultCreatorType.CURATOR
                                        )
                                    ),
                                    it.interactionLog,
                                    it.documentData,
                                    it.usedConfig
                                )
                            )
                            this.finalizedAnnotations.add(
                                FinalizedAnnotation(
                                    listOf(resultID),
                                    FinalizedReason.Curator(user.userIdentifier),
                                    config.policy,
                                    System.currentTimeMillis()
                                )
                            )
                            this.policyAction = config.policy.applyPolicy(it.configurationID, document)
                            config.export.checkWebHooks(it.configurationID, document)
                        }
                        documentDAO.update(it.documentID, document).let { updateResult ->
                            if(updateResult.wasAcknowledged()) {
                                AnnotationStored(it.configurationID, it.documentID)
                            } else {
                                logger.error("Could not update document table, was not acknowledged: $it")
                                null
                            }
                        }
                }
            })
            logger.info("Successfully stored: $successfullyStored")
            call.respond(successfullyStored)
        }
    }
}