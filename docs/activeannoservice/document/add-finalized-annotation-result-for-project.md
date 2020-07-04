[activeannoservice](../index.md) / [document](index.md) / [addFinalizedAnnotationResultForProject](./add-finalized-annotation-result-for-project.md)

# addFinalizedAnnotationResultForProject

`suspend fun `[`Document`](-document/index.md)`.addFinalizedAnnotationResultForProject(project: `[`Project`](../project/-project/index.md)`, finalizedAnnotationResult: `[`FinalizedAnnotationResult`](../document.annotation/-finalized-annotation-result/index.md)`, checkWebHooks: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, applyPolicy: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, annotationSchema: `[`DenormalizedAnnotationSchema`](../project.annotationschema/-denormalized-annotation-schema/index.md)`? = null): `[`ProjectAnnotationData`](-project-annotation-data/index.md)

Extension function to add [FinalizedAnnotationResult](../document.annotation/-finalized-annotation-result/index.md) to a [Document](-document/index.md) and a [Project](../project/-project/index.md). Might also do
logic related to the [Project](../project/-project/index.md) after adding the result.

