[activeannoservice](../../index.md) / [api.manage](../index.md) / [ProjectStoreResponse](./index.md)

# ProjectStoreResponse

`data class ProjectStoreResponse`

Response body for storing a [Project](#) with success info and validation errors

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Response body for storing a [Project](#) with success info and validation errors`ProjectStoreResponse(projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, project: `[`ManageProject`](../../api.manage.dto/-manage-project/index.md)`?, success: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, errors: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ProjectValidationError`](../../project/-project-validation-error/index.md)`>, message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`)` |

### Properties

| Name | Summary |
|---|---|
| [errors](errors.md) | `val errors: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ProjectValidationError`](../../project/-project-validation-error/index.md)`>` |
| [message](message.md) | `val message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [project](project.md) | `val project: `[`ManageProject`](../../api.manage.dto/-manage-project/index.md)`?` |
| [projectID](project-i-d.md) | `val projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [success](success.md) | `val success: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
