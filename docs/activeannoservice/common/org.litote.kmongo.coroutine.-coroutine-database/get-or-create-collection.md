[activeannoservice](../../index.md) / [common](../index.md) / [org.litote.kmongo.coroutine.CoroutineDatabase](index.md) / [getOrCreateCollection](./get-or-create-collection.md)

# getOrCreateCollection

`suspend fun <reified T : `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`> CoroutineDatabase.getOrCreateCollection(collectionName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): CoroutineCollection<T>`

Create a mongo collection if not exist and return it

