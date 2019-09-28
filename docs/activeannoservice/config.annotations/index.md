[activeannoservice](../index.md) / [config.annotations](./index.md)

## Package config.annotations

### Types

| Name | Summary |
|---|---|
| [Annotations](-annotations/index.md) | `data class Annotations` |
| [BaseAnnotation](-base-annotation/index.md) | `abstract class BaseAnnotation`<br>Base class for all annotations. |
| [BooleanAnnotation](-boolean-annotation/index.md) | `class BooleanAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Annotation for a boolean input. |
| [CaseBehavior](-case-behavior/index.md) | `enum class CaseBehavior`<br>How to handle differences in cases between tags? |
| [ClosedNumberAnnotation](-closed-number-annotation/index.md) | `class ClosedNumberAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider. |
| [DocumentTarget](-document-target/index.md) | `class DocumentTarget : `[`Target`](-target.md)<br>Use this for annotations that should be created for the whole document. |
| [HierarchicalTagSetAnnotation](-hierarchical-tag-set-annotation/index.md) | `class HierarchicalTagSetAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>A set of predefined options nested in a hierarchical fashion, for example     name = Location     options = Germany(children = Berlin, Hamburg, Lower Saxony(children = Hannover, Oldenburg, Wolfsburg))) |
| [HierarchicalTagSetOption](-hierarchical-tag-set-option/index.md) | `data class HierarchicalTagSetOption` |
| [NumberRangeAnnotation](-number-range-annotation/index.md) | `class NumberRangeAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>A number range between [min](-number-range-annotation/min.md) and [max](-number-range-annotation/max.md) with [step](-number-range-annotation/step.md) steps between. Results in two values, a lower and upper value. |
| [OpenNumberAnnotation](-open-number-annotation/index.md) | `class OpenNumberAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Annotation for an unrestricted number. Cannot be displayed as a slider, only number input. |
| [OpenTagAnnotation](-open-tag-annotation/index.md) | `class OpenTagAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string |
| [OpenTextAnnotation](-open-text-annotation/index.md) | `class OpenTextAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Annotation for some open text input |
| [PredefinedTagSetAnnotation](-predefined-tag-set-annotation/index.md) | `class PredefinedTagSetAnnotation : `[`BaseAnnotation`](-base-annotation/index.md) |
| [SpanGranularity](-span-granularity/index.md) | `enum class SpanGranularity`<br>What is the allowed cutoff point for a span, a single character or only whole tokens? |
| [SpanTarget](-span-target/index.md) | `data class SpanTarget : `[`Target`](-target.md)<br>Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set. |
| [TagSetOption](-tag-set-option/index.md) | `data class TagSetOption`<br>Option for a tag set. |
| [Target](-target.md) | `interface Target`<br>The target of an annotation can be the whole document or a specific offset of characters, a span. |

### Type Aliases

| Name | Summary |
|---|---|
| [AnnotationID](-annotation-i-d.md) | `typealias AnnotationID = `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
