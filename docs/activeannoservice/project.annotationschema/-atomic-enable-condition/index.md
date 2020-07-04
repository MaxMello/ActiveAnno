[activeannoservice](../../index.md) / [project.annotationschema](../index.md) / [AtomicEnableCondition](./index.md)

# AtomicEnableCondition

`abstract class AtomicEnableCondition : `[`EnableCondition`](../-enable-condition/index.md)

[AtomicEnableCondition](./index.md)s are defined in relation to a single [referenceKey](reference-key.md) and do not include more complex conditions
such as [And](../-and/index.md) or [Or](../-or/index.md).

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | [AtomicEnableCondition](./index.md)s are defined in relation to a single [referenceKey](reference-key.md) and do not include more complex conditions such as [And](../-and/index.md) or [Or](../-or/index.md).`AtomicEnableCondition(referenceKey: `[`AnnotationStepKey`](../-annotation-step-key/index.md)`)` |

### Properties

| Name | Summary |
|---|---|
| [referenceKey](reference-key.md) | `val referenceKey: `[`AnnotationStepKey`](../-annotation-step-key/index.md) |

### Functions

| Name | Summary |
|---|---|
| [applyCondition](apply-condition.md) | `abstract fun applyCondition(values: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [equals](equals.md) | `open fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [execute](execute.md) | `open fun execute(document: `[`Document`](../../document/-document/index.md)`, annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `open fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |

### Inheritors

| Name | Summary |
|---|---|
| [ValuesEqual](../-values-equal/index.md) | `class ValuesEqual : `[`AtomicEnableCondition`](./index.md) |
| [ValuesExist](../-values-exist/index.md) | `class ValuesExist : `[`AtomicEnableCondition`](./index.md) |
| [ValuesIntersect](../-values-intersect/index.md) | `class ValuesIntersect : `[`AtomicEnableCondition`](./index.md) |
