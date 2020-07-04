[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [findForExport](./find-for-export.md)

# findForExport

`suspend fun findForExport(projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, includeUnfinished: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, documentIDs: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>, timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`?): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Document`](../-document/index.md)`>`

Get all documents for an export for a [projectID](find-for-export.md#document.DocumentDAO$findForExport(kotlin.String, kotlin.Boolean, kotlin.collections.List((kotlin.String)), kotlin.Long)/projectID) with options to also include unfinished documents,
limit it to a list of [documentIDs](find-for-export.md#document.DocumentDAO$findForExport(kotlin.String, kotlin.Boolean, kotlin.collections.List((kotlin.String)), kotlin.Long)/documentIDs) and/or only return documents newer than a [timestamp](find-for-export.md#document.DocumentDAO$findForExport(kotlin.String, kotlin.Boolean, kotlin.collections.List((kotlin.String)), kotlin.Long)/timestamp). If unfinished documents
are included, the annotation timestamp will be used, else the finalizedAnnotation timestamp.

