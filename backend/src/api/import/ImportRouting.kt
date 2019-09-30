package api.import

import application.ApplicationConfig
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import common.postAuthenticatedByJwt
import document.DocumentDAO
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("ImportRouting")

/**
 * Endpoints for other services (or users with the producer role, for cases where documents would be inserted via
 * a tool like curl or Postman) to import documents either as json objects or json arrays.
 */
@KtorExperimentalAPI
fun Route.import(applicationConfig: ApplicationConfig, documentDAO: DocumentDAO) {
    route("/import") {
        postAuthenticatedByJwt(listOf(applicationConfig.jwt.roleProducer)) {
            val json = call.receive<JsonNode>()
            logger.info("Received $json")
            if (json is ObjectNode && json.elements().hasNext()) {
                documentDAO.insert(json)
                call.response.status(HttpStatusCode.Created)
            } else if(json is ArrayNode && json.size() > 0) {
                documentDAO.insertMany(json)
                call.response.status(HttpStatusCode.Created)
            } else {
                call.respond(HttpStatusCode.BadRequest, "Empty JSON not allowed")
            }
        }
    }
}

