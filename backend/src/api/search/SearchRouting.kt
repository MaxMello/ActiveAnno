package api.search

import application.ApplicationConfig
import com.fasterxml.jackson.databind.node.ObjectNode
import common.*
import document.Document
import document.DocumentDAO
import document.ProjectAnnotationData
import document.applyInputMapping
import io.ktor.application.call
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import project.Project
import project.ProjectDAO
import project.filter.FilterCondition
import user.UserDAO

private val logger = LoggerFactory.getLogger("SearchRouting")

/**
 * The [SearchResultDocument] is a view on a document with all useful data for display in the search result area
 *  in the frontend.
 */
data class SearchResultDocument(
    val documentID: String,
    val projectID: String,
    val storeTimestamp: Long,
    val originalDocument: ObjectNode,
    val documentData: Map<String, Any>,
    val restrictedProjectID: String? = null,
    val projectAnnotationData: ProjectAnnotationData? = null
)

/**
 * Model representing a search request
 */
data class SearchRequest(
    val projectIDs: List<String>,
    val filterCondition: FilterCondition?
)

/**
 * The search endpoint is available for all user roles, based on the role with limited scope of search. Searches
 * are restricted to a list of projects with additional filter conditions that can be defined in the frontend.
 */
@KtorExperimentalAPI
fun Route.search(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, projectDAO: ProjectDAO,
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
            val projects = projectDAO.getProjectsByIds(searchRequest.projectIDs)
            val userProjects = projectDAO.getProjectsForUser(user.userIdentifier)
            val allowedProjects = if (applicationConfig.jwt.roleGlobalSearch in roles
                || applicationConfig.jwt.roleAdmin in roles
            ) {
                projects
            } else {
                projects.intersect(userProjects)
            }
            call.respond(allowedProjects.flatMap { c ->
                documentDAO.findForSearch(c, searchRequest.filterCondition).map { d ->
                    d.toSearchResultDocument(c)
                }
            }.sortedByDescending { it.storeTimestamp }
                .sortedBy { it.projectID })
        }
    }
}

/**
 * Convert a [Document] to a [SearchResultDocument]
 */
fun Document.toSearchResultDocument(project: Project): SearchResultDocument {
    return SearchResultDocument(
        id, project.id, storeTimestamp, originalDocument,
        applyInputMapping(project.inputMapping), restrictedProjectID, projectAnnotationData[project.id]
    )
}