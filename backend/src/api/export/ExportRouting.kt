package api.export

import application.ApplicationConfig
import application.httpClient
import common.*
import document.DocumentDAO
import document.annotation.RestCall
import document.getNewestFinalizedAnnotationResult
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
import project.ProjectDAO
import project.export.RestAuthentication
import project.export.convertDocument

private val logger = LoggerFactory.getLogger("ExportRouting")

/**
 * The export endpoints are not for the frontend, but defined by the REST export config, giving external services
 * the ability to read finished documents / annotations.
 */
@KtorExperimentalAPI
fun Route.export(applicationConfig: ApplicationConfig, projectDAO: ProjectDAO, documentDAO: DocumentDAO) {
    route("/export") {
        get("/project/{projectID}") {
            val project = projectDAO.getProjectById(call.parameters["projectID"] ?: throw IllegalArgumentException("Id not found"))
            if (project.export.rest != null) {
                when (project.export.rest.authentication) {
                    is RestAuthentication.HttpBasicAuth -> {
                        val credentials = call.request.basicAuthenticationCredentials()
                            ?: throw ForbiddenException("Http basic auth required")
                        if (!(credentials.name == project.export.rest.authentication.username &&
                                    credentials.password == project.export.rest.authentication.password)
                        ) {
                            throw ForbiddenException("Http basic auth failed")
                        }
                    }
                    is RestAuthentication.JwtRole -> {
                        if (!isTokenStillValid(httpClient, jwtFromHeader(call))) {
                            throw ForbiddenException("JWT token invalid")
                        }
                        if (!validateRole(listOf(applicationConfig.jwt.roleConsumer))) {
                            throw ForbiddenException("JWT role missing")
                        }
                    }
                    is RestAuthentication.None -> {
                        // all good, allow request to proceed
                    }
                }
                val includeUnfinished = runCatching { call.request.queryParameters["includeUnfinished"]?.toBoolean() ?: false }
                    .getOrElse { false }
                val includeUsedProject = runCatching { call.request.queryParameters["includeUsedProject"]?.toBoolean() ?: false }
                    .getOrElse { false }
                val includeDocumentData = runCatching { call.request.queryParameters["includeDocumentData"]?.toBoolean() ?: false }
                    .getOrElse { false }
                val includeExportStatistics = runCatching { call.request.queryParameters["includeExportStatistics"]?.toBoolean() ?: false }
                    .getOrElse { false }
                val includeAllAnnotationResults = runCatching { call.request.queryParameters["includeAllAnnotationResults"]?.toBoolean() ?: false }
                    .getOrElse { false }
                val timestamp = kotlin.runCatching { call.request.queryParameters["since"]?.toLongOrNull() }.getOrNull()
                val documentIDs = call.request.queryParameters["documentIDs"]?.split(",") ?: listOf()
                val results = measureTimeMillis({ time -> logger.info("Export query took $time ms")}) {
                    documentDAO.findForExport(project.id, includeUnfinished, documentIDs, timestamp)
                }
                val currentTimestamp = System.currentTimeMillis()
                call.respond(results.map { doc ->
                    project.export.rest.exportFormat.convertDocument(
                        project.id, doc, includeUsedProject,
                        includeDocumentData, includeExportStatistics
                    ).also {
                        try {
                            (doc.projectAnnotationData[project.id]?.getNewestFinalizedAnnotationResult()?.exportStatistics?.restStatistics?.firstOrNull {
                                it.route == call.request.path()
                            } ?: RestCall(call.request.path(), 0, currentTimestamp, currentTimestamp).also {
                                doc.projectAnnotationData[project.id]?.getNewestFinalizedAnnotationResult()
                                    ?.exportStatistics?.restStatistics?.add(it)
                            }).let {
                                with(it) {
                                    calls++
                                    updatedTimestamp = System.currentTimeMillis()
                                }
                                documentDAO.update(doc.id, doc)
                            }
                        } catch (e: Exception) {
                            logger.error("Could not update REST statistics for project ${project.id} and document ${doc.id}", e)
                        }
                    }
                })
            } else {
                call.respond(HttpStatusCode.BadRequest, "Rest not supported")
            }
        }
    }
}
