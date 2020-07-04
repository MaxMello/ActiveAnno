[activeannoservice](../../index.md) / [project](../index.md) / [ProjectDAO](./index.md)

# ProjectDAO

`class ProjectDAO`

DAO for the [Project](../-project/index.md) regulating access to the project collection

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | DAO for the [Project](../-project/index.md) regulating access to the project collection`ProjectDAO(database: CoroutineDatabase)` |

### Functions

| Name | Summary |
|---|---|
| [getAll](get-all.md) | `suspend fun getAll(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Project`](../-project/index.md)`>` |
| [getAllActive](get-all-active.md) | `suspend fun getAllActive(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Project`](../-project/index.md)`>` |
| [getAnnotateProjectsForUser](get-annotate-projects-for-user.md) | `suspend fun getAnnotateProjectsForUser(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, activeOnly: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Project`](../-project/index.md)`>` |
| [getCurateProjectsForUser](get-curate-projects-for-user.md) | `suspend fun getCurateProjectsForUser(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, activeOnly: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Project`](../-project/index.md)`>` |
| [getManageProjectsForUser](get-manage-projects-for-user.md) | `suspend fun getManageProjectsForUser(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, activeOnly: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Project`](../-project/index.md)`>` |
| [getProjectById](get-project-by-id.md) | `suspend fun getProjectById(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`Project`](../-project/index.md) |
| [getProjectsByIds](get-projects-by-ids.md) | `suspend fun getProjectsByIds(ids: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Project`](../-project/index.md)`>` |
| [getProjectsForUser](get-projects-for-user.md) | `suspend fun getProjectsForUser(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, activeOnly: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Project`](../-project/index.md)`>` |
| [insertOne](insert-one.md) | `suspend fun insertOne(project: `[`Project`](../-project/index.md)`): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [replaceById](replace-by-id.md) | `suspend fun replaceById(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, project: `[`Project`](../-project/index.md)`): UpdateResult` |
| [save](save.md) | `suspend fun save(project: `[`Project`](../-project/index.md)`): UpdateResult?` |
