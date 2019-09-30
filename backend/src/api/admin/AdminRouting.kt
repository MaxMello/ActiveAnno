package api.admin

import application.ApplicationConfig
import common.getAuthenticatedByJwt
import document.DocumentDAO
import io.ktor.application.call
import io.ktor.features.NotFoundException
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("AdminRouting")

/**
 * Admin routes are all routes for the frontend relevant for users with the admin role, specifically global access to all documents,
 * configs and users.
 */
@KtorExperimentalAPI
fun Route.admin(applicationConfig: ApplicationConfig, documentDAO: DocumentDAO) {
    route("/admin") {
        route("/document") {
            getAuthenticatedByJwt("/", listOf(applicationConfig.jwt.roleAdmin)) {
                call.respond(documentDAO.getAll())
            }
            getAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleAdmin)) {
                call.respond(
                    documentDAO.byId(call.parameters["id"] ?: throw IllegalArgumentException("Id not found"))
                        ?: throw NotFoundException("Document not found for ID")
                )
            }
        }
    }
}