[activeannoservice](../../index.md) / [api.manage](../index.md) / [AnalyzeProjectResponse](./index.md)

# AnalyzeProjectResponse

`data class AnalyzeProjectResponse`

Analyze response with [TopLevelStatistics](../-top-level-statistics/index.md) and a list of [AnalyzedDocument](../-analyzed-document/index.md)s

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Analyze response with [TopLevelStatistics](../-top-level-statistics/index.md) and a list of [AnalyzedDocument](../-analyzed-document/index.md)s`AnalyzeProjectResponse(projectID: `[`ProjectID`](../../project/-project-i-d.md)`, analyzedDocuments: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnalyzedDocument`](../-analyzed-document/index.md)`>, topLevelStatistics: `[`TopLevelStatistics`](../-top-level-statistics/index.md)`?, annotateProject: `[`AnnotateProject`](../../api.annotate.dto/-annotate-project/index.md)`?, annotationNames: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>, userNames: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>, errorMessage: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [analyzedDocuments](analyzed-documents.md) | `val analyzedDocuments: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnalyzedDocument`](../-analyzed-document/index.md)`>` |
| [annotateProject](annotate-project.md) | `val annotateProject: `[`AnnotateProject`](../../api.annotate.dto/-annotate-project/index.md)`?` |
| [annotationNames](annotation-names.md) | `val annotationNames: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>` |
| [errorMessage](error-message.md) | `val errorMessage: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [projectID](project-i-d.md) | `val projectID: `[`ProjectID`](../../project/-project-i-d.md) |
| [topLevelStatistics](top-level-statistics.md) | `val topLevelStatistics: `[`TopLevelStatistics`](../-top-level-statistics/index.md)`?` |
| [userNames](user-names.md) | `val userNames: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>` |
