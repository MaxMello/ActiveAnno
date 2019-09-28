[activeannoservice](../../index.md) / [api](../index.md) / [PostAnnotationResult](./index.md)

# PostAnnotationResult

`data class PostAnnotationResult`

Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into
other data structures for storing.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `PostAnnotationResult(documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>, documentAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`DocumentAnnotation`](../../document/-document-annotation/index.md)`>, spanAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SpanAnnotation`](../../document/-span-annotation/index.md)`>>, usedConfig: `[`AnnotateConfig`](../../config/-annotate-config/index.md)`, interactionLog: `[`InteractionLog`](../../document/-interaction-log/index.md)`, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)`<br>Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into other data structures for storing. |

### Properties

| Name | Summary |
|---|---|
| [configurationID](configuration-i-d.md) | `val configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [curationRequest](curation-request.md) | `val curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [documentAnnotations](document-annotations.md) | `val documentAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`DocumentAnnotation`](../../document/-document-annotation/index.md)`>` |
| [documentData](document-data.md) | `val documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>` |
| [documentID](document-i-d.md) | `val documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [interactionLog](interaction-log.md) | `val interactionLog: `[`InteractionLog`](../../document/-interaction-log/index.md) |
| [spanAnnotations](span-annotations.md) | `val spanAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SpanAnnotation`](../../document/-span-annotation/index.md)`>>` |
| [usedConfig](used-config.md) | `val usedConfig: `[`AnnotateConfig`](../../config/-annotate-config/index.md) |
