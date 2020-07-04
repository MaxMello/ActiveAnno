package user

import project.userroles.UserIdentifier

/**
 * View on the [User] only containing the unique [userIdentifier] and the [userName]
 */
data class UserInfo(
    val userIdentifier: UserIdentifier,
    val userName: String? = null
)

fun User.toUserInfoModel(): UserInfo {
    return UserInfo(userIdentifier, userName)
}

/**
 * Data class representing a user. This model does not contain login information except the unique [userIdentifier],
 * and contains an optional [userName] and the [lastAccessTimestamp]
 */
data class User(
    val userIdentifier: UserIdentifier,
    val userName: String? = null,
    val _id: String? = null,
    val lastAccessTimestamp: Long? = null
)