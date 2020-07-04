[activeannoservice](../index.md) / [api.annotate](./index.md)

## Package api.annotate

### Types

| Name | Summary |
|---|---|
| [AnnotationDocument](-annotation-document/index.md) | Model for annotating a document for the frontend`data class AnnotationDocument` |
| [AnnotationEnableConditionResult](-annotation-enable-condition-result/index.md) | A single EnableCondition applied result, indicating if an annotation is [required](-annotation-enable-condition-result/required.md) or not.`data class AnnotationEnableConditionResult` |
| [AnnotationResultCreatorDTO](-annotation-result-creator-d-t-o/index.md) | Equivalent to [AnnotationResultCreator](../document.annotation/-annotation-result-creator/index.md) but streamlined to a single [displayName](-annotation-result-creator-d-t-o/display-name.md) for the frontend`sealed class AnnotationResultCreatorDTO` |
| [CheckEnableConditionRequestBody](-check-enable-condition-request-body/index.md) | Data class to receive a check enable condition request`data class CheckEnableConditionRequestBody` |
| [CheckEnableConditionResponse](-check-enable-condition-response/index.md) | Data class for the response body of the check enable condition request`data class CheckEnableConditionResponse` |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [io.ktor.routing.Route](io.ktor.routing.-route/index.md) |  |

### Functions

| Name | Summary |
|---|---|
| [buildAnnotationConditions](build-annotation-conditions.md) | Top level function to apply the enableConditions for a given [AnnotationMap](../document.annotation/-annotation-map.md)`suspend fun buildAnnotationConditions(documentID: `[`DocumentID`](../document/-document-i-d.md)`, projectID: `[`ProjectID`](../project/-project-i-d.md)`, layout: `[`Layout`](../project.layout/-layout/index.md)`, annotations: `[`AnnotationMap`](../document.annotation/-annotation-map.md)`): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationEnableConditionResult`](-annotation-enable-condition-result/index.md)`>` |
| [mapAnnotationResultCreatorToDTO](map-annotation-result-creator-to-d-t-o.md) | Convert [AnnotationResultCreator](../document.annotation/-annotation-result-creator/index.md) to [AnnotationResultCreatorDTO](-annotation-result-creator-d-t-o/index.md)`suspend fun `[`AnnotationResultCreator`](../document.annotation/-annotation-result-creator/index.md)`.mapAnnotationResultCreatorToDTO(): `[`AnnotationResultCreatorDTO`](-annotation-result-creator-d-t-o/index.md) |
