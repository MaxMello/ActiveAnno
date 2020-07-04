[activeannoservice](../../index.md) / [project.layout.elements.action](../index.md) / [TagSetButtonGroup](./index.md)

# TagSetButtonGroup

`class TagSetButtonGroup : `[`ActionElement`](../-action-element/index.md)

A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select.`TagSetButtonGroup(referenceAnnotationDefinitionID: `[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, buttonSize: `[`ButtonSize`](../../project.layout/-button-size/index.md)`? = null, buttonColors: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ButtonColor`](../../project.layout/-button-color/index.md)`> = mapOf())` |

### Properties

| Name | Summary |
|---|---|
| [buttonColors](button-colors.md) | Map of option ID to coloring, will use default color if missing. For BooleanButtonGroup, the keys are "true" and "false"`val buttonColors: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ButtonColor`](../../project.layout/-button-color/index.md)`>` |
| [buttonSize](button-size.md) | Optionally specify buttonSize, will use default value if missing`val buttonSize: `[`ButtonSize`](../../project.layout/-button-size/index.md)`?` |

### Functions

| Name | Summary |
|---|---|
| [denormalize](denormalize.md) | `suspend fun denormalize(denormalizedAnnotationSchema: `[`DenormalizedAnnotationSchema`](../../project.annotationschema/-denormalized-annotation-schema/index.md)`): `[`DenormalizedTagSetButtonGroup`](../-denormalized-tag-set-button-group/index.md) |
| [equals](equals.md) | `fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
