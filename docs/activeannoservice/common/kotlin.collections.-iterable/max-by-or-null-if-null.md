[activeannoservice](../../index.md) / [common](../index.md) / [kotlin.collections.Iterable](index.md) / [maxByOrNullIfNull](./max-by-or-null-if-null.md)

# maxByOrNullIfNull

`inline fun <T, R : `[`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)`<R>> `[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)`<T>.maxByOrNullIfNull(selector: (T) -> R?): T?`

Equivalent to kotlins maxBy, but allow for the selector to return null, in which case null will be returned.

