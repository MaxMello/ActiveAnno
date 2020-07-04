[activeannoservice](../../index.md) / [document.annotation](../index.md) / [ValueToProbability](index.md) / [equals](./equals.md)

# equals

`fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)

For [ValueToProbability](index.md), only the [value](value.md) is relevant for equals comparisons, because the probability might be missing and is only in this
model for generated annotations anyway.

