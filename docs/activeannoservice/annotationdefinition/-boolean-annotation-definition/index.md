[activeannoservice](../../index.md) / [annotationdefinition](../index.md) / [BooleanAnnotationDefinition](./index.md)

# BooleanAnnotationDefinition

`class BooleanAnnotationDefinition : `[`AnnotationDefinition`](../-annotation-definition/index.md)

Annotation for a boolean input.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Annotation for a boolean input.`BooleanAnnotationDefinition(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), optional: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false)` |

### Properties

| Name | Summary |
|---|---|
| [optional](optional.md) | `var optional: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Functions

| Name | Summary |
|---|---|
| [updateModel](update-model.md) | Update the database model of an instance from a new instance. This should be used to control which fields are updatable through the API and which are not.`fun updateModel(newAnnotationDefinition: `[`AnnotationDefinition`](../-annotation-definition/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [validateAnnotation](validate-annotation.md) | Validate an annotation based on the defined constraints, needs to be implemented by every subclass.`fun validateAnnotation(annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`, target: `[`Target`](../../annotationdefinition.target/-target/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`?): `[`ValidationError`](../../api.annotate.dto/-validation-error/index.md)`?` |
