[activeannoservice](../../index.md) / [user](../index.md) / [UserDAO](./index.md)

# UserDAO

`class UserDAO`

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `UserDAO(database: CoroutineDatabase)` |

### Functions

| Name | Summary |
|---|---|
| [createOrUpdate](create-or-update.md) | `suspend fun createOrUpdate(userIdentifier: `[`UserIdentifier`](../../config/-user-identifier.md)`, userName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null): `[`User`](../-user/index.md) |
| [getAll](get-all.md) | `suspend fun getAll(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`User`](../-user/index.md)`>` |
