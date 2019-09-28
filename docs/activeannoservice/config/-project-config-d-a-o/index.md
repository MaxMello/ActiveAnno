[activeannoservice](../../index.md) / [config](../index.md) / [ProjectConfigDAO](./index.md)

# ProjectConfigDAO

`class ProjectConfigDAO`

DAO for the [ProjectConfig](../-project-config/index.md) regulating access to the config collection

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `ProjectConfigDAO(database: CoroutineDatabase)`<br>DAO for the [ProjectConfig](../-project-config/index.md) regulating access to the config collection |

### Functions

| Name | Summary |
|---|---|
| [getAnnotateConfigsForUser](get-annotate-configs-for-user.md) | `suspend fun getAnnotateConfigsForUser(userIdentifier: `[`UserIdentifier`](../-user-identifier.md)`, activeOnly: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`ProjectConfig`](../-project-config/index.md)`>` |
| [getConfigById](get-config-by-id.md) | `suspend fun getConfigById(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`ProjectConfig`](../-project-config/index.md) |
| [getConfigsByIds](get-configs-by-ids.md) | `suspend fun getConfigsByIds(ids: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ProjectConfig`](../-project-config/index.md)`>` |
| [getConfigsForUser](get-configs-for-user.md) | `suspend fun getConfigsForUser(userIdentifier: `[`UserIdentifier`](../-user-identifier.md)`, activeOnly: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`ProjectConfig`](../-project-config/index.md)`>` |
| [getCurateConfigsForUser](get-curate-configs-for-user.md) | `suspend fun getCurateConfigsForUser(userIdentifier: `[`UserIdentifier`](../-user-identifier.md)`, activeOnly: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`ProjectConfig`](../-project-config/index.md)`>` |
| [getManageConfigsForUser](get-manage-configs-for-user.md) | `suspend fun getManageConfigsForUser(userIdentifier: `[`UserIdentifier`](../-user-identifier.md)`, activeOnly: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`ProjectConfig`](../-project-config/index.md)`>` |
| [insertOne](insert-one.md) | `suspend fun insertOne(config: `[`ProjectConfig`](../-project-config/index.md)`): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [replaceById](replace-by-id.md) | `suspend fun replaceById(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, config: `[`ProjectConfig`](../-project-config/index.md)`): UpdateResult` |
