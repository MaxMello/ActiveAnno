[activeannoservice](../../index.md) / [api.search](../index.md) / [SearchResultDocument](./index.md)

# SearchResultDocument

`data class SearchResultDocument`

The [SearchResultDocument](./index.md) is a view on a document with all useful data for display in the search result area
in the frontend.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | The [SearchResultDocument](./index.md) is a view on a document with all useful data for display in the search result area in the frontend.`SearchResultDocument(documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, originalDocument: ObjectNode, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>, restrictedProjectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, projectAnnotationData: `[`ProjectAnnotationData`](../../document/-project-annotation-data/index.md)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [documentData](document-data.md) | `val documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>` |
| [documentID](document-i-d.md) | `val documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [originalDocument](original-document.md) | `val originalDocument: ObjectNode` |
| [projectAnnotationData](project-annotation-data.md) | `val projectAnnotationData: `[`ProjectAnnotationData`](../../document/-project-annotation-data/index.md)`?` |
| [projectID](project-i-d.md) | `val projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [restrictedProjectID](restricted-project-i-d.md) | `val restrictedProjectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [storeTimestamp](store-timestamp.md) | `val storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
