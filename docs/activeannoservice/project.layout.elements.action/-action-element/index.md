[activeannoservice](../../index.md) / [project.layout.elements.action](../index.md) / [ActionElement](./index.md)

# ActionElement

`abstract class ActionElement : `[`LayoutElement`](../../project.layout/-layout-element.md)

Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value`ActionElement(referenceAnnotationDefinitionID: `[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`)` |

### Properties

| Name | Summary |
|---|---|
| [referenceAnnotationDefinitionID](reference-annotation-definition-i-d.md) | `val referenceAnnotationDefinitionID: `[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md) |

### Functions

| Name | Summary |
|---|---|
| [denormalize](denormalize.md) | `abstract suspend fun denormalize(denormalizedAnnotationSchema: `[`DenormalizedAnnotationSchema`](../../project.annotationschema/-denormalized-annotation-schema/index.md)`): `[`DenormalizedActionElement`](../-denormalized-action-element/index.md) |
| [equals](equals.md) | `open fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `open fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [toString](to-string.md) | `open fun toString(): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Inheritors

| Name | Summary |
|---|---|
| [BooleanButtonGroup](../-boolean-button-group/index.md) | `class BooleanButtonGroup : `[`ActionElement`](./index.md) |
| [ClosedNumberSlider](../-closed-number-slider/index.md) | `class ClosedNumberSlider : `[`ActionElement`](./index.md) |
| [NumberRangeSlider](../-number-range-slider/index.md) | `class NumberRangeSlider : `[`ActionElement`](./index.md) |
| [OpenNumberInput](../-open-number-input/index.md) | HTML Number input`class OpenNumberInput : `[`ActionElement`](./index.md) |
| [OpenTagChipInput](../-open-tag-chip-input/index.md) | Chips element is a variable list of text inputs (tags) which can be extended, including an auto-complete feature with predefined answers.`class OpenTagChipInput : `[`ActionElement`](./index.md) |
| [OpenTextInput](../-open-text-input/index.md) | A multi line text input field`class OpenTextInput : `[`ActionElement`](./index.md) |
| [TagSetButtonGroup](../-tag-set-button-group/index.md) | A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select.`class TagSetButtonGroup : `[`ActionElement`](./index.md) |
| [TagSetDropdown](../-tag-set-dropdown/index.md) | `class TagSetDropdown : `[`ActionElement`](./index.md) |
