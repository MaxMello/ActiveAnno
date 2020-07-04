[activeannoservice](../../index.md) / [project.annotationschema](../index.md) / [AnnotationStepKey](./index.md)

# AnnotationStepKey

`sealed class AnnotationStepKey`

Base class for subclasses that define how some data from a [Document](../../document/-document/index.md) or [GeneratedAnnotationData](../../document.annotation/-generated-annotation-data/index.md) is extracted
and used for EnableCondition or annotation generation.

### Functions

| Name | Summary |
|---|---|
| [getValue](get-value.md) | `abstract fun getValue(document: `[`Document`](../../document/-document/index.md)`, annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`): `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?` |

### Inheritors

| Name | Summary |
|---|---|
| [AnnotationsKey](../-annotations-key/index.md) | Get some data from some annotations`data class AnnotationsKey : `[`AnnotationStepKey`](./index.md) |
| [OriginalDocumentKey](../-original-document-key/index.md) | Get some data from the originalDocument of a [Document](../../document/-document/index.md)`data class OriginalDocumentKey : `[`AnnotationStepKey`](./index.md) |
