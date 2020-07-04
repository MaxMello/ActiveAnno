[activeannoservice](../../index.md) / [project.annotationschema](../index.md) / [AnnotationSchema](./index.md)

# AnnotationSchema

`data class AnnotationSchema`

Annotation schema as defined in the database (with ID references to [AnnotationDefinition](../../annotationdefinition/-annotation-definition/index.md)s
and [AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md)s.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Annotation schema as defined in the database (with ID references to [AnnotationDefinition](../../annotationdefinition/-annotation-definition/index.md)s and [AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md)s.`AnnotationSchema(elements: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationSchemaElement`](../-annotation-schema-element/index.md)`>, generatedAnnotationResultHandling: `[`GeneratedAnnotationResultHandling`](../../project.annotationschema.generator/-generated-annotation-result-handling/index.md)` = GeneratedAnnotationResultHandling())` |

### Properties

| Name | Summary |
|---|---|
| [elements](elements.md) | `val elements: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationSchemaElement`](../-annotation-schema-element/index.md)`>` |
| [generatedAnnotationResultHandling](generated-annotation-result-handling.md) | `val generatedAnnotationResultHandling: `[`GeneratedAnnotationResultHandling`](../../project.annotationschema.generator/-generated-annotation-result-handling/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [denormalize](../denormalize.md) | `suspend fun `[`AnnotationSchema`](./index.md)`.denormalize(): `[`DenormalizedAnnotationSchema`](../-denormalized-annotation-schema/index.md) |
