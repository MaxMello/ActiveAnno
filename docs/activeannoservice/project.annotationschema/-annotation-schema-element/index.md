[activeannoservice](../../index.md) / [project.annotationschema](../index.md) / [AnnotationSchemaElement](./index.md)

# AnnotationSchemaElement

`data class AnnotationSchemaElement`

Single element of the schema, mapping the ID of an [AnnotationDefinition](../../annotationdefinition/-annotation-definition/index.md) to data specific to this project
and the [Target](../../annotationdefinition.target/-target/index.md) of the annotation.
different target definition for the same annotation

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Single element of the schema, mapping the ID of an [AnnotationDefinition](../../annotationdefinition/-annotation-definition/index.md) to data specific to this project and the [Target](../../annotationdefinition.target/-target/index.md) of the annotation. different target definition for the same annotation`AnnotationSchemaElement(annotationDefinitionID: `[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, target: `[`Target`](../../annotationdefinition.target/-target/index.md)`, enableCondition: `[`EnableCondition`](../-enable-condition/index.md)`? = null, annotationGeneratorID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [annotationDefinitionID](annotation-definition-i-d.md) | `val annotationDefinitionID: `[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md) |
| [annotationGeneratorID](annotation-generator-i-d.md) | `val annotationGeneratorID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [enableCondition](enable-condition.md) | Under which condition will this annotation step be executed / enabled for the project Null means unconditionally`val enableCondition: `[`EnableCondition`](../-enable-condition/index.md)`?` |
| [target](target.md) | `val target: `[`Target`](../../annotationdefinition.target/-target/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [denormalize](../denormalize.md) | `suspend fun `[`AnnotationSchemaElement`](./index.md)`.denormalize(): `[`DenormalizedAnnotationSchemaElement`](../-denormalized-annotation-schema-element/index.md) |
