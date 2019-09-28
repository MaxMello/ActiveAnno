[activeannoservice](../index.md) / [user](./index.md)

## Package user

### Types

| Name | Summary |
|---|---|
| [User](-user/index.md) | `data class User`<br>Data class representing a user. This model does not contain login information except the unique [userIdentifier](-user/user-identifier.md), and contains an optional [userName](-user/user-name.md) and the [lastAccessTimestamp](-user/last-access-timestamp.md) |
| [UserDAO](-user-d-a-o/index.md) | `class UserDAO` |
| [UserInfo](-user-info/index.md) | `data class UserInfo`<br>View on the [User](-user/index.md) only containing the unique [userIdentifier](-user-info/user-identifier.md) and the [userName](-user-info/user-name.md) |

### Functions

| Name | Summary |
|---|---|
| [toUserInfoModel](to-user-info-model.md) | `fun `[`User`](-user/index.md)`.toUserInfoModel(): `[`UserInfo`](-user-info/index.md) |
