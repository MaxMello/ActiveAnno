package api.pagesetup

import application.ApplicationConfig
import common.*
import document.DocumentDAO
import io.ktor.application.call
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory
import project.ProjectDAO
import project.userroles.UserIdentifier
import user.UserDAO
import user.UserInfo
import user.message.MessageDAO
import user.toUserInfoModel

/*
 * Constants for the individual frontend pages
 */
const val PAGE_ADMIN = "admin"
const val PAGE_MANAGE = "manage"
const val PAGE_CURATE = "curate"
const val PAGE_ANNOTATE = "annotate"
const val PAGE_SEARCH = "search"
const val PAGE_MESSAGES = "messages"

private val logger = LoggerFactory.getLogger("PageSetupRouting")
/**
 * A [Page] represents a UI page of the frontend, optionally with a [badgeCount] to indicate how many interactions
 * are waiting for the user
 */
data class Page(val badgeCount: Long? = null)

/**
 * Model for frontend communication representing the PageSetup, controlling the layout and core data for the page setup
 * of the frontend
 */
data class PageSetup(
    val pages: Map<String, Page>,
    val userInfo: Map<UserIdentifier, UserInfo>
)

/**
 * This route is used by the frontend to load the correct UI pages. It also serves as the endpoint to get the current
 * number of open tasks per page where applicable
 * - for annotate, the number of open documents to annotate for the user
 * - for curate, the number of open documents to curate for the user
 * - for messages, the number of unread messages
 */
@KtorExperimentalAPI
fun Route.pageSetup(
    applicationConfig: ApplicationConfig, userDAO: UserDAO, projectDAO: ProjectDAO,
    documentDAO: DocumentDAO, messageDAO: MessageDAO
) {
    route("/pageSetup") {
        getAuthenticatedByJwt(
            listOf(
                applicationConfig.jwt.roleAdmin,
                applicationConfig.jwt.roleManager,
                applicationConfig.jwt.roleUser
            ), onlyOneMustMatch = true
        ) {
            val roles = jwt.roles
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val projects = projectDAO.getProjectsForUser(user.userIdentifier)
            call.respond(PageSetup(pages = (if (roles.contains(applicationConfig.jwt.roleUser)) {
                when {
                    projects.any { it.userRoles.curators.contains(user.userIdentifier) } && projects.any {
                        it.userRoles.annotators.contains(
                            user.userIdentifier
                        )
                    } -> listOf(
                        PAGE_ANNOTATE,
                        PAGE_CURATE
                    )
                    projects.any { it.userRoles.curators.contains(user.userIdentifier) } -> listOf(PAGE_CURATE)
                    projects.any { it.userRoles.annotators.contains(user.userIdentifier) } -> listOf(PAGE_ANNOTATE)
                    else -> listOf()
                }
            } else {
                listOf()
            } + roles.map { role ->
                when (role) {
                    applicationConfig.jwt.roleManager -> PAGE_MANAGE
                    else -> ""
                }
            }).filter { it.isNotEmpty() }
                .map {
                    it to (when (it) {
                        PAGE_ANNOTATE -> {
                            Page(
                                documentDAO.countForAnnotation(
                                    projects.filter { c -> c.userRoles.annotators.contains(user.userIdentifier) },
                                    user.userIdentifier, true
                                )
                            )
                        }
                        PAGE_CURATE -> {
                            Page(
                                documentDAO.countForCuration(projects.filter { c ->
                                c.userRoles.curators.contains(
                                    user.userIdentifier
                                )}, user.userIdentifier)
                            )
                        }
                        else -> Page()
                    })
                }.toMap(),
                userInfo = userDAO.getAll().map { it.userIdentifier to it.toUserInfoModel() }.toMap()
            )
            )
        }
    }
}