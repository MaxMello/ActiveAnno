[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [findForAnnotation](./find-for-annotation.md)

# findForAnnotation

`suspend fun findForAnnotation(config: `[`ProjectConfig`](../../config/-project-config/index.md)`, userIdentifier: `[`UserIdentifier`](../../config/-user-identifier.md)`, limit: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 10, ignoreDocuments: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = listOf()): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Document`](../-document/index.md)`>`

Encapsulates the query for getting new documents to annotate. Will use the configs filterCondition,
will optionally exclude some documents, and only return documents that are required for annotation and not already
annotated by the user

