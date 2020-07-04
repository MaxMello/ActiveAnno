[activeannoservice](../../index.md) / [user.message](../index.md) / [MessageDAO](./index.md)

# MessageDAO

`class MessageDAO`

DAO for the [Message](../-message/index.md) model, controlling access to the message collection.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | DAO for the [Message](../-message/index.md) model, controlling access to the message collection.`MessageDAO(database: CoroutineDatabase)` |

### Functions

| Name | Summary |
|---|---|
| [countUnreadForRecipient](count-unread-for-recipient.md) | `suspend fun countUnreadForRecipient(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`): `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [getAll](get-all.md) | `suspend fun getAll(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Message`](../-message/index.md)`>` |
| [getAllForRecipient](get-all-for-recipient.md) | `suspend fun getAllForRecipient(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Message`](../-message/index.md)`>` |
| [getAllForSender](get-all-for-sender.md) | `suspend fun getAllForSender(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Message`](../-message/index.md)`>` |
| [getUnreadForRecipient](get-unread-for-recipient.md) | `suspend fun getUnreadForRecipient(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Message`](../-message/index.md)`>` |
