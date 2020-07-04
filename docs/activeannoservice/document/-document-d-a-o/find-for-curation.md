[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [findForCuration](./find-for-curation.md)

# findForCuration

`suspend fun findForCuration(project: `[`Project`](../../project/-project/index.md)`, userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, limit: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 10, ignoreDocuments: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = listOf(), subFilter: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = mapOf(), dateRange: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`?>? = null): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Document`](../-document/index.md)`>`

Encapsulates the query for getting new documents to curate. Will use the projects filterCondition,
will optionally exclude some documents, and only return documents that are required for curation.
If a curator is also an annotator, and the curator annotated a document, the curator will not be able to curate the document.

