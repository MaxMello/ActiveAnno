[activeannoservice](../../index.md) / [document.annotation](../index.md) / [SpanTargetSingleAnnotation](./index.md)

# SpanTargetSingleAnnotation

`data class SpanTargetSingleAnnotation`

A [SpanTargetSingleAnnotation](./index.md) maps a single annotation value to the [spans](spans.md) (often only a single span) which the annotation value
is associated with.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | A [SpanTargetSingleAnnotation](./index.md) maps a single annotation value to the [spans](spans.md) (often only a single span) which the annotation value is associated with.`SpanTargetSingleAnnotation(spans: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Span`](../-span/index.md)`>, values: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ValueToProbability`](../-value-to-probability/index.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [singleValue](single-value.md) | For annotations that only store a single value, never a list, this property is a shortcut to accessing it`val singleValue: `[`ValueToProbability`](../-value-to-probability/index.md)`?` |
| [spans](spans.md) | A single annotation value can be associated with multiple spans, a span being defined by two numbers indicating the begin and end of the span. Usually it will only be one span, but multiple ones are possible.`val spans: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Span`](../-span/index.md)`>` |
| [spansSorted](spans-sorted.md) | Property that will sort annotations by span begin and end`val spansSorted: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Span`](../-span/index.md)`>` |
| [values](values.md) | We always store a set of values, even though some annotations will be 1 length lists (like a single boolean value) This is to streamline to API and data handling in all steps.`val values: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ValueToProbability`](../-value-to-probability/index.md)`>` |

### Functions

| Name | Summary |
|---|---|
| [equals](equals.md) | We overwrite equals (and hashCode) because while the order of values should be preserved, for comparison it should not matter`fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
