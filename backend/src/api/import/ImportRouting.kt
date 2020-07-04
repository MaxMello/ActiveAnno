package api.import

import application.ApplicationConfig
import application.projectDAO
import application.userDAO
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import common.jwt
import common.postAuthenticatedByJwt
import common.userIdentifier
import common.userName
import document.DocumentDAO
import document.addAnnotationResultForProject
import document.annotation.AnnotationMap
import document.annotation.AnnotationResult
import document.annotation.AnnotationResultCreator
import io.ktor.application.call
import io.ktor.features.NotFoundException
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import java.util.*

private val logger = LoggerFactory.getLogger("ImportRouting")

/**
 * Return list of generated documentIDs in order of imported jsons from request body
 */
data class ImportDocumentResult(
    val documentIDs: List<String>
)

/**
 * Request body to import annotations
 */
data class ImportedAnnotationRequest(
    val annotations: AnnotationMap = mutableMapOf()
)

/**
 * Endpoints for other services (or users with the producer role, for cases where documents would be inserted via
 * a tool like curl or Postman) to import documents either as json objects or json arrays.
 */
@KtorExperimentalAPI
fun Route.import(applicationConfig: ApplicationConfig, documentDAO: DocumentDAO) {
    route("/import") {
        postAuthenticatedByJwt("/document", listOf(applicationConfig.jwt.roleProducer)) {
            val json = call.receive<JsonNode>()
            logger.info("Received $json")
            if (json is ObjectNode && json.elements().hasNext()) {
                val id = documentDAO.insert(json)
                call.respond(HttpStatusCode.Created, ImportDocumentResult(listOf(id)))
            } else if (json is ArrayNode && json.size() > 0) {
                val ids = documentDAO.insertMany(json)
                call.respond(HttpStatusCode.Created, ImportDocumentResult(ids))
            } else {
                call.respond(HttpStatusCode.BadRequest, "Empty JSON not allowed")
            }
        }
        postAuthenticatedByJwt("/annotation/project/{projectID}/document/{documentID}", listOf(applicationConfig.jwt.roleProducer)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val importedAnnotationResult = call.receive<ImportedAnnotationRequest>()
            val documentID = call.parameters["documentID"]
            val projectID = call.parameters["projectID"]
            requireNotNull(documentID)
            requireNotNull(projectID)
            val document = documentDAO.byIdOrNull(documentID) ?: throw NotFoundException("Document not found")
            val project = projectDAO.getProjectById(projectID)
            document.addAnnotationResultForProject(project, AnnotationResult(
                    UUID.randomUUID().toString(),
                    document.id,
                    project.id,
                    System.currentTimeMillis(),
                    importedAnnotationResult.annotations,
                    AnnotationResultCreator.Import(user.userIdentifier)
                ),
                checkWebHooks = true, applyPolicy = true
            )
            documentDAO.updateAndValidate(document.id, document).let {
                if(it) {
                    call.respond(HttpStatusCode.Created, it)
                } else {
                    call.respond(HttpStatusCode.InternalServerError)
                }
            }
        }
    }
}
