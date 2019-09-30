package api.search

import application.ApplicationConfig
import com.fasterxml.jackson.databind.node.ObjectNode
import common.*
import config.filter.FilterCondition
import config.ProjectConfig
import config.ProjectConfigDAO
import document.ConfigAnnotationData
import document.Document
import document.DocumentDAO
import document.applyInputMapping
import io.ktor.application.call
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import user.UserDAO

private val logger = LoggerFactory.getLogger("SearchRouting")

/**
 * The [SearchResultDocument] is a view on a document with all useful data for display in the search result area
 *  in the frontend.
 */
data class SearchResultDocument(
    val documentID: String,
    val configurationID: String,
    val storeTimestamp: Long,
    val originalDocument: ObjectNode,
    val documentData: Map<String, Any>,
    val restrictedConfig: String? = null,
    val configAnnotationData: ConfigAnnotationData? = null
)

/**
 * Model representing a search request
 */
data class SearchRequest(
    val configurationIDs: List<String>,
    val filterCondition: FilterCondition?
)

/**
 * The search endpoint is available for all user roles, based on the role with limited scope of search. Searches
 * are restricted to a list of configs with additional filter conditions that can be defined in the frontend.
 */
@KtorExperimentalAPI
fun Route.search(applicationConfig: ApplicationConfig, userDAO: UserDAO, projectConfigDAO: ProjectConfigDAO,
                 documentDAO: DocumentDAO
) {
    route("/search") {
        postAuthenticatedByJwt(
            listOf(
                applicationConfig.jwt.roleUser,
                applicationConfig.jwt.roleManager,
                applicationConfig.jwt.roleAdmin,
                applicationConfig.jwt.roleGlobalSearch
            ), onlyOneMustMatch = true
        ) {
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val roles = jwt.roles
            val searchRequest = call.receive<SearchRequest>()
            val configs = projectConfigDAO.getConfigsByIds(searchRequest.configurationIDs)
            val userConfigs = projectConfigDAO.getConfigsForUser(user.userIdentifier)
            val allowedConfigs = if (applicationConfig.jwt.roleGlobalSearch in roles
                || applicationConfig.jwt.roleAdmin in roles
            ) {
                configs
            } else {
                configs.intersect(userConfigs)
            }
            call.respond(allowedConfigs.flatMap { c ->
                documentDAO.findForSearch(c, searchRequest.filterCondition).map { d ->
                    d.toSearchResultDocument(c)
                }
               }.sortedByDescending { it.storeTimestamp }
                .sortedBy { it.configurationID })
        }
    }
}

/**
 * Convert a [Document] to a [SearchResultDocument]
 */
fun Document.toSearchResultDocument(config: ProjectConfig): SearchResultDocument {
    return SearchResultDocument(
        _id!!, config._id, storeTimestamp, originalDocument,
        applyInputMapping(config.inputMapping), restrictedConfig, configAnnotationData[config._id]
    )
}