[activeannoservice](../index.md) / [api.manage](./index.md)

## Package api.manage

### Types

| Name | Summary |
|---|---|
| [AccuracyStatistics](-accuracy-statistics/index.md) | Statistics about the accuracy and IAA`data class AccuracyStatistics` |
| [AnalyzedAnnotationResult](-analyzed-annotation-result/index.md) | Analyzed individual annotation result`data class AnalyzedAnnotationResult` |
| [AnalyzedDocument](-analyzed-document/index.md) | A document with additional statistics like agreement and correctness`data class AnalyzedDocument` |
| [AnalyzeProjectRequest](-analyze-project-request/index.md) | Request body for analyze endpoint`data class AnalyzeProjectRequest` |
| [AnalyzeProjectResponse](-analyze-project-response/index.md) | Analyze response with [TopLevelStatistics](-top-level-statistics/index.md) and a list of [AnalyzedDocument](-analyzed-document/index.md)s`data class AnalyzeProjectResponse` |
| [DocumentStatistics](-document-statistics/index.md) | Individual statistics for a document`data class DocumentStatistics` |
| [FinalizedAnnotationResultForAnalysis](-finalized-annotation-result-for-analysis/index.md) | Finalized annotation result used for the analze response`data class FinalizedAnnotationResultForAnalysis` |
| [PercentWrapper](-percent-wrapper/index.md) | Wrap the percent by storing [n](-percent-wrapper/n.md), the [absolute](-percent-wrapper/absolute.md) value as well as the calulcated percent value.`data class PercentWrapper` |
| [ProjectStoreResponse](-project-store-response/index.md) | Response body for storing a [Project](#) with success info and validation errors`data class ProjectStoreResponse` |
| [TimeWrapper](-time-wrapper/index.md) | Wrap a time [average](-time-wrapper/average.md) with the [n](-time-wrapper/n.md) over which it was calculated`data class TimeWrapper` |
| [TopLevelStatistics](-top-level-statistics/index.md) | Statistics calculated over all documents`data class TopLevelStatistics` |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [io.ktor.routing.Route](io.ktor.routing.-route/index.md) |  |
| [kotlin.collections.List](kotlin.collections.-list/index.md) |  |

### Functions

| Name | Summary |
|---|---|
| [analyzeDocuments](analyze-documents.md) | Analyze the given [documents](analyze-documents.md#api.manage$analyzeDocuments(kotlin.collections.Map((document.Document, kotlin.collections.List((document.annotation.AnnotationResult)))), project.Project, api.manage.AnalyzeProjectRequest, kotlin.String)/documents) w.r.t accuracy, agreement etc.`suspend fun analyzeDocuments(documents: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../document/-document/index.md)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResult`](../document.annotation/-annotation-result/index.md)`>>, project: `[`Project`](../project/-project/index.md)`, analyzeProject: `[`AnalyzeProjectRequest`](-analyze-project-request/index.md)`, userIdentifier: `[`UserIdentifier`](../project.userroles/-user-identifier.md)`): `[`AnalyzeProjectResponse`](-analyze-project-response/index.md) |
| [validateProject](validate-project.md) | Validate a project to ensure it is not in an invalid state`suspend fun validateProject(project: `[`ManageProject`](../api.manage.dto/-manage-project/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`?, annotationDefinitionDAO: `[`AnnotationDefinitionDAO`](../annotationdefinition/-annotation-definition-d-a-o/index.md)`, annotationGeneratorDAO: `[`AnnotationGeneratorDAO`](../annotationdefinition.generator/-annotation-generator-d-a-o/index.md)`): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ProjectValidationError`](../project/-project-validation-error/index.md)`>` |
