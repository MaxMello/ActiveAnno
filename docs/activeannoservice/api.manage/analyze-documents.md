[activeannoservice](../index.md) / [api.manage](index.md) / [analyzeDocuments](./analyze-documents.md)

# analyzeDocuments

`suspend fun analyzeDocuments(documents: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../document/-document/index.md)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResult`](../document.annotation/-annotation-result/index.md)`>>, project: `[`Project`](../project/-project/index.md)`, analyzeProject: `[`AnalyzeProjectRequest`](-analyze-project-request/index.md)`, userIdentifier: `[`UserIdentifier`](../project.userroles/-user-identifier.md)`): `[`AnalyzeProjectResponse`](-analyze-project-response/index.md)

Analyze the given [documents](analyze-documents.md#api.manage$analyzeDocuments(kotlin.collections.Map((document.Document, kotlin.collections.List((document.annotation.AnnotationResult)))), project.Project, api.manage.AnalyzeProjectRequest, kotlin.String)/documents) w.r.t accuracy, agreement etc.

