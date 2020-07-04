package api.manage

import application.ApplicationConfig
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import common.*
import document.DocumentDAO
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import project.ProjectDAO
import user.UserDAO


private val logger = LoggerFactory.getLogger("RestrictedProjectDocumentsRouting")


/**
 * Endpoint to upload documents for projects from the UI
 */
@KtorExperimentalAPI
fun Route.restrictedProjectDocuments(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, documentDAO: DocumentDAO, projectDAO: ProjectDAO
) {
    route("/{id}/document") {
        getAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.parameters["id"]?.let { projectID ->
                call.respond(documentDAO.findForRestrictedProject(projectID))
            } ?: call.respond(HttpStatusCode.BadRequest)
        }
        getAuthenticatedByJwt("/{documentID}", listOf(applicationConfig.jwt.roleManager)) {
            userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.parameters["documentID"]?.let { documentID ->
                documentDAO.byIdOrNull(documentID)?.also {
                    logger.info("$it")
                    if (it.restrictedProjectID != null && (call.parameters["id"] ?: throw IllegalArgumentException(
                            "ID missing"
                        )).toString() == it.restrictedProjectID
                    ) {
                        call.respond(it)
                    } else {
                        call.respond(HttpStatusCode.BadRequest, "Document does not match project")
                    }
                }
            } ?: call.respond(HttpStatusCode.BadRequest, "Parameter documentID missing")
        }
        /**
         * Upload documents for a project. If it is a restricted project, will restrict documents to that project. Else, will generally upload the
         * documents for all projects. Then, the FilterCondition of the project must actually match.
         */
        postAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val id = call.parameters["id"] ?: throw IllegalArgumentException("Id missing")
            val project = projectDAO.getProjectById(id)
            val json = call.receive<JsonNode>()
            if (json is ObjectNode && json.elements().hasNext()) {
                documentDAO.insert(json, project.id)
                call.respond(HttpStatusCode.Created, mapOf("projectID" to project.id))
            } else if (json is ArrayNode && json.size() > 0) {
                documentDAO.insertMany(json, project.id)
                call.respond(HttpStatusCode.Created, mapOf("projectID" to project.id))
            } else {
                call.respond(HttpStatusCode.BadRequest, "Empty JSON not allowed")
            }
        }
        deleteAuthenticatedByJwt("/{documentID}", listOf(applicationConfig.jwt.roleManager)) {
            userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.parameters["documentID"]?.let { documentID ->
                documentDAO.byIdOrNull(documentID)?.also {
                    if (it.restrictedProjectID != null && (call.parameters["id"] ?: throw IllegalArgumentException(
                            "ID missing"
                        )).toString() == it.restrictedProjectID
                    ) {
                        if (documentDAO.deleteById(documentID).wasAcknowledged()) {
                            call.respond(HttpStatusCode.OK)
                        } else {
                            call.respond(HttpStatusCode.InternalServerError, "Could not delete document")
                        }
                    } else {
                        call.respond(
                            HttpStatusCode.BadRequest,
                            "Cannot delete, because document is not restricted on given project"
                        )
                    }
                }
            } ?: call.respond(HttpStatusCode.BadRequest)
        }
    }
}