package api.export

import application.ApplicationConfig
import application.httpClient
import common.AuthorizationException
import common.isTokenStillValid
import common.jwtFromHeader
import common.validateRole
import config.ProjectConfigDAO
import config.export.RestAuthentication
import config.export.convertDocument
import document.DocumentDAO
import document.annotation.RestCall
import document.getNewestFinalizedAnnotation
import io.ktor.application.call
import io.ktor.auth.basicAuthenticationCredentials
import io.ktor.http.HttpStatusCode
import io.ktor.request.path
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("ExportRouting")

/**
 * The export endpoints are not for the frontend, but defined by the REST export config, giving external services
 * the ability to read finished documents / annotations.
 */
@KtorExperimentalAPI
fun Route.export(applicationConfig: ApplicationConfig, projectConfigDAO: ProjectConfigDAO, documentDAO: DocumentDAO) {
    route("/export") {
        get("/config/{configID}") {
            val config = projectConfigDAO.getConfigById(call.parameters["configID"] ?: throw IllegalArgumentException("Id not found"))
            if(config.export.rest != null) {
                when(config.export.rest.authentication) {
                    is RestAuthentication.HttpBasicAuth -> {
                        val credentials = call.request.basicAuthenticationCredentials() ?: throw AuthorizationException("Http basic auth required")
                        if(!(credentials.name == config.export.rest.authentication.username &&
                            credentials.password == config.export.rest.authentication.password)) {
                            throw AuthorizationException("Http basic auth failed")
                        }
                    }
                    is RestAuthentication.JwtRole -> {
                        if(!isTokenStillValid(httpClient, jwtFromHeader(call))) {
                            throw AuthorizationException("JWT token invalid")
                        }
                        if(!validateRole(listOf(applicationConfig.jwt.roleConsumer))) {
                            throw AuthorizationException("JWT role missing")
                        }
                    }
                }
                val includeUnfinished = runCatching { call.request.queryParameters["includeUnfinished"]?.toBoolean() ?: false }
                        .getOrElse { false }
                val timestamp = kotlin.runCatching { call.request.queryParameters["since"]?.toLongOrNull() }.getOrNull()
                val documentIDs = call.request.queryParameters["documentIDs"]?.split(",") ?: listOf()
                val results = documentDAO.findForExport(config._id, includeUnfinished, documentIDs, timestamp)
                logger.info("Export result before mapping: $results")
                val currentTimestamp = System.currentTimeMillis()
                call.respond(results.map { doc -> config.export.rest.exportFormat.convertDocument(config._id, doc).also {
                    try {
                        (doc.configAnnotationData[config._id]?.getNewestFinalizedAnnotation()?.exportStatistics?.restStatistics?.firstOrNull {
                            it.route == call.request.path()
                        } ?: RestCall(call.request.path(), 0, currentTimestamp, currentTimestamp).also {
                            doc.configAnnotationData[config._id]?.getNewestFinalizedAnnotation()
                                ?.exportStatistics?.restStatistics?.add(it)
                        }).let {
                            with(it) {
                                calls++
                                updatedTimestamp = System.currentTimeMillis()
                            }
                            documentDAO.update(doc._id!!, doc)
                        }
                    } catch (e: Exception) {
                        logger.error("Could not update REST statistics for config ${config._id} and document ${doc._id}", e)
                    }
                } })
            } else {
                call.respond(HttpStatusCode.BadRequest, "Rest not supported")
            }
        }
    }
}
