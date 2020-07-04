[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [findForAnnotation](./find-for-annotation.md)

# findForAnnotation

`suspend fun findForAnnotation(project: `[`Project`](../../project/-project/index.md)`, userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, limit: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 10, ignoreDocuments: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = listOf(), subFilter: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = mapOf(), dateRange: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`?>? = null, includeMissingProjectAnnotationData: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Document`](../-document/index.md)`>`

Encapsulates the query for getting new documents to annotate. Will use the projects filterCondition,
will optionally exclude some documents, and only return documents that are required for annotation and not already
annotated by the user

