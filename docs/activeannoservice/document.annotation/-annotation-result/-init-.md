[activeannoservice](../../index.md) / [document.annotation](../index.md) / [AnnotationResult](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`AnnotationResult(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, documentAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../config.annotations/-annotation-i-d.md)`, `[`DocumentAnnotation`](../-document-annotation/index.md)`>, spanAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../config.annotations/-annotation-i-d.md)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SpanAnnotation`](../-span-annotation/index.md)`>>, creator: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResultCreator`](../-annotation-result-creator/index.md)`>, interactionLog: `[`InteractionLog`](../-interaction-log/index.md)`? = null, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>? = null, usedConfig: `[`AnnotateConfig`](../../config/-annotate-config/index.md)`? = null)`

Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses
by the policy logic.
