[activeannoservice](../index.md) / [user](./index.md)

## Package user

### Types

| Name | Summary |
|---|---|
| [User](-user/index.md) | Data class representing a user. This model does not contain login information except the unique [userIdentifier](-user/user-identifier.md), and contains an optional [userName](-user/user-name.md) and the [lastAccessTimestamp](-user/last-access-timestamp.md)`data class User` |
| [UserDAO](-user-d-a-o/index.md) | DAO for accessing the user collection`class UserDAO` |
| [UserInfo](-user-info/index.md) | View on the [User](-user/index.md) only containing the unique [userIdentifier](-user-info/user-identifier.md) and the [userName](-user-info/user-name.md)`data class UserInfo` |

### Functions

| Name | Summary |
|---|---|
| [toUserInfoModel](to-user-info-model.md) | `fun `[`User`](-user/index.md)`.toUserInfoModel(): `[`UserInfo`](-user-info/index.md) |
