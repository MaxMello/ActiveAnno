[activeannoservice](../../index.md) / [document.annotation](../index.md) / [GeneratedAnnotationData](./index.md)

# GeneratedAnnotationData

`data class GeneratedAnnotationData`

When a Project has any AnnotationGenerator defined through the AnnotationSchema, they will store their results here.
Every time annotation generation is triggered, every generator will be executed again and a new instance of this class
will be added to the ProjectAnnotationData

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | When a Project has any AnnotationGenerator defined through the AnnotationSchema, they will store their results here. Every time annotation generation is triggered, every generator will be executed again and a new instance of this class will be added to the ProjectAnnotationData`GeneratedAnnotationData(timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, annotations: `[`AnnotationMap`](../-annotation-map.md)`, id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = UUID.randomUUID().toString())` |

### Properties

| Name | Summary |
|---|---|
| [annotations](annotations.md) | GeneratedAnnotations can either be targeted on a document or span level. In hybrid scenarios, where both are supported, span will always overwrite document, as it is more specific.`val annotations: `[`AnnotationMap`](../-annotation-map.md) |
| [id](id.md) | `val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [timestamp](timestamp.md) | `val timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |

### Extension Functions

| Name | Summary |
|---|---|
| [buildAnnotationResult](../build-annotation-result.md) | Build an [AnnotationResult](../-annotation-result/index.md) from an [GeneratedAnnotationData](./index.md), transforming the annotations based on the AnnotationDefinitions transformGeneratedAnnotation method`fun `[`GeneratedAnnotationData`](./index.md)`.buildAnnotationResult(document: `[`Document`](../../document/-document/index.md)`, projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, annotationSchema: `[`DenormalizedAnnotationSchema`](../../project.annotationschema/-denormalized-annotation-schema/index.md)`): `[`AnnotationResult`](../-annotation-result/index.md) |
