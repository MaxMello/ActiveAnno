[activeannoservice](../../index.md) / [config.annotations](../index.md) / [SpanTarget](./index.md)

# SpanTarget

`data class SpanTarget : `[`Target`](../-target.md)

Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `SpanTarget(granularity: `[`SpanGranularity`](../-span-granularity/index.md)`, multiToken: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, trimWhitespace: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, trimPunctuation: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, allowStacking: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, minNumberOfSpans: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null, maxNumberOfSpans: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null)`<br>Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set. |

### Properties

| Name | Summary |
|---|---|
| [allowStacking](allow-stacking.md) | `val allowStacking: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)<br>Allow other annotations on top of this one. For example, "A great comment" where "comment" is already labeled, allow "great comment" to also be labeled with either another or the same |
| [granularity](granularity.md) | `val granularity: `[`SpanGranularity`](../-span-granularity/index.md) |
| [maxNumberOfSpans](max-number-of-spans.md) | `val maxNumberOfSpans: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`?`<br>Maximum number of spans. Default = null, meaning no limit. For example, if value = 3, the annotation can have 3 separate spans. |
| [minNumberOfSpans](min-number-of-spans.md) | `val minNumberOfSpans: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`?`<br>Minimum number of spans for the annotation, default = null, meaning no limit. Only relevant if annotation itself is required, else this value is not checked. |
| [multiToken](multi-token.md) | `val multiToken: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)<br>Allow multiple tokens in a single span. Example:     "A great comment". Span: "great comment". If false, only "A", "great" or "comment" would be allowed. |
| [trimPunctuation](trim-punctuation.md) | `val trimPunctuation: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)<br>Trim punctuation from spans automatically |
| [trimWhitespace](trim-whitespace.md) | `val trimWhitespace: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)<br>Trim whitespaces from spans automatically |
