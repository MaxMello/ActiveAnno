package api.manage

import annotationdefinition.AnnotationDefinitionDAO
import annotationdefinition.generator.AnnotationGeneratorDAO
import application.ApplicationConfig
import document.DocumentDAO
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import project.ProjectDAO
import user.UserDAO

/**
 * The manage endpoint is for manager users in the frontend, giving access to projects, annotation Definitions etc.
 */
@KtorExperimentalAPI
fun Route.manage(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, projectDAO: ProjectDAO,
    documentDAO: DocumentDAO, annotationDefinitionDAO: AnnotationDefinitionDAO,
    annotationGeneratorDAO: AnnotationGeneratorDAO
) {
    route("/manage") {
        manageProject(applicationConfig, userDAO, projectDAO, documentDAO, annotationDefinitionDAO, annotationGeneratorDAO)
        manageAnnotationDefinition(applicationConfig, annotationDefinitionDAO)
        manageAnnotationGenerator(applicationConfig, annotationGeneratorDAO)
    }
}