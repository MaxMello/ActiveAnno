[activeannoservice](../../index.md) / [config](../index.md) / [OpenTagAnnotation](./index.md)

# OpenTagAnnotation

`class OpenTagAnnotation : `[`BaseAnnotation`](../-base-annotation/index.md)

Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `OpenTagAnnotation(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, targets: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Target`](../-target.md)`>, minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, trimWhitespace: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, caseBehavior: `[`CaseBehavior`](../-case-behavior/index.md)` = CaseBehavior.KEEP_ORIGINAL, useExistingValuesAsPredefinedTags: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, predefinedTags: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>)`<br>Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string |

### Properties

| Name | Summary |
|---|---|
| [caseBehavior](case-behavior.md) | `val caseBehavior: `[`CaseBehavior`](../-case-behavior/index.md) |
| [maxNumberOfTags](max-number-of-tags.md) | `val maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [minNumberOfTags](min-number-of-tags.md) | `val minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [predefinedTags](predefined-tags.md) | `val predefinedTags: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>` |
| [trimWhitespace](trim-whitespace.md) | `val trimWhitespace: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [useExistingValuesAsPredefinedTags](use-existing-values-as-predefined-tags.md) | `val useExistingValuesAsPredefinedTags: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Inherited Properties

| Name | Summary |
|---|---|
| [id](../-base-annotation/id.md) | `val id: `[`AnnotationID`](../-annotation-i-d.md)<br>Every annotation needs a unique ID (inside the project scope). It is advisable to re-use the same ids for the same annotations across projects to have easier integration when merging the data outside the service. For example, a sentiment score annotation might always have the id "SENTIMENT_SCORE" across all projects. |
| [name](../-base-annotation/name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)<br>The primary, human readable name of the annotation. Should be clear, but not too long. Additional explanations might be given via Layout elements, but in the best case, that would not be necessary. For example "Sentiment score" for sentiment, or "Contains personal data" for a boolean annotation. |
| [shortName](../-base-annotation/short-name.md) | `val shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?`<br>Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e. for inline span labels |
| [targets](../-base-annotation/targets.md) | `val targets: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Target`](../-target.md)`>`<br>The targets for the annotation, can be span, document or both. Should not be empty. |

### Functions

| Name | Summary |
|---|---|
| [equals](equals.md) | `fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [toString](to-string.md) | `fun toString(): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
