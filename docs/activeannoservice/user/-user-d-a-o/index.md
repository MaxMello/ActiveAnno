[activeannoservice](../../index.md) / [user](../index.md) / [UserDAO](./index.md)

# UserDAO

`class UserDAO`

DAO for accessing the user collection

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | DAO for accessing the user collection`UserDAO(database: CoroutineDatabase)` |

### Functions

| Name | Summary |
|---|---|
| [byUserIdentifier](by-user-identifier.md) | `suspend fun byUserIdentifier(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`): `[`User`](../-user/index.md)`?` |
| [createOrUpdate](create-or-update.md) | `suspend fun createOrUpdate(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, userName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null): `[`User`](../-user/index.md) |
| [getAll](get-all.md) | `suspend fun getAll(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`User`](../-user/index.md)`>` |
