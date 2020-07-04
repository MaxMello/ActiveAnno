[activeannoservice](../../index.md) / [annotationdefinition](../index.md) / [OpenTextAnnotationDefinition](./index.md)

# OpenTextAnnotationDefinition

`class OpenTextAnnotationDefinition : `[`AnnotationDefinition`](../-annotation-definition/index.md)

Annotation for some open text input

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Annotation for some open text input`OpenTextAnnotationDefinition(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), minLength: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, maxLength: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null, documentDataDefault: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, optional: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false)` |

### Properties

| Name | Summary |
|---|---|
| [documentDataDefault](document-data-default.md) | copy documentData value by key`val documentDataDefault: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [maxLength](max-length.md) | `var maxLength: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`?` |
| [minLength](min-length.md) | `var minLength: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [optional](optional.md) | `var optional: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Functions

| Name | Summary |
|---|---|
| [updateModel](update-model.md) | Update the database model of an instance from a new instance. This should be used to control which fields are updatable through the API and which are not.`fun updateModel(newAnnotationDefinition: `[`AnnotationDefinition`](../-annotation-definition/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [validateAnnotation](validate-annotation.md) | Validate an annotation based on the defined constraints, needs to be implemented by every subclass.`fun validateAnnotation(annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`, target: `[`Target`](../../annotationdefinition.target/-target/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`?): `[`ValidationError`](../../api.annotate.dto/-validation-error/index.md)`?` |
