[activeannoservice](../../index.md) / [config.annotations](../index.md) / [BooleanAnnotation](./index.md)

# BooleanAnnotation

`class BooleanAnnotation : `[`BaseAnnotation`](../-base-annotation/index.md)

Annotation for a boolean input.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `BooleanAnnotation(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, targets: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Target`](../-target.md)`>, optional: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false)`<br>Annotation for a boolean input. |

### Properties

| Name | Summary |
|---|---|
| [optional](optional.md) | `val optional: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

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
