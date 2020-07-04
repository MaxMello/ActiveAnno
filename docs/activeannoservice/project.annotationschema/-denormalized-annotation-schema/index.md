[activeannoservice](../../index.md) / [project.annotationschema](../index.md) / [DenormalizedAnnotationSchema](./index.md)

# DenormalizedAnnotationSchema

`data class DenormalizedAnnotationSchema`

Annotation schema as sent to the frontend / client, contains the actual models of [AnnotationDefinition](../../annotationdefinition/-annotation-definition/index.md),
[AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md) etc.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Annotation schema as sent to the frontend / client, contains the actual models of [AnnotationDefinition](../../annotationdefinition/-annotation-definition/index.md), [AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md) etc.`DenormalizedAnnotationSchema(elements: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`DenormalizedAnnotationSchemaElement`](../-denormalized-annotation-schema-element/index.md)`>, generatedAnnotationResultHandling: `[`GeneratedAnnotationResultHandling`](../../project.annotationschema.generator/-generated-annotation-result-handling/index.md)`)` |

### Properties

| Name | Summary |
|---|---|
| [elements](elements.md) | `val elements: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`DenormalizedAnnotationSchemaElement`](../-denormalized-annotation-schema-element/index.md)`>` |
| [generatedAnnotationResultHandling](generated-annotation-result-handling.md) | `val generatedAnnotationResultHandling: `[`GeneratedAnnotationResultHandling`](../../project.annotationschema.generator/-generated-annotation-result-handling/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [generateAnnotationData](../../project.annotationschema.generator/generate-annotation-data.md) | For an AnnotationSchema, execute all [AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md) and return the [GeneratedAnnotationData](../../document.annotation/-generated-annotation-data/index.md)`suspend fun `[`DenormalizedAnnotationSchema`](./index.md)`.generateAnnotationData(document: `[`Document`](../../document/-document/index.md)`): `[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md) |
| [generateAnnotationDataBulk](../../project.annotationschema.generator/generate-annotation-data-bulk.md) | `suspend fun `[`DenormalizedAnnotationSchema`](./index.md)`.generateAnnotationDataBulk(documents: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Document`](../../document/-document/index.md)`>): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../../document/-document/index.md)`, `[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`>` |
