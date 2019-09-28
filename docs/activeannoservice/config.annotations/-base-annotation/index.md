[activeannoservice](../../index.md) / [config.annotations](../index.md) / [BaseAnnotation](./index.md)

# BaseAnnotation

`abstract class BaseAnnotation`

Base class for all annotations.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `BaseAnnotation(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, targets: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Target`](../-target.md)`>)`<br>Base class for all annotations. |

### Properties

| Name | Summary |
|---|---|
| [id](id.md) | `val id: `[`AnnotationID`](../-annotation-i-d.md)<br>Every annotation needs a unique ID (inside the project scope). It is advisable to re-use the same ids for the same annotations across projects to have easier integration when merging the data outside the service. For example, a sentiment score annotation might always have the id "SENTIMENT_SCORE" across all projects. |
| [name](name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)<br>The primary, human readable name of the annotation. Should be clear, but not too long. Additional explanations might be given via Layout elements, but in the best case, that would not be necessary. For example "Sentiment score" for sentiment, or "Contains personal data" for a boolean annotation. |
| [shortName](short-name.md) | `val shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?`<br>Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e. for inline span labels |
| [targets](targets.md) | `val targets: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Target`](../-target.md)`>`<br>The targets for the annotation, can be span, document or both. Should not be empty. |

### Functions

| Name | Summary |
|---|---|
| [equals](equals.md) | `open fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `open fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [toString](to-string.md) | `open fun toString(): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Inheritors

| Name | Summary |
|---|---|
| [BooleanAnnotation](../-boolean-annotation/index.md) | `class BooleanAnnotation : `[`BaseAnnotation`](./index.md)<br>Annotation for a boolean input. |
| [ClosedNumberAnnotation](../-closed-number-annotation/index.md) | `class ClosedNumberAnnotation : `[`BaseAnnotation`](./index.md)<br>Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider. |
| [HierarchicalTagSetAnnotation](../-hierarchical-tag-set-annotation/index.md) | `class HierarchicalTagSetAnnotation : `[`BaseAnnotation`](./index.md)<br>A set of predefined options nested in a hierarchical fashion, for example     name = Location     options = Germany(children = Berlin, Hamburg, Lower Saxony(children = Hannover, Oldenburg, Wolfsburg))) |
| [NumberRangeAnnotation](../-number-range-annotation/index.md) | `class NumberRangeAnnotation : `[`BaseAnnotation`](./index.md)<br>A number range between [min](../-number-range-annotation/min.md) and [max](../-number-range-annotation/max.md) with [step](../-number-range-annotation/step.md) steps between. Results in two values, a lower and upper value. |
| [OpenNumberAnnotation](../-open-number-annotation/index.md) | `class OpenNumberAnnotation : `[`BaseAnnotation`](./index.md)<br>Annotation for an unrestricted number. Cannot be displayed as a slider, only number input. |
| [OpenTagAnnotation](../-open-tag-annotation/index.md) | `class OpenTagAnnotation : `[`BaseAnnotation`](./index.md)<br>Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string |
| [OpenTextAnnotation](../-open-text-annotation/index.md) | `class OpenTextAnnotation : `[`BaseAnnotation`](./index.md)<br>Annotation for some open text input |
| [PredefinedTagSetAnnotation](../-predefined-tag-set-annotation/index.md) | `class PredefinedTagSetAnnotation : `[`BaseAnnotation`](./index.md) |
