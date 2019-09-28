[activeannoservice](../index.md) / [user](./index.md)

## Package user

### Types

| Name | Summary |
|---|---|
| [Message](-message/index.md) | `data class Message`<br>A message is a text between two users, relating to an [AnnotationResult](../document/-annotation-result/index.md) |
| [MessageDAO](-message-d-a-o/index.md) | `class MessageDAO`<br>DAO for the [Message](-message/index.md) model, controlling access to the message collection. |
| [User](-user/index.md) | `data class User`<br>Data class representing a user. This model does not contain login information except the unique [userIdentifier](-user/user-identifier.md), and contains an optional [userName](-user/user-name.md) and the [lastAccessTimestamp](-user/last-access-timestamp.md) |
| [UserDAO](-user-d-a-o/index.md) | `class UserDAO` |
| [UserInfo](-user-info/index.md) | `data class UserInfo`<br>View on the [User](-user/index.md) only containing the unique [userIdentifier](-user-info/user-identifier.md) and the [userName](-user-info/user-name.md) |

### Functions

| Name | Summary |
|---|---|
| [toUserInfoModel](to-user-info-model.md) | `fun `[`User`](-user/index.md)`.toUserInfoModel(): `[`UserInfo`](-user-info/index.md) |
