[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [insertMany](./insert-many.md)

# insertMany

`suspend fun insertMany(json: ArrayNode, restrictedProjectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>`

Given an json array of originalDocuments, create new document entries into the database.
Provide [restrictedProjectID](insert-many.md#document.DocumentDAO$insertMany(com.fasterxml.jackson.databind.node.ArrayNode, kotlin.String)/restrictedProjectID) optionally (only used in one-off project context)

