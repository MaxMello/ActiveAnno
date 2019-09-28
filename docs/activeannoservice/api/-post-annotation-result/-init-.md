[activeannoservice](../../index.md) / [api](../index.md) / [PostAnnotationResult](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`PostAnnotationResult(documentID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>, documentAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`DocumentAnnotation`](../../document/-document-annotation/index.md)`>, spanAnnotations: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SpanAnnotation`](../../document/-span-annotation/index.md)`>>, usedConfig: `[`AnnotateConfig`](../../config/-annotate-config/index.md)`, interactionLog: `[`InteractionLog`](../../document/-interaction-log/index.md)`, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)`

Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into
other data structures for storing.

