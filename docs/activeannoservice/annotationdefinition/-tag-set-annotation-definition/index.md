[activeannoservice](../../index.md) / [annotationdefinition](../index.md) / [TagSetAnnotationDefinition](./index.md)

# TagSetAnnotationDefinition

`class TagSetAnnotationDefinition : `[`AnnotationDefinition`](../-annotation-definition/index.md)

Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](-tag-set-option/index.md)s

### Types

| Name | Summary |
|---|---|
| [TagSetOption](-tag-set-option/index.md) | Option for a tag set.`data class TagSetOption` |

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](-tag-set-option/index.md)s`TagSetAnnotationDefinition(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null, options: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<TagSetOption>)` |

### Properties

| Name | Summary |
|---|---|
| [maxNumberOfTags](max-number-of-tags.md) | `var maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`?` |
| [minNumberOfTags](min-number-of-tags.md) | `var minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [options](options.md) | `var options: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<TagSetOption>` |

### Functions

| Name | Summary |
|---|---|
| [transformGeneratedAnnotation](transform-generated-annotation.md) | Can transform a generated annotation into a annotation result annotation. For example, apply minimum probabilities or max. number of answers given the annotationDefinition`fun transformGeneratedAnnotation(annotation: `[`Annotation`](../../document.annotation/-annotation.md)`<*>): `[`Annotation`](../../document.annotation/-annotation.md)`<*>` |
| [updateModel](update-model.md) | Update the database model of an instance from a new instance. This should be used to control which fields are updatable through the API and which are not.`fun updateModel(newAnnotationDefinition: `[`AnnotationDefinition`](../-annotation-definition/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [validateAnnotation](validate-annotation.md) | Validate an annotation based on the defined constraints, needs to be implemented by every subclass.`fun validateAnnotation(annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`, target: `[`Target`](../../annotationdefinition.target/-target/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`?): `[`ValidationError`](../../api.annotate.dto/-validation-error/index.md)`?` |
