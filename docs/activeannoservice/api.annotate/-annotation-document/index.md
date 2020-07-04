[activeannoservice](../../index.md) / [api.annotate](../index.md) / [AnnotationDocument](./index.md)

# AnnotationDocument

`data class AnnotationDocument`

Model for annotating a document for the frontend

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Model for annotating a document for the frontend`AnnotationDocument(documentID: `[`DocumentID`](../../document/-document-i-d.md)`, projectID: `[`ProjectID`](../../project/-project-i-d.md)`, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>, annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`, annotationConditions: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationEnableConditionResult`](../-annotation-enable-condition-result/index.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [annotationConditions](annotation-conditions.md) | `val annotationConditions: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationEnableConditionResult`](../-annotation-enable-condition-result/index.md)`>` |
| [annotations](annotations.md) | For potential preselection, these values are already sent to the frontend`val annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md) |
| [documentData](document-data.md) | `val documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>` |
| [documentID](document-i-d.md) | `val documentID: `[`DocumentID`](../../document/-document-i-d.md) |
| [projectID](project-i-d.md) | `val projectID: `[`ProjectID`](../../project/-project-i-d.md) |
