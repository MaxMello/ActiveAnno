package api.manage

import annotationdefinition.AnnotationDefinitionDAO
import annotationdefinition.generator.AnnotationGeneratorDAO
import api.manage.dto.ManageProject
import api.manage.dto.toManageListProject
import api.manage.dto.toManageProject
import api.manage.dto.toProject
import application.ApplicationConfig
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
import project.ProjectValidationError
import project.annotationschema.AnnotationSchema
import project.annotationschema.AnnotationSchemaElement
import project.inputmapping.DocumentText
import project.inputmapping.InputMapping
import project.layout.Column
import project.layout.Layout
import project.layout.LayoutArea
import project.layout.Row
import project.layout.elements.action.ActionElement
import project.layout.elements.display.DateMetaData
import project.layout.elements.display.MetaDataMapping
import project.layout.elements.display.TextMetaData
import project.layout.elements.display.UrlImageMetaData
import project.userroles.UserRoles
import user.UserDAO
import java.util.*

private val logger = LoggerFactory.getLogger("ManageProjectRouting")

/**
 * Response body for storing a [Project] with success info and validation errors
 */
data class ProjectStoreResponse(
    val projectID: String?,
    val project: ManageProject?,
    val success: Boolean,
    val errors: Map<String, ProjectValidationError>,
    val message: String
)

/**
 * Validate a project to ensure it is not in an invalid state
 */
suspend fun validateProject(project: ManageProject, locale: Locale?, annotationDefinitionDAO: AnnotationDefinitionDAO,
                    annotationGeneratorDAO: AnnotationGeneratorDAO) : Map<String, ProjectValidationError> {
    val errors = mutableMapOf<String, ProjectValidationError>()
    if(!project.id.matches("^[a-zA-Z0-9_]{6,}\$".toRegex())) {
        errors["id"] = ProjectValidationError("id", getMessageString("project.validationError.invalidId", locale), true)
    }
    if(project.name.isBlank()) {
        val key = ManageProject::name.name
        errors[key] = ProjectValidationError(key, getMessageString("project.validationError.blankName", locale))
    }
    if(project.userRoles.managers.isEmpty()) {
        val key = ManageProject::userRoles.name + "." + UserRoles::managers.name
        errors[key] = ProjectValidationError(key, getMessageString("project.validationError.emptyManagers", locale), true)
    }
    if(project.inputMapping.documentText.key.isBlank()) {
        val key = ManageProject::inputMapping.name + "." + InputMapping::documentText + "." + DocumentText::key
        errors[key] = ProjectValidationError(key, getMessageString("project.validationError.emptyDocumentText",
            locale))
    }
    project.annotationSchema.elements.forEach { element ->
        if(annotationDefinitionDAO.byIdOrNull(element.annotationDefinitionID) == null) {
            val key = ManageProject::annotationSchema.name + "." + AnnotationSchema::elements.name + "." +
                    AnnotationSchemaElement::annotationDefinitionID + "." + element.annotationDefinitionID
            errors[key] = ProjectValidationError(key, getMessageString("project.validationError.annotationDefinition.notExists", locale))
        }
        if(element.annotationGeneratorID != null && annotationGeneratorDAO.byIdOrNull(element.annotationGeneratorID) == null) {
            val key = ManageProject::annotationSchema.name + "." + AnnotationSchema::elements.name + "." +
                    AnnotationSchemaElement::annotationDefinitionID + "." + element.annotationDefinitionID
            errors[key] = ProjectValidationError(key, getMessageString("project.validationError.annotationDefinition.notExists", locale))
        }
    }
    project.layout.layoutAreas.forEach { (_, layoutArea) ->
        layoutArea.rows.forEachIndexed { rowIndex, row ->
            row.cols.forEachIndexed { colIndex, col ->
                col.children.forEachIndexed { elemIndex, elem ->
                    val key = (ManageProject::layout.name + "." + Layout::layoutAreas.name + "." + layoutArea.id.name + "." +
                            LayoutArea::rows.name + "[" + rowIndex + "]." + Row::cols.name + "[" + colIndex + "]." +
                            Column::children.name + "[" + elemIndex + "]")
                    when(elem) {
                        is TextMetaData -> {
                            if(project.inputMapping.metaData.none { it.id == elem.id }) {
                                errors[key] = ProjectValidationError(key, getMessageString("project.validationError.layout.metaDataNotFound",
                                    locale))
                            }
                        }
                        is MetaDataMapping -> {
                            if(project.inputMapping.metaData.none { it.id == elem.id }) {
                                errors[key] = ProjectValidationError(key, getMessageString("project.validationError.layout.metaDataNotFound",
                                    locale))
                            }
                        }
                        is UrlImageMetaData -> {
                            if(project.inputMapping.metaData.none { it.id == elem.id }) {
                                errors[key] = ProjectValidationError(key, getMessageString("project.validationError.layout.metaDataNotFound",
                                    locale))
                            }
                        }
                        is DateMetaData -> {
                            if(project.inputMapping.metaData.none { it.id == elem.id }) {
                                errors[key] = ProjectValidationError(key, getMessageString("project.validationError.layout.metaDataNotFound",
                                    locale))
                            }
                        }
                        is ActionElement -> {
                            if(project.annotationSchema.elements.none { it.annotationDefinitionID == elem.referenceAnnotationDefinitionID }) {
                                errors[key] = ProjectValidationError(key,
                                    getMessageString("project.validationError.layout.annotationDefinitionNotFound", locale))
                            }
                        }
                    }
                }
            }
        }
    }
    return errors

}

/**
 * Endpoint for managing Projects
 */
@KtorExperimentalAPI
fun Route.manageProject(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, projectDAO: ProjectDAO,
    documentDAO: DocumentDAO, annotationDefinitionDAO: AnnotationDefinitionDAO, annotationGeneratorDAO: AnnotationGeneratorDAO
) {
    route("/project") {
        getAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.respond(
                projectDAO.getManageProjectsForUser(
                    user.userIdentifier,
                    false
                ).toList().map { it.toManageListProject() })
        }
        getAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleManager)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.parameters["id"]?.let { id ->
                call.respond(projectDAO.getProjectById(id).also {
                    if (!it.userRoles.managers.contains(user.userIdentifier)) throw ForbiddenException(
                        "User not allowed to manage project $id"
                    )
                }.toManageProject())
            } ?: call.respond(HttpStatusCode.BadRequest)
        }
        postAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            try {
                val project = try {
                    call.receive<ManageProject>()
                } catch (e: Exception) {
                    logger.error("Could not receive ManageProject", e)
                    null
                }
                if(project != null) {
                    val errors = validateProject(
                        project, call.preferredSupportedLocaleOrDefault(), annotationDefinitionDAO, annotationGeneratorDAO
                    )
                    if (errors.any { it.value.criticalError }) {
                        call.respond(
                            HttpStatusCode.OK,
                            ProjectStoreResponse(
                                project.id, project, false, errors,
                                call.getMessageString("project.validationMessage.criticalError")
                            )
                        )
                    } else {
                        val insertProject = if(errors.isNotEmpty()) { project.copy(active = false) } else project
                        val id = projectDAO.insertOne(insertProject.toProject(user.userIdentifier))
                        call.respond(HttpStatusCode.Created, ProjectStoreResponse(
                            id, projectDAO.getProjectById(id).toManageProject(), true, errors,
                            if(errors.isNotEmpty()) { call.getMessageString("project.validationMessage.savedButInactive") } else {
                                call.getMessageString("project.validationMessage.success")
                            }
                        ))

                    }
                } else {
                    call.respond(
                        HttpStatusCode.OK, ProjectStoreResponse(null, null, false, mapOf(),
                            call.getMessageString("project.validationMessage.badRequest"))
                    )
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.OK, ProjectStoreResponse(null, null, false, mapOf(),
                    call.getMessageString("project.validationMessage.internalError"))
                )
            }
        }
        putAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleManager)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.parameters["id"]?.let { id ->
                try {
                    val oldProject = projectDAO.getProjectById(id).also {
                        if (!it.userRoles.managers.contains(user.userIdentifier)) throw ForbiddenException(
                            "User not allowed to manage project $id"
                        )
                    }
                    val project = try {
                        call.receive<ManageProject>()
                    } catch (e: Exception) {
                        logger.error("Could not receive ManageProject", e)
                        null
                    }
                    logger.info("Received PUT for $project")
                    if(project != null) {
                        val errors = validateProject(
                            project, call.preferredSupportedLocaleOrDefault(), annotationDefinitionDAO, annotationGeneratorDAO
                        )
                        if (errors.any { it.value.criticalError }) {
                            call.respond(
                                HttpStatusCode.OK,
                                ProjectStoreResponse(
                                    id, project, false, errors,
                                    call.getMessageString("project.validationMessage.criticalError")
                                )
                            )
                        } else {
                            val insertProject = if(errors.isNotEmpty()) { project.copy(active = false) } else project
                            projectDAO.replaceById(id, insertProject.toProject(oldProject.creator, oldProject.creationTimestamp))
                            call.respond(HttpStatusCode.OK, ProjectStoreResponse(
                                id, projectDAO.getProjectById(id).toManageProject(), true, errors,
                                if(errors.isNotEmpty()) { call.getMessageString("project.validationMessage.savedButInactive") } else {
                                    call.getMessageString("project.validationMessage.success")
                                }
                            ))
                        }
                    } else {
                        call.respond(
                            HttpStatusCode.OK, ProjectStoreResponse(id, null, false, mapOf(),
                                call.getMessageString("project.validationMessage.badRequest"))
                        )
                    }
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.OK, ProjectStoreResponse(id, null, false, mapOf(),
                        call.getMessageString("project.validationMessage.internalError"))
                    )
                }
            } ?: call.respond(HttpStatusCode.BadRequest)
        }
        restrictedProjectDocuments(applicationConfig, userDAO, documentDAO, projectDAO)
        projectDocumentExport(applicationConfig, userDAO, projectDAO, documentDAO)
        analyzeProjectResults(applicationConfig, userDAO, projectDAO, documentDAO)
    }

}