package api.pagesetup

import application.ApplicationConfig
import common.*
import config.ProjectConfigDAO
import config.userroles.UserIdentifier
import document.DocumentDAO
import io.ktor.application.call
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import user.message.MessageDAO
import user.UserDAO
import user.UserInfo
import user.toUserInfoModel

const val PAGE_ADMIN = "admin"
const val PAGE_MANAGE = "manage"
const val PAGE_CURATE = "curate"
const val PAGE_ANNOTATE = "annotate"
const val PAGE_SEARCH = "search"
const val PAGE_MESSAGES = "messages"

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
fun Route.pageSetup(applicationConfig: ApplicationConfig, userDAO: UserDAO, projectConfigDAO: ProjectConfigDAO,
                    documentDAO: DocumentDAO, messageDAO: MessageDAO
) {
    route("/pageSetup") {
        getAuthenticatedByJwt(listOf(
                applicationConfig.jwt.roleAdmin,
                applicationConfig.jwt.roleManager,
                applicationConfig.jwt.roleUser
            ), onlyOneMustMatch = true
        ) {
            val roles = jwt.roles
            val user = userDAO.createOrUpdate(jwt.userIdentifier, jwt.userName)
            val configs = projectConfigDAO.getConfigsForUser(user.userIdentifier)
            call.respond(PageSetup(pages = (if (roles.contains(applicationConfig.jwt.roleUser)) {
                when {
                    configs.any { it.userRoles.curators.contains(user.userIdentifier) } && configs.any {
                        it.userRoles.annotators.contains(
                            user.userIdentifier
                        )
                    } -> listOf(
                        PAGE_ANNOTATE,
                        PAGE_CURATE
                    )
                    configs.any { it.userRoles.curators.contains(user.userIdentifier) } -> listOf(PAGE_CURATE)
                    configs.any { it.userRoles.annotators.contains(user.userIdentifier) } -> listOf(PAGE_ANNOTATE)
                    else -> listOf()
                }
            } else {
                listOf()
            } + roles.map { role ->
                when (role) {
                    applicationConfig.jwt.roleManager -> PAGE_MANAGE
                    // applicationConfig.jwt.roleAdmin -> PAGE_ADMIN    // TODO Enable if implemented
                    else -> ""
                }
            }).filter { it.isNotEmpty() }
                .map {
                    it to (when (it) {
                        PAGE_ANNOTATE -> {
                            Page(
                                documentDAO.countForAnnotation(
                                    configs.filter { c -> c.userRoles.annotators.contains(user.userIdentifier) },
                                    user.userIdentifier
                                )
                            )
                        }
                        PAGE_CURATE -> {
                            Page(documentDAO.countForCuration(configs.filter { c ->
                                c.userRoles.curators.contains(
                                    user.userIdentifier
                                )
                            }, user.userIdentifier))
                        }
                        else -> Page()
                    })
                }.toMap() + mapOf(/*PAGE_SEARCH to Page(), PAGE_MESSAGES to Page(badgeCount = messageDAO.countUnreadForRecipient(user.userIdentifier))// TODO Enable if implemented */),
                userInfo = userDAO.getAll().map { it.userIdentifier to it.toUserInfoModel() }.toMap()
            )
            )
        }
    }
}