[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [insertMany](./insert-many.md)

# insertMany

`suspend fun insertMany(json: ArrayNode, restrictedConfig: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

Given an json array of originalDocuments, create new document entries into the database.
Provide [restrictedConfig](insert-many.md#document.DocumentDAO$insertMany(com.fasterxml.jackson.databind.node.ArrayNode, kotlin.String)/restrictedConfig) optionally (only used in one-off project context)

