[activeannoservice](../../index.md) / [common](../index.md) / [kotlin.collections.Iterable](index.md) / [allAndNotEmpty](./all-and-not-empty.md)

# allAndNotEmpty

`inline fun <T> `[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)`<T>.allAndNotEmpty(predicate: (T) -> `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)

Equivalent to kotlins all(), but return false if the iterable is empty where all() would return true.

