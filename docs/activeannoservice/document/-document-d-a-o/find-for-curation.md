[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [findForCuration](./find-for-curation.md)

# findForCuration

`suspend fun findForCuration(config: `[`ProjectConfig`](../../config/-project-config/index.md)`, userIdentifier: `[`UserIdentifier`](../../config.userroles/-user-identifier.md)`, limit: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 10, ignoreDocuments: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = listOf()): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Document`](../-document/index.md)`>`

Encapsulates the query for getting new documents to curate. Will use the configs filterCondition,
will optionally exclude some documents, and only return documents that are required for curation.
If a curator is also an annotator, and the curator annotated a document, the curator will not be able to curate the document.

