[activeannoservice](../../index.md) / [document.annotation](../index.md) / [SpanTargetAnnotation](./index.md)

# SpanTargetAnnotation

`data class SpanTargetAnnotation : `[`Annotation`](../-annotation.md)`<`[`SpanTarget`](../../annotationdefinition.target/-span-target/index.md)`>`

All annotation values for a single AnnotationDefinition on a span target are represented by a [SpanTargetAnnotation](./index.md).
For example, a document might have spans of positive and negative sentiment. All annotations regarding sentiment would be
stored in a single [SpanTargetAnnotation](./index.md), holding a list of [annotations](annotations.md) of which each defines the spans concering the annotation
as well as the actual value, in this case POSITIVE or NEGATIVE sentiment.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | All annotation values for a single AnnotationDefinition on a span target are represented by a [SpanTargetAnnotation](./index.md). For example, a document might have spans of positive and negative sentiment. All annotations regarding sentiment would be stored in a single [SpanTargetAnnotation](./index.md), holding a list of [annotations](annotations.md) of which each defines the spans concering the annotation as well as the actual value, in this case POSITIVE or NEGATIVE sentiment.`SpanTargetAnnotation(annotations: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`SpanTargetSingleAnnotation`](../-span-target-single-annotation/index.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [annotations](annotations.md) | `val annotations: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`SpanTargetSingleAnnotation`](../-span-target-single-annotation/index.md)`>` |
