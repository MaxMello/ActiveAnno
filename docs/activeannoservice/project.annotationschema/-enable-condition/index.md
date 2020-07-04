[activeannoservice](../../index.md) / [project.annotationschema](../index.md) / [EnableCondition](./index.md)

# EnableCondition

`abstract class EnableCondition`

[AnnotationSchemaElement](../-annotation-schema-element/index.md)s can be conditional, defined by an [EnableCondition](./index.md).
If an [EnableCondition](./index.md) is null, that means it is always required. Else, the enable conditions [execute](execute.md) method needs to return true
for the element to be prompted.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | [AnnotationSchemaElement](../-annotation-schema-element/index.md)s can be conditional, defined by an [EnableCondition](./index.md). If an [EnableCondition](./index.md) is null, that means it is always required. Else, the enable conditions [execute](execute.md) method needs to return true for the element to be prompted.`EnableCondition()` |

### Functions

| Name | Summary |
|---|---|
| [execute](execute.md) | `abstract fun execute(document: `[`Document`](../../document/-document/index.md)`, annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Inheritors

| Name | Summary |
|---|---|
| [And](../-and/index.md) | `data class And : `[`EnableCondition`](./index.md) |
| [AtomicEnableCondition](../-atomic-enable-condition/index.md) | [AtomicEnableCondition](../-atomic-enable-condition/index.md)s are defined in relation to a single [referenceKey](../-atomic-enable-condition/reference-key.md) and do not include more complex conditions such as [And](../-and/index.md) or [Or](../-or/index.md).`abstract class AtomicEnableCondition : `[`EnableCondition`](./index.md) |
| [Not](../-not/index.md) | `data class Not : `[`EnableCondition`](./index.md) |
| [Or](../-or/index.md) | `data class Or : `[`EnableCondition`](./index.md) |
