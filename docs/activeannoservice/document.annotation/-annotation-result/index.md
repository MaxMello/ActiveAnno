[activeannoservice](../../index.md) / [document.annotation](../index.md) / [AnnotationResult](./index.md)

# AnnotationResult

`data class AnnotationResult`

Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses
by the policy logic.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `AnnotationResult(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, documentAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../config.annotations/-annotation-i-d.md)`, `[`DocumentAnnotation`](../-document-annotation/index.md)`>, spanAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../config.annotations/-annotation-i-d.md)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SpanAnnotation`](../-span-annotation/index.md)`>>, creator: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResultCreator`](../-annotation-result-creator/index.md)`>, interactionLog: `[`InteractionLog`](../-interaction-log/index.md)`? = null, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>? = null, usedConfig: `[`AnnotateConfig`](../../config/-annotate-config/index.md)`? = null)`<br>Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses by the policy logic. |

### Properties

| Name | Summary |
|---|---|
| [configurationID](configuration-i-d.md) | `val configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [creator](creator.md) | `val creator: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResultCreator`](../-annotation-result-creator/index.md)`>` |
| [documentAnnotations](document-annotations.md) | `val documentAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../config.annotations/-annotation-i-d.md)`, `[`DocumentAnnotation`](../-document-annotation/index.md)`>` |
| [documentData](document-data.md) | `val documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>?` |
| [documentID](document-i-d.md) | `val documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [id](id.md) | `val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [interactionLog](interaction-log.md) | `val interactionLog: `[`InteractionLog`](../-interaction-log/index.md)`?` |
| [spanAnnotations](span-annotations.md) | `val spanAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../config.annotations/-annotation-i-d.md)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SpanAnnotation`](../-span-annotation/index.md)`>>` |
| [timestamp](timestamp.md) | `val timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [usedConfig](used-config.md) | `val usedConfig: `[`AnnotateConfig`](../../config/-annotate-config/index.md)`?` |
