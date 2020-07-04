[activeannoservice](../../index.md) / [project.layout.elements.action](../index.md) / [OpenTextInput](./index.md)

# OpenTextInput

`class OpenTextInput : `[`ActionElement`](../-action-element/index.md)

A multi line text input field

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | A multi line text input field`OpenTextInput(referenceAnnotationDefinitionID: `[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, showApplyAutoCorrectButton: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, highlightDifferencesToDocumentData: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [highlightDifferencesToDocumentData](highlight-differences-to-document-data.md) | Reference document data by key`val highlightDifferencesToDocumentData: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [showApplyAutoCorrectButton](show-apply-auto-correct-button.md) | Ability to apply auto correct in the frontend`val showApplyAutoCorrectButton: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Functions

| Name | Summary |
|---|---|
| [denormalize](denormalize.md) | `suspend fun denormalize(denormalizedAnnotationSchema: `[`DenormalizedAnnotationSchema`](../../project.annotationschema/-denormalized-annotation-schema/index.md)`): `[`DenormalizedOpenTextInput`](../-denormalized-open-text-input/index.md) |
| [equals](equals.md) | `fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
