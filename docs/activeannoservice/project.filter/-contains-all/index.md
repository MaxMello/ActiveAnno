[activeannoservice](../../index.md) / [project.filter](../index.md) / [ContainsAll](./index.md)

# ContainsAll

`class ContainsAll : `[`FilterCondition`](../-filter-condition/index.md)

Equivalent to And connection between Contains conditions, exists as shorthand
Example:
{ tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tags:ssl},{tags:security}](#) }

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Equivalent to And connection between Contains conditions, exists as shorthand Example: { tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tags:ssl},{tags:security}](#) }`ContainsAll(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, value: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?>)` |

### Properties

| Name | Summary |
|---|---|
| [value](value.md) | `val value: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?>` |

### Functions

| Name | Summary |
|---|---|
| [equals](equals.md) | `fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
