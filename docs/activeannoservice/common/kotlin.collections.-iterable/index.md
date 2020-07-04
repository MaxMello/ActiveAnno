[activeannoservice](../../index.md) / [common](../index.md) / [kotlin.collections.Iterable](./index.md)

### Extensions for kotlin.collections.Iterable

| Name | Summary |
|---|---|
| [allAndNotEmpty](all-and-not-empty.md) | Equivalent to kotlins all(), but return false if the iterable is empty where all() would return true.`fun <T> `[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)`<T>.allAndNotEmpty(predicate: (T) -> `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [maxByOrNullIfNull](max-by-or-null-if-null.md) | Equivalent to kotlins maxBy, but allow for the selector to return null, in which case null will be returned.`fun <T, R : `[`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)`<R>> `[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)`<T>.maxByOrNullIfNull(selector: (T) -> R?): T?` |
