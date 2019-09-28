[activeannoservice](../../index.md) / [document.annotation](../index.md) / [SpanAnnotation](./index.md)

# SpanAnnotation

`data class SpanAnnotation`

A span annotation maps a list of spans to the annotation value, which can be [Any](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) type
(but actually only primitives, String, and collection of those types)

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `SpanAnnotation(spans: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Span`](../-span/index.md)`>, value: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`)`<br>A span annotation maps a list of spans to the annotation value, which can be [Any](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) type (but actually only primitives, String, and collection of those types) |

### Properties

| Name | Summary |
|---|---|
| [spans](spans.md) | `val spans: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Span`](../-span/index.md)`>`<br>Every [SpanAnnotation](./index.md) can have multiple spans with gaps in between. For continuous spans, the [spans](spans.md) list will have size 1. |
| [value](value.md) | `val value: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)<br>The [value](value.md) of the annotation |
