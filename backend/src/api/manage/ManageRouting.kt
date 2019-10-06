package api.manage

import application.ApplicationConfig
import application.jsonMapper
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import common.*
import config.*
import document.DocumentDAO
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.response.respondFile
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import user.UserDAO
import java.io.FileOutputStream
import java.lang.Exception
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

private val logger = LoggerFactory.getLogger("ManageRouting")


data class ConfigStoreFailure(
    val configID: String?,
    val errors: Map<String, ConfigValidationError>,
    val message: String
)

/**
 * The manage endpoint is for manager users in the frontend, giving the ability to read, edit and create configs,
 * optionally directly upload documents for a config, and download results directly from the UI
 */
@KtorExperimentalAPI
fun Route.manage(applicationConfig: ApplicationConfig, userDAO: UserDAO, projectConfigDAO: ProjectConfigDAO,
                 documentDAO: DocumentDAO) {
    route("/manage") {
        route("/config") {
            getAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
                val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
                call.respond(
                    projectConfigDAO.getManageConfigsForUser(
                        user.userIdentifier,
                        false
                    ).toList().map { it.toListConfig() })
            }
            getAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleManager)) {
                val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
                call.parameters["id"]?.let { id ->
                    call.respond(projectConfigDAO.getConfigById(id).also {
                        if (!it.userRoles.managers.contains(user.userIdentifier)) throw AuthorizationException(
                            "UserRoles not allowed to manage config $id"
                        )
                    }.toManageConfig())
                } ?: call.respond(HttpStatusCode.BadRequest)
            }
            postAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
                val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
                val configJSON = call.receive<ObjectNode>()
                val errors = validateManageConfig(configJSON)
                if(errors.errors.isNotEmpty()) {
                    call.respond(HttpStatusCode.BadRequest, ConfigStoreFailure(configJSON.get("id").asText(null), errors.errors, "Project has invalid structure or missing fields"))
                } else {
                    try {
                        val config = jsonMapper.treeToValue(configJSON, ManageConfig::class.java)
                        try {
                            val id = projectConfigDAO.insertOne(config.toProjectConfig(user.userIdentifier))
                            call.respond(HttpStatusCode.Created, projectConfigDAO.getConfigById(id).toManageConfig())
                        } catch (e: Exception) {
                            call.respond(HttpStatusCode.InternalServerError, ConfigStoreFailure(configJSON.get("id").asText(null), mapOf(), "Could not save project in database"))
                        }
                    } catch (e: Exception) {
                        call.respond(HttpStatusCode.BadRequest, ConfigStoreFailure(configJSON.get("id").asText(null), mapOf(), "Project has invalid structure or missing fields"))
                    }
                }
            }
            putAuthenticatedByJwt("/{id}", listOf(applicationConfig.jwt.roleManager)) {
                val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
                call.parameters["id"]?.let { id ->
                    val oldConfig = projectConfigDAO.getConfigById(id).also {
                        if (!it.userRoles.managers.contains(user.userIdentifier)) throw AuthorizationException(
                            "UserRoles not allowed to manage config $id"
                        )
                    }
                    val configJSON = call.receive<ObjectNode>()
                    val errors = validateManageConfig(configJSON)
                    if(errors.errors.isNotEmpty()) {
                        call.respond(HttpStatusCode.BadRequest, ConfigStoreFailure(configJSON.get("id").asText(null), mapOf(), "Project has invalid structure or missing fields"))
                    } else {
                        val newConfig = jsonMapper.treeToValue(configJSON, ManageConfig::class.java)
                        try {
                            projectConfigDAO.replaceById(id, newConfig.toProjectConfig(oldConfig.creator, oldConfig.creationTimestamp))
                            call.respond(HttpStatusCode.OK, projectConfigDAO.getConfigById(id).toManageConfig())
                        } catch (e: Exception) {
                            call.respond(HttpStatusCode.InternalServerError, ConfigStoreFailure(configJSON.get("id").asText(null), mapOf(), "Could not save project in database"))
                        }
                    }
                } ?: call.respond(HttpStatusCode.BadRequest, ConfigStoreFailure(null, mapOf(), "ID missing"))
            }
            route("/{id}/document") {
                getAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
                    userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
                    call.parameters["id"]?.let { configID ->
                        call.respond(documentDAO.findForRestrictedConfig(configID))
                    } ?: call.respond(HttpStatusCode.BadRequest)
                }
                getAuthenticatedByJwt("/{documentID}", listOf(applicationConfig.jwt.roleManager)) {
                    userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
                    call.parameters["documentID"]?.let { documentID ->
                        documentDAO.byId(documentID)?.also {
                            logger.info("$it")
                            if (it.restrictedConfig != null && (call.parameters["id"] ?: throw IllegalArgumentException(
                                    "ID missing"
                                )).toString() == it.restrictedConfig
                            ) {
                                call.respond(it)
                            } else {
                                call.respond(HttpStatusCode.BadRequest, "Document does not match config")
                            }
                        }
                    } ?: call.respond(HttpStatusCode.BadRequest, "Parameter documentID missing")
                }
                postAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
                    userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
                    val id = call.parameters["id"] ?: throw IllegalArgumentException("Id missing")
                    val json = call.receive<JsonNode>()
                    if (json is ObjectNode && json.elements().hasNext()) {
                        documentDAO.insert(json, id)
                        call.response.status(HttpStatusCode.Created)
                    } else if (json is ArrayNode && json.size() > 0) {
                        documentDAO.insertMany(json, id)
                        call.response.status(HttpStatusCode.Created)
                    } else {
                        call.respond(HttpStatusCode.BadRequest, "Empty JSON not allowed")
                    }
                }
                deleteAuthenticatedByJwt("/{documentID}", listOf(applicationConfig.jwt.roleManager)) {
                    userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
                    call.parameters["documentID"]?.let { documentID ->
                        documentDAO.byId(documentID)?.also {
                            if (it.restrictedConfig != null && (call.parameters["id"] ?: throw IllegalArgumentException(
                                    "ID missing"
                                )).toString() == it.restrictedConfig
                            ) {
                                if (documentDAO.deleteById(documentID).wasAcknowledged()) {
                                    call.respond(HttpStatusCode.OK)
                                } else {
                                    call.respond(HttpStatusCode.InternalServerError, "Could not delete document")
                                }
                            } else {
                                call.respond(
                                    HttpStatusCode.BadRequest,
                                    "Cannot delete, because document is not restricted on given config"
                                )
                            }
                        }
                    } ?: call.respond(HttpStatusCode.BadRequest)
                }
            }
            route("/{id}/export") {
                getAuthenticatedByJwt(listOf(applicationConfig.jwt.roleManager)) {
                    call.parameters["id"]?.let { configID ->
                        val returnContentType = runCatching { call.request.queryParameters["returnContentType"] ?: "json" }.getOrElse { "json" }
                        when (returnContentType) {
                            "json" -> call.respondFile(createTempFile("tmp-export", ".json").apply {
                                writeText(
                                    jsonMapper.writeValueAsString(
                                        documentDAO.findForConfig(projectConfigDAO.getConfigById(configID))
                                    )
                                )
                            })
                            "zip" -> call.respondFile(createTempFile("tmp-export", ".zip").also { file ->
                                FileOutputStream(file).use { fos ->
                                    ZipOutputStream(fos).use { zos ->
                                        documentDAO.findForConfig(projectConfigDAO.getConfigById(configID)).forEach { doc ->
                                            ZipEntry("${doc._id}.json").let { zipEntry ->
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
    }
}