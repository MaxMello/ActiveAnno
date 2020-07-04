[activeannoservice](../../index.md) / [project.filter](../index.md) / [ContainsAll](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`ContainsAll(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, value: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?>)`

Equivalent to And connection between Contains conditions, exists as shorthand
Example:
{ tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tags:ssl},{tags:security}](#) }

