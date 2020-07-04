[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [insert](./insert.md)

# insert

`suspend fun insert(json: ObjectNode, restrictedProjectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)

Given the originalDocument, create a new document entry into the database.
Provide [restrictedProjectID](insert.md#document.DocumentDAO$insert(com.fasterxml.jackson.databind.node.ObjectNode, kotlin.String)/restrictedProjectID) optionally (only used in one-off project context)

