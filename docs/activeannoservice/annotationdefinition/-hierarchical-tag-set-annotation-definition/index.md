[activeannoservice](../../index.md) / [annotationdefinition](../index.md) / [HierarchicalTagSetAnnotationDefinition](./index.md)

# HierarchicalTagSetAnnotationDefinition

`class HierarchicalTagSetAnnotationDefinition : `[`AnnotationDefinition`](../-annotation-definition/index.md)

Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](#)s

### Types

| Name | Summary |
|---|---|
| [HierarchicalTagSetOption](-hierarchical-tag-set-option/index.md) | Option for a hierarchical tag set.`data class HierarchicalTagSetOption` |

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](#)s`HierarchicalTagSetAnnotationDefinition(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null, requireDeepestLevel: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, options: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<HierarchicalTagSetOption>)` |

### Properties

| Name | Summary |
|---|---|
| [maxNumberOfTags](max-number-of-tags.md) | `var maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`?` |
| [minNumberOfTags](min-number-of-tags.md) | `var minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [options](options.md) | `val options: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<HierarchicalTagSetOption>` |
| [requireDeepestLevel](require-deepest-level.md) | Prevents chosing higher level options when those options have any children`val requireDeepestLevel: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Functions

| Name | Summary |
|---|---|
| [updateModel](update-model.md) | Update the database model of an instance from a new instance. This should be used to control which fields are updatable through the API and which are not.`fun updateModel(newAnnotationDefinition: `[`AnnotationDefinition`](../-annotation-definition/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [validateAnnotation](validate-annotation.md) | Validate an annotation based on the defined constraints, needs to be implemented by every subclass.`fun validateAnnotation(annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`, target: `[`Target`](../../annotationdefinition.target/-target/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`?): `[`ValidationError`](../../api.annotate.dto/-validation-error/index.md)`?` |

### Extension Functions

| Name | Summary |
|---|---|
| [getAllOptions](../get-all-options.md) | `fun `[`HierarchicalTagSetAnnotationDefinition`](./index.md)`.getAllOptions(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<HierarchicalTagSetOption>` |
| [getOptionsDeepestLevel](../get-options-deepest-level.md) | `fun `[`HierarchicalTagSetAnnotationDefinition`](./index.md)`.getOptionsDeepestLevel(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<HierarchicalTagSetOption>` |
