[activeannoservice](../../index.md) / [annotationdefinition](../index.md) / [OpenTagAnnotationDefinition](./index.md)

# OpenTagAnnotationDefinition

`class OpenTagAnnotationDefinition : `[`AnnotationDefinition`](../-annotation-definition/index.md)

Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string`OpenTagAnnotationDefinition(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null, trimWhitespace: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, caseBehavior: `[`CaseBehavior`](../-case-behavior/index.md)` = CaseBehavior.KEEP_ORIGINAL, useExistingValuesAsPredefinedTags: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, predefinedTags: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>)` |

### Properties

| Name | Summary |
|---|---|
| [caseBehavior](case-behavior.md) | `val caseBehavior: `[`CaseBehavior`](../-case-behavior/index.md) |
| [maxNumberOfTags](max-number-of-tags.md) | `var maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`?` |
| [minNumberOfTags](min-number-of-tags.md) | `var minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [predefinedTags](predefined-tags.md) | `var predefinedTags: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>` |
| [trimWhitespace](trim-whitespace.md) | `val trimWhitespace: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [useExistingValuesAsPredefinedTags](use-existing-values-as-predefined-tags.md) | `var useExistingValuesAsPredefinedTags: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Functions

| Name | Summary |
|---|---|
| [updateModel](update-model.md) | Update the database model of an instance from a new instance. This should be used to control which fields are updatable through the API and which are not.`fun updateModel(newAnnotationDefinition: `[`AnnotationDefinition`](../-annotation-definition/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [validateAnnotation](validate-annotation.md) | Validate an annotation based on the defined constraints, needs to be implemented by every subclass.`fun validateAnnotation(annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`, target: `[`Target`](../../annotationdefinition.target/-target/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`?): `[`ValidationError`](../../api.annotate.dto/-validation-error/index.md)`?` |
