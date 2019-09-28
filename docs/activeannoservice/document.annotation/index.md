[activeannoservice](../index.md) / [document.annotation](./index.md)

## Package document.annotation

### Types

| Name | Summary |
|---|---|
| [AnnotationResult](-annotation-result/index.md) | `data class AnnotationResult`<br>Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses by the policy logic. |
| [AnnotationResultCreator](-annotation-result-creator/index.md) | `data class AnnotationResultCreator`<br>Data class mapping a user identifier to the role it had for the annotation |
| [AnnotationResultCreatorType](-annotation-result-creator-type/index.md) | `enum class AnnotationResultCreatorType`<br>Enum class representing the two user types able to create annotations. |
| [DocumentAnnotation](-document-annotation/index.md) | `data class DocumentAnnotation`<br>A document annotation is a single object only containing the value of the annotation, which can be [Any](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) type (but actually only primitives, String, and collection of those types) |
| [ExportStatistics](-export-statistics/index.md) | `data class ExportStatistics`<br>Data class holding information about where and how often the annotations were exported. |
| [FinalizedAnnotation](-finalized-annotation/index.md) | `data class FinalizedAnnotation`<br>Data class representing a finalized annotation, which can be one or multiple annotations (referenced by their IDs). It also contains meta data about why the document was finalized, which policy was used, when the finalization happened, and statistics about how the annotations were exported. |
| [FinalizedReason](-finalized-reason/index.md) | `sealed class FinalizedReason`<br>Sealed class with two options why a annotation can be finalized |
| [InteractionLog](-interaction-log/index.md) | `data class InteractionLog`<br>Data class representing log data from the interaction of the user with the document during annotation. |
| [RestCall](-rest-call/index.md) | `data class RestCall`<br>Information about an export via rest call, mainly the route called, how often, and when. |
| [Span](-span/index.md) | `data class Span`<br>When reading annotations, you can either extract the referenced substring by using the [begin](-span/begin.md) and [end](-span/end.md) values, or use the copy of the substring [text](-span/text.md) directly. |
| [SpanAnnotation](-span-annotation/index.md) | `data class SpanAnnotation`<br>A span annotation maps a list of spans to the annotation value, which can be [Any](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) type (but actually only primitives, String, and collection of those types) |
| [WebHookExport](-web-hook-export/index.md) | `data class WebHookExport`<br>Information about a web hook export, containing the export URL, how often it was tries, if it was successful, and possible failure logs for debugging purposes (for example when the web hook returns a 401 unauthorized etc.) |
