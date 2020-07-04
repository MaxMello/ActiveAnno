[activeannoservice](../../index.md) / [annotationdefinition](../index.md) / [AnnotationDefinition](./index.md)

# AnnotationDefinition

`abstract class AnnotationDefinition`

Base class for all [AnnotationDefinition](./index.md)s. An [AnnotationDefinition](./index.md) defines how an annotation is required to be
created, e.g. on which target it is defined, is it optional, maximum length etc.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Base class for all [AnnotationDefinition](./index.md)s. An [AnnotationDefinition](./index.md) defines how an annotation is required to be created, e.g. on which target it is defined, is it optional, maximum length etc.`AnnotationDefinition(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`)` |

### Properties

| Name | Summary |
|---|---|
| [createdTimestamp](created-timestamp.md) | `val createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [id](id.md) | Explicit ID identifying an annotation definition.`val id: `[`AnnotationID`](../-annotation-i-d.md) |
| [name](name.md) | The primary, human readable name of the annotation. Should be clear, but not too long. Additional explanations might be given via Layout elements, but in the best case, that would not be necessary. For example "Sentiment score" for sentiment, or "Contains personal data" for a boolean annotation.`var name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [shortName](short-name.md) | Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e. for inline span labels`var shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |

### Functions

| Name | Summary |
|---|---|
| [equals](equals.md) | `open fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `open fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [toString](to-string.md) | `open fun toString(): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [transformGeneratedAnnotation](transform-generated-annotation.md) | Can transform a generated annotation into a annotation result annotation. For example, apply minimum probabilities or max. number of answers given the annotationDefinition`open fun transformGeneratedAnnotation(annotation: `[`Annotation`](../../document.annotation/-annotation.md)`<*>): `[`Annotation`](../../document.annotation/-annotation.md)`<*>` |
| [updateModel](update-model.md) | Update the database model of an instance from a new instance. This should be used to control which fields are updatable through the API and which are not.`open fun updateModel(newAnnotationDefinition: `[`AnnotationDefinition`](./index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [validateAnnotation](validate-annotation.md) | Validate an annotation based on the defined constraints, needs to be implemented by every subclass.`abstract fun validateAnnotation(annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`, target: `[`Target`](../../annotationdefinition.target/-target/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`? = null): `[`ValidationError`](../../api.annotate.dto/-validation-error/index.md)`?` |

### Inheritors

| Name | Summary |
|---|---|
| [BooleanAnnotationDefinition](../-boolean-annotation-definition/index.md) | Annotation for a boolean input.`class BooleanAnnotationDefinition : `[`AnnotationDefinition`](./index.md) |
| [ClosedNumberAnnotationDefinition](../-closed-number-annotation-definition/index.md) | Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider.`class ClosedNumberAnnotationDefinition : `[`AnnotationDefinition`](./index.md) |
| [HierarchicalTagSetAnnotationDefinition](../-hierarchical-tag-set-annotation-definition/index.md) | Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](#)s`class HierarchicalTagSetAnnotationDefinition : `[`AnnotationDefinition`](./index.md) |
| [NumberRangeAnnotationDefinition](../-number-range-annotation-definition/index.md) | A number range between [min](../-number-range-annotation-definition/min.md) and [max](../-number-range-annotation-definition/max.md) with [step](../-number-range-annotation-definition/step.md) steps between. Results in two values, a lower and upper value.`class NumberRangeAnnotationDefinition : `[`AnnotationDefinition`](./index.md) |
| [OpenNumberAnnotationDefinition](../-open-number-annotation-definition/index.md) | Annotation for an unrestricted number. Cannot be displayed as a slider, only number input.`class OpenNumberAnnotationDefinition : `[`AnnotationDefinition`](./index.md) |
| [OpenTagAnnotationDefinition](../-open-tag-annotation-definition/index.md) | Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string`class OpenTagAnnotationDefinition : `[`AnnotationDefinition`](./index.md) |
| [OpenTextAnnotationDefinition](../-open-text-annotation-definition/index.md) | Annotation for some open text input`class OpenTextAnnotationDefinition : `[`AnnotationDefinition`](./index.md) |
| [TagSetAnnotationDefinition](../-tag-set-annotation-definition/index.md) | Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](../-tag-set-annotation-definition/-tag-set-option/index.md)s`class TagSetAnnotationDefinition : `[`AnnotationDefinition`](./index.md) |
