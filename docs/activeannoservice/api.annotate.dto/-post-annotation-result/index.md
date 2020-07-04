[activeannoservice](../../index.md) / [api.annotate.dto](../index.md) / [PostAnnotationResult](./index.md)

# PostAnnotationResult

`data class PostAnnotationResult`

Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into
other data structures for storing.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into other data structures for storing.`PostAnnotationResult(documentID: `[`DocumentID`](../../document/-document-i-d.md)`, projectID: `[`ProjectID`](../../project/-project-i-d.md)`, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>, annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md)`, usedProject: `[`UsedAnnotateProject`](../../project/-used-annotate-project/index.md)`, interactionLog: `[`InteractionLog`](../../document.annotation/-interaction-log/index.md)`, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [annotations](annotations.md) | `val annotations: `[`AnnotationMap`](../../document.annotation/-annotation-map.md) |
| [curationRequest](curation-request.md) | `val curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [documentData](document-data.md) | `val documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>` |
| [documentID](document-i-d.md) | `val documentID: `[`DocumentID`](../../document/-document-i-d.md) |
| [interactionLog](interaction-log.md) | `val interactionLog: `[`InteractionLog`](../../document.annotation/-interaction-log/index.md) |
| [projectID](project-i-d.md) | `val projectID: `[`ProjectID`](../../project/-project-i-d.md) |
| [usedProject](used-project.md) | `val usedProject: `[`UsedAnnotateProject`](../../project/-used-annotate-project/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [validate](../validate.md) | Validate a [PostAnnotationResult](./index.md) by applying the enableConditions and validate the annotation if required`suspend fun `[`PostAnnotationResult`](./index.md)`.validate(document: `[`Document`](../../document/-document/index.md)`, project: `[`Project`](../../project/-project/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`?): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ValidationError`](../-validation-error/index.md)`>` |
