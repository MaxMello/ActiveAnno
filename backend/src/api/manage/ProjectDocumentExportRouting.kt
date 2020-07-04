package api.manage

import application.ApplicationConfig
import application.jsonMapper
import common.*
import document.DocumentDAO
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.response.respondFile
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import project.ProjectDAO
import user.UserDAO
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream


/**
 * Endpoint for exporting documents as a manager from the UI
 */
@KtorExperimentalAPI
fun Route.projectDocumentExport(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, projectDAO: ProjectDAO, documentDAO: DocumentDAO
) {

    route("/{id}/export") {
        getAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            call.parameters["id"]?.let { projectID ->
                val returnContentType = runCatching { call.request.queryParameters["returnContentType"] ?: "json" }.getOrElse { "json" }
                when (returnContentType) {
                    "json" -> call.respondFile(createTempFile("tmp-export", ".json").apply {
                        writeText(
                            jsonMapper.writeValueAsString(
                                documentDAO.findForProject(projectDAO.getProjectById(projectID).also {
                                    if (!it.userRoles.managers.contains(user.userIdentifier)) throw ForbiddenException(
                                        "UserRoles not allowed to manage project ${it.id}"
                                    )
                                })
                            )
                        )
                    })
                    "zip" -> call.respondFile(createTempFile("tmp-export", ".zip").also { file ->
                        FileOutputStream(file).use { fos ->
                            ZipOutputStream(fos).use { zos ->
                                documentDAO.findForProject(projectDAO.getProjectById(projectID).also {
                                    if (!it.userRoles.managers.contains(user.userIdentifier)) throw ForbiddenException(
                                        "UserRoles not allowed to manage project ${it.id}"
                                    )
                                }).forEach { doc ->
                                    ZipEntry("${doc.id}.json").let { zipEntry ->
                                        zos.putNextEntry(zipEntry)
                                        zos.write(jsonMapper.writeValueAsBytes(doc))
                                    }
                                }
                            }
                        }
                    })
                    else -> call.respond(HttpStatusCode.BadRequest, "Invalid parameter returnContentType")
                }
            } ?: call.respond(HttpStatusCode.BadRequest, "Missing ID")
        }
    }
}