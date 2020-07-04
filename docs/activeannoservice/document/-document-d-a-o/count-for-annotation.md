[activeannoservice](../../index.md) / [document](../index.md) / [DocumentDAO](index.md) / [countForAnnotation](./count-for-annotation.md)

# countForAnnotation

`suspend fun countForAnnotation(projects: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Project`](../../project/-project/index.md)`>, userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, includeMissingProjectAnnotationData: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true): `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)

Count number of annotations required by the user given its [userIdentifier](count-for-annotation.md#document.DocumentDAO$countForAnnotation(kotlin.collections.List((project.Project)), kotlin.String, kotlin.Boolean)/userIdentifier) and a list of [projects](count-for-annotation.md#document.DocumentDAO$countForAnnotation(kotlin.collections.List((project.Project)), kotlin.String, kotlin.Boolean)/projects).

