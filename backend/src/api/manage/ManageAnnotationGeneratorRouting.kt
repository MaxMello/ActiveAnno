package api.manage

import annotationdefinition.generator.AnnotationGenerator
import annotationdefinition.generator.AnnotationGeneratorDAO
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
 * Endpoint for managing the [AnnotationGenerator]s
 */
@KtorExperimentalAPI
fun Route.manageAnnotationGenerator(
    applicationConfig: ApplicationConfig, annotationGeneratorDAO: AnnotationGeneratorDAO
) {
    route("/annotationGenerator") {
        getAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            call.respond(annotationGeneratorDAO.getAll())
        }
        getAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleManager)) {
            call.parameters["id"]?.let { id ->
                call.respond(annotationGeneratorDAO.byId(id))
            } ?: call.respond(HttpStatusCode.BadRequest)
        }
        postAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            val newAnnotationGenerator = call.receive<AnnotationGenerator>()
            val oldAnnotationGenerator = annotationGeneratorDAO.byIdOrNull(newAnnotationGenerator.id)
            if(oldAnnotationGenerator != null) {
                // Not allowed to overwrite
                call.respond(HttpStatusCode.BadRequest, "AnnotationGenerator with same ID already exists")
            } else {
                annotationGeneratorDAO.save(newAnnotationGenerator)
                call.respond(HttpStatusCode.Created)
            }
        }
        putAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleManager)) {
            call.parameters["id"]?.let { id ->
                val newAnnotationGenerator = call.receive<AnnotationGenerator>()
                require(newAnnotationGenerator.id == id) {
                    "PUT body id does not match URL id"
                }
                val oldAnnotationGenerator = annotationGeneratorDAO.byIdOrNull(id)
                if (oldAnnotationGenerator != null) {
                    oldAnnotationGenerator.updateModel(newAnnotationGenerator)
                    annotationGeneratorDAO.save(oldAnnotationGenerator)
                    // Not allowed to overwrite
                    call.respond(HttpStatusCode.OK)
                } else {
                    call.respond(HttpStatusCode.NotFound, "AnnotationGenerator with ID $id not found")

                }
            }
        }
    }
}