[activeannoservice](../../index.md) / [document.annotation](../index.md) / [DocumentTargetAnnotation](./index.md)

# DocumentTargetAnnotation

`data class DocumentTargetAnnotation : `[`Annotation`](../-annotation.md)`<`[`DocumentTarget`](../../annotationdefinition.target/-document-target/index.md)`>`

An annotation which is targeted on the whole document, not a specific part of it. For example, a class label "SPAM"
or "NO SPAM" for the whole document.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | An annotation which is targeted on the whole document, not a specific part of it. For example, a class label "SPAM" or "NO SPAM" for the whole document.`DocumentTargetAnnotation(values: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ValueToProbability`](../-value-to-probability/index.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [singleValue](single-value.md) | For annotations that only store a single value, never a list, this property is a shortcut to accessing it`val singleValue: `[`ValueToProbability`](../-value-to-probability/index.md)`?` |
| [values](values.md) | We always store a set of values, even though some annotations will be 1 length lists (like a single boolean value). This is to streamline to API and data handling in all steps.`val values: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ValueToProbability`](../-value-to-probability/index.md)`>` |

### Functions

| Name | Summary |
|---|---|
| [equals](equals.md) | We overwrite equals (and hashCode) because while the order of values should be preserved, for comparison it should not matter`fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
