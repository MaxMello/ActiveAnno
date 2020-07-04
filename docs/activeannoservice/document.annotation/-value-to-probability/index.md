[activeannoservice](../../index.md) / [document.annotation](../index.md) / [ValueToProbability](./index.md)

# ValueToProbability

`data class ValueToProbability`

In some contexts, a [value](value.md) might have an associated [probability](probability.md). This is the case when annotations are imported or generated with a
probability of how likely this annotation has the value.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | In some contexts, a [value](value.md) might have an associated [probability](probability.md). This is the case when annotations are imported or generated with a probability of how likely this annotation has the value.`ValueToProbability(value: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`, probability: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [probability](probability.md) | `val probability: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html)`?` |
| [value](value.md) | `val value: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) |

### Functions

| Name | Summary |
|---|---|
| [equals](equals.md) | For [ValueToProbability](./index.md), only the [value](value.md) is relevant for equals comparisons, because the probability might be missing and is only in this model for generated annotations anyway.`fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | The hashCode of [ValueToProbability](./index.md) is equal the hashCode of [value](value.md) as this is really only a wrapper class for it`fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
