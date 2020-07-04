[activeannoservice](../../index.md) / [project.annotationschema](../index.md) / [DenormalizedAnnotationSchemaElement](./index.md)

# DenormalizedAnnotationSchemaElement

`data class DenormalizedAnnotationSchemaElement`

Equivalent to [AnnotationSchemaElement](../-annotation-schema-element/index.md) but denormalized, meaning all ID references are replaced
by the actual objects

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Equivalent to [AnnotationSchemaElement](../-annotation-schema-element/index.md) but denormalized, meaning all ID references are replaced by the actual objects`DenormalizedAnnotationSchemaElement(annotationDefinition: `[`AnnotationDefinition`](../../annotationdefinition/-annotation-definition/index.md)`, target: `[`Target`](../../annotationdefinition.target/-target/index.md)`, enableCondition: `[`EnableCondition`](../-enable-condition/index.md)`? = null, annotationGenerator: `[`AnnotationGenerator`](../../annotationdefinition.generator/-annotation-generator/index.md)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [annotationDefinition](annotation-definition.md) | `val annotationDefinition: `[`AnnotationDefinition`](../../annotationdefinition/-annotation-definition/index.md) |
| [annotationGenerator](annotation-generator.md) | `val annotationGenerator: `[`AnnotationGenerator`](../../annotationdefinition.generator/-annotation-generator/index.md)`?` |
| [enableCondition](enable-condition.md) | Under which condition will this annotation step be executed / enabled for the project Null means unconditionally`val enableCondition: `[`EnableCondition`](../-enable-condition/index.md)`?` |
| [target](target.md) | `val target: `[`Target`](../../annotationdefinition.target/-target/index.md) |
