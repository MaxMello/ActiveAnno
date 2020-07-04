[activeannoservice](../../index.md) / [api.annotate.dto](../index.md) / [AnnotationResultStoreResponse](./index.md)

# AnnotationResultStoreResponse

`data class AnnotationResultStoreResponse`

Return model for storing endpoints, letting the frontend know the data was stored successfully. If not, will return
[validationErrors](validation-errors.md)

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Return model for storing endpoints, letting the frontend know the data was stored successfully. If not, will return [validationErrors](validation-errors.md)`AnnotationResultStoreResponse(projectID: `[`ProjectID`](../../project/-project-i-d.md)`, documentID: `[`DocumentID`](../../document/-document-i-d.md)`, success: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, validationErrors: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ValidationError`](../-validation-error/index.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [documentID](document-i-d.md) | `val documentID: `[`DocumentID`](../../document/-document-i-d.md) |
| [projectID](project-i-d.md) | `val projectID: `[`ProjectID`](../../project/-project-i-d.md) |
| [success](success.md) | `val success: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [validationErrors](validation-errors.md) | `val validationErrors: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ValidationError`](../-validation-error/index.md)`>` |
