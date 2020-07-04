package api.manage

import annotationdefinition.AnnotationDefinition
import annotationdefinition.AnnotationDefinitionDAO
import application.ApplicationConfig
import common.getAuthenticatedByJwt
import common.postAuthenticatedByJwt
import common.putAuthenticatedByJwt
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI

/**
 * Endpoint for [AnnotationDefinition]s. Users can retrieve a list of all [AnnotationDefinition]s, a single one by ID, POST new
 * [AnnotationDefinition]s or update them, but only
 */
@KtorExperimentalAPI
fun Route.manageAnnotationDefinition(
    applicationConfig: ApplicationConfig, annotationDefinitionDAO: AnnotationDefinitionDAO
) {
    route("/annotationDefinition") {
        getAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            call.respond(annotationDefinitionDAO.getAll())
        }
        getAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleManager)) {
            call.parameters["id"]?.let { id ->
                call.respond(annotationDefinitionDAO.byId(id))
            } ?: call.respond(HttpStatusCode.BadRequest)
        }
        postAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            val newAnnotationDefinition = call.receive<AnnotationDefinition>()
            val oldAnnotationDefinition = annotationDefinitionDAO.byIdOrNull(newAnnotationDefinition.id)
            if(oldAnnotationDefinition != null) {
                // Not allowed to overwrite
                call.respond(HttpStatusCode.BadRequest, "AnnotationDefinition with same ID already exists")
            } else {
                annotationDefinitionDAO.save(newAnnotationDefinition)
                call.respond(HttpStatusCode.Created, annotationDefinitionDAO.byId(newAnnotationDefinition.id))
            }
        }
        putAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleManager)) {
            call.parameters["id"]?.let { id ->
                val newAnnotationDefinition = call.receive<AnnotationDefinition>()
                require(newAnnotationDefinition.id == id) {
                    "PUT body id does not match URL id"
                }
                val oldAnnotationDefinition = annotationDefinitionDAO.byIdOrNull(id)
                // The only 2 fields updatable are name and shortName. For everything else, a new annotation has to be created.
                if (oldAnnotationDefinition != null) {
                    oldAnnotationDefinition.updateModel(newAnnotationDefinition)
                    annotationDefinitionDAO.save(oldAnnotationDefinition)
                    // Not allowed to overwrite
                    call.respond(HttpStatusCode.OK, annotationDefinitionDAO.byId(id))
                } else {
                    call.respond(HttpStatusCode.NotFound, "AnnotationDefinition with ID $id not found")

                }
            }
        }
    }
}