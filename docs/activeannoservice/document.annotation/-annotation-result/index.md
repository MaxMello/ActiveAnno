[activeannoservice](../../index.md) / [document.annotation](../index.md) / [AnnotationResult](./index.md)

# AnnotationResult

`data class AnnotationResult`

Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses
by the policy logic.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses by the policy logic.`AnnotationResult(id: `[`AnnotationResultID`](../-annotation-result-i-d.md)`, documentID: `[`DocumentID`](../../document/-document-i-d.md)`, projectID: `[`ProjectID`](../../project/-project-i-d.md)`, timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, annotations: `[`AnnotationMap`](../-annotation-map.md)`, creator: `[`AnnotationResultCreator`](../-annotation-result-creator/index.md)`, interactionLog: `[`InteractionLog`](../-interaction-log/index.md)`? = null, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>? = null, usedProject: `[`UsedAnnotateProject`](../../project/-used-annotate-project/index.md)`? = null, generatedAnnotationDataID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [annotations](annotations.md) | `val annotations: `[`AnnotationMap`](../-annotation-map.md) |
| [creator](creator.md) | `val creator: `[`AnnotationResultCreator`](../-annotation-result-creator/index.md) |
| [documentData](document-data.md) | `val documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>?` |
| [documentID](document-i-d.md) | `val documentID: `[`DocumentID`](../../document/-document-i-d.md) |
| [generatedAnnotationDataID](generated-annotation-data-i-d.md) | `val generatedAnnotationDataID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [id](id.md) | `val id: `[`AnnotationResultID`](../-annotation-result-i-d.md) |
| [interactionLog](interaction-log.md) | `val interactionLog: `[`InteractionLog`](../-interaction-log/index.md)`?` |
| [projectID](project-i-d.md) | `val projectID: `[`ProjectID`](../../project/-project-i-d.md) |
| [timestamp](timestamp.md) | `val timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [usedProject](used-project.md) | `val usedProject: `[`UsedAnnotateProject`](../../project/-used-annotate-project/index.md)`?` |
