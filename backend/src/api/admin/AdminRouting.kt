package api.admin

import application.ApplicationConfig
import application.projectDAO
import application.resetDatabase
import common.getAuthenticatedByJwt
import common.measureTimeMillis
import document.DocumentDAO
import document.addEmptyProjectAnnotationData
import document.updateIndexes
import io.ktor.application.call
import io.ktor.features.NotFoundException
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("AdminRouting")

/**
 * Admin routes are all routes for the frontend relevant for users with the admin role, specifically global access to all documents,
 * projects and users.
 */
@KtorExperimentalAPI
fun Route.admin(applicationConfig: ApplicationConfig, documentDAO: DocumentDAO) {
    route("/admin") {
        route("/document") {
            /*
             * Return all documents of the database in the original database format
             */
            getAuthenticatedByJwt("/", listOf(applicationConfig.jwt.roleAdmin)) {
                call.respond(documentDAO.getAll())
            }
            /*
             * Get a document by ID in the original db format
             */
            getAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleAdmin)) {
                call.respond(
                    documentDAO.byIdOrNull(call.parameters["id"] ?: throw IllegalArgumentException("Id not found"))
                        ?: throw NotFoundException("Document not found for ID")
                )
            }
        }
        /*
         * Some endpoints to interact with the database, mainly regarding performance reasons like indexes
         */
        route("/database") {
            getAuthenticatedByJwt("/updateIndexes", listOf(applicationConfig.jwt.roleAdmin)) {
                updateIndexes()
                call.respond(HttpStatusCode.NoContent)
            }
            getAuthenticatedByJwt("/generateEmptyProjectAnnotationData", listOf(applicationConfig.jwt.roleAdmin)) {
                val limit = call.request.queryParameters["limitPerProject"]?.toInt() ?: 10
                projectDAO.getAllActive().forEach { project ->
                    documentDAO.findForProjectAndMissingProjectAnnotationData(project, limit).forEach { document ->
                        document.addEmptyProjectAnnotationData(project)
                        documentDAO.save(document)
                    }
                }
                call.respond(HttpStatusCode.NoContent)
            }
            getAuthenticatedByJwt("/generateEmptyProjectAnnotationData/project/{projectID}", listOf(applicationConfig.jwt.roleAdmin)) {
                val limit = call.request.queryParameters["limit"]?.toInt() ?: 10
                projectDAO.getProjectById(call.parameters["projectID"]!!).let { project ->
                    measureTimeMillis({ time ->
                        logger.info(
                            "Find for project and missing project annotation data duration: $time ms with limit $limit"
                        )
                    }) {
                        val documentIDs = documentDAO.findForProjectAndMissingProjectAnnotationData(project, limit).map { document ->
                            document.addEmptyProjectAnnotationData(project)
                            documentDAO.save(document)
                            document.id
                        }
                        logger.info("Generated empty ProjectAnnotationData for ${documentIDs.joinToString(",")}")
                    }
                }
                call.respond(HttpStatusCode.NoContent)
            }
            getAuthenticatedByJwt("/reset", listOf(applicationConfig.jwt.roleAdmin)) {
                resetDatabase(applicationConfig)
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}