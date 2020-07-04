[activeannoservice](../../index.md) / [document.annotation](../index.md) / [SpanTargetAnnotation](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`SpanTargetAnnotation(annotations: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`SpanTargetSingleAnnotation`](../-span-target-single-annotation/index.md)`>)`

All annotation values for a single AnnotationDefinition on a span target are represented by a [SpanTargetAnnotation](index.md).
For example, a document might have spans of positive and negative sentiment. All annotations regarding sentiment would be
stored in a single [SpanTargetAnnotation](index.md), holding a list of [annotations](annotations.md) of which each defines the spans concering the annotation
as well as the actual value, in this case POSITIVE or NEGATIVE sentiment.

