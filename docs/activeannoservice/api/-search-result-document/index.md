[activeannoservice](../../index.md) / [api](../index.md) / [SearchResultDocument](./index.md)

# SearchResultDocument

`data class SearchResultDocument`

The [SearchResultDocument](./index.md) is a view on a document with all useful data for display in the search result area
in the frontend.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `SearchResultDocument(documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, originalDocument: ObjectNode, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>, restrictedConfig: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, configAnnotationData: `[`ConfigAnnotationData`](../../document/-config-annotation-data/index.md)`? = null)`<br>The [SearchResultDocument](./index.md) is a view on a document with all useful data for display in the search result area in the frontend. |

### Properties

| Name | Summary |
|---|---|
| [configAnnotationData](config-annotation-data.md) | `val configAnnotationData: `[`ConfigAnnotationData`](../../document/-config-annotation-data/index.md)`?` |
| [configurationID](configuration-i-d.md) | `val configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [documentData](document-data.md) | `val documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>` |
| [documentID](document-i-d.md) | `val documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [originalDocument](original-document.md) | `val originalDocument: ObjectNode` |
| [restrictedConfig](restricted-config.md) | `val restrictedConfig: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [storeTimestamp](store-timestamp.md) | `val storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
