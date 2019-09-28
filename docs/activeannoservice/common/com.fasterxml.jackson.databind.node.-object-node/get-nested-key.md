[activeannoservice](../../index.md) / [common](../index.md) / [com.fasterxml.jackson.databind.node.ObjectNode](index.md) / [getNestedKey](./get-nested-key.md)

# getNestedKey

`fun ObjectNode.getNestedKey(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, separator: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "."): JsonNode?`

Based on a nested key string like "a.b.c", get value for key b in a and key c in b. Null if not found.

