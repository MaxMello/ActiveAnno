[activeannoservice](../index.md) / [document](./index.md)

## Package document

### Types

| Name | Summary |
|---|---|
| [AnnotationResult](-annotation-result/index.md) | `data class AnnotationResult`<br>Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses by the policy logic. |
| [AnnotationResultCreator](-annotation-result-creator/index.md) | `data class AnnotationResultCreator`<br>Data class mapping a user identifier to the role it had for the annotation |
| [AnnotationResultCreatorType](-annotation-result-creator-type/index.md) | `enum class AnnotationResultCreatorType`<br>Enum class representing the two user types able to create annotations. |
| [ConfigAnnotationData](-config-annotation-data/index.md) | `data class ConfigAnnotationData`<br>Data class representing all annotation data for a specific configuration. |
| [Document](-document/index.md) | `data class Document`<br>The data class representing a document with some [originalDocument](-document/original-document.md), a unique [_id](-document/_id.md), optionally a [restrictedConfig](-document/restricted-config.md) (marking the document to belong only to that one config), and the [configAnnotationData](-document/config-annotation-data.md) holding all the annotations for every config related to the document. |
| [DocumentAnnotation](-document-annotation/index.md) | `data class DocumentAnnotation`<br>A document annotation is a single object only containing the value of the annotation, which can be [Any](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) type (but actually only primitives, String, and collection of those types) |
| [DocumentDAO](-document-d-a-o/index.md) | `class DocumentDAO`<br>This DAO provides all methods to interact with the document collection. It hides the collection and controls access to it via the public methods. |
| [ExportStatistics](-export-statistics/index.md) | `data class ExportStatistics`<br>Data class holding information about where and how often the annotations were exported. |
| [FinalizedAnnotation](-finalized-annotation/index.md) | `data class FinalizedAnnotation`<br>Data class representing a finalized annotation, which can be one or multiple annotations (referenced by their IDs). It also contains meta data about why the document was finalized, which policy was used, when the finalization happened, and statistics about how the annotations were exported. |
| [FinalizedReason](-finalized-reason/index.md) | `sealed class FinalizedReason`<br>Sealed class with two options why a annotation can be finalized |
| [InteractionLog](-interaction-log/index.md) | `data class InteractionLog`<br>Data class representing log data from the interaction of the user with the document during annotation. |
| [RestCall](-rest-call/index.md) | `data class RestCall`<br>Information about an export via rest call, mainly the route called, how often, and when. |
| [Span](-span/index.md) | `data class Span`<br>When reading annotations, you can either extract the referenced substring by using the [begin](-span/begin.md) and [end](-span/end.md) values, or use the copy of the substring [text](-span/text.md) directly. |
| [SpanAnnotation](-span-annotation/index.md) | `data class SpanAnnotation`<br>A span annotation maps a list of spans to the annotation value, which can be [Any](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) type (but actually only primitives, String, and collection of those types) |
| [WebHookExport](-web-hook-export/index.md) | `data class WebHookExport`<br>Information about a web hook export, containing the export URL, how often it was tries, if it was successful, and possible failure logs for debugging purposes (for example when the web hook returns a 401 unauthorized etc.) |

### Properties

| Name | Summary |
|---|---|
| [KEY_DOCUMENT_TEXT](-k-e-y_-d-o-c-u-m-e-n-t_-t-e-x-t.md) | `const val KEY_DOCUMENT_TEXT: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [KEY_RESTRICTED_CONFIG](-k-e-y_-r-e-s-t-r-i-c-t-e-d_-c-o-n-f-i-g.md) | `const val KEY_RESTRICTED_CONFIG: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Functions

| Name | Summary |
|---|---|
| [applyInputMapping](apply-input-mapping.md) | `fun `[`Document`](-document/index.md)`.applyInputMapping(inputMapping: `[`InputMapping`](../config/-input-mapping/index.md)`): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>`<br>Apply the input mapping to a document, returning a map of string keys to string values of the original document. |
| [getNewestFinalizedAnnotation](get-newest-finalized-annotation.md) | `fun `[`ConfigAnnotationData`](-config-annotation-data/index.md)`.getNewestFinalizedAnnotation(): `[`FinalizedAnnotation`](-finalized-annotation/index.md)`?`<br>Get the newest finalized annotation, being treated as the actual final annotation. FinalizedAnnotations can be changed after the fact, so the newest one is always the new truth. |
