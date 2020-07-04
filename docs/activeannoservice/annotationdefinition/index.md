[activeannoservice](../index.md) / [annotationdefinition](./index.md)

## Package annotationdefinition

### Types

| Name | Summary |
|---|---|
| [AnnotationDefinition](-annotation-definition/index.md) | Base class for all [AnnotationDefinition](-annotation-definition/index.md)s. An [AnnotationDefinition](-annotation-definition/index.md) defines how an annotation is required to be created, e.g. on which target it is defined, is it optional, maximum length etc.`abstract class AnnotationDefinition` |
| [AnnotationDefinitionDAO](-annotation-definition-d-a-o/index.md) | `class AnnotationDefinitionDAO` |
| [AnnotationDefinitionList](-annotation-definition-list/index.md) | Wrapper class to prevent type erasure of [AnnotationDefinition](-annotation-definition/index.md). This way, the JsonSubType info is preserved.`class AnnotationDefinitionList : `[`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)`<`[`AnnotationDefinition`](-annotation-definition/index.md)`>` |
| [AnnotationID](-annotation-i-d.md) | `typealias AnnotationID = `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [BooleanAnnotationDefinition](-boolean-annotation-definition/index.md) | Annotation for a boolean input.`class BooleanAnnotationDefinition : `[`AnnotationDefinition`](-annotation-definition/index.md) |
| [CaseBehavior](-case-behavior/index.md) | How to handle differences in cases between tags?`enum class CaseBehavior` |
| [ClosedNumberAnnotationDefinition](-closed-number-annotation-definition/index.md) | Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider.`class ClosedNumberAnnotationDefinition : `[`AnnotationDefinition`](-annotation-definition/index.md) |
| [HierarchicalTagSetAnnotationDefinition](-hierarchical-tag-set-annotation-definition/index.md) | Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](#)s`class HierarchicalTagSetAnnotationDefinition : `[`AnnotationDefinition`](-annotation-definition/index.md) |
| [NumberRangeAnnotationDefinition](-number-range-annotation-definition/index.md) | A number range between [min](-number-range-annotation-definition/min.md) and [max](-number-range-annotation-definition/max.md) with [step](-number-range-annotation-definition/step.md) steps between. Results in two values, a lower and upper value.`class NumberRangeAnnotationDefinition : `[`AnnotationDefinition`](-annotation-definition/index.md) |
| [OpenNumberAnnotationDefinition](-open-number-annotation-definition/index.md) | Annotation for an unrestricted number. Cannot be displayed as a slider, only number input.`class OpenNumberAnnotationDefinition : `[`AnnotationDefinition`](-annotation-definition/index.md) |
| [OpenTagAnnotationDefinition](-open-tag-annotation-definition/index.md) | Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string`class OpenTagAnnotationDefinition : `[`AnnotationDefinition`](-annotation-definition/index.md) |
| [OpenTextAnnotationDefinition](-open-text-annotation-definition/index.md) | Annotation for some open text input`class OpenTextAnnotationDefinition : `[`AnnotationDefinition`](-annotation-definition/index.md) |
| [TagSetAnnotationDefinition](-tag-set-annotation-definition/index.md) | Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](-tag-set-annotation-definition/-tag-set-option/index.md)s`class TagSetAnnotationDefinition : `[`AnnotationDefinition`](-annotation-definition/index.md) |

### Functions

| Name | Summary |
|---|---|
| [getAllOptions](get-all-options.md) | `fun `[`HierarchicalTagSetAnnotationDefinition`](-hierarchical-tag-set-annotation-definition/index.md)`.getAllOptions(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<HierarchicalTagSetOption>` |
| [getOptionsDeepestLevel](get-options-deepest-level.md) | `fun `[`HierarchicalTagSetAnnotationDefinition`](-hierarchical-tag-set-annotation-definition/index.md)`.getOptionsDeepestLevel(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<HierarchicalTagSetOption>` |
