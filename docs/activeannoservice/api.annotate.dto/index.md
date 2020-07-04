[activeannoservice](../index.md) / [api.annotate.dto](./index.md)

## Package api.annotate.dto

### Types

| Name | Summary |
|---|---|
| [AnnotateProject](-annotate-project/index.md) | View data class - all properties relevant to annotate / curate a project in the frontend`data class AnnotateProject` |
| [AnnotationResultStoreResponse](-annotation-result-store-response/index.md) | Return model for storing endpoints, letting the frontend know the data was stored successfully. If not, will return [validationErrors](-annotation-result-store-response/validation-errors.md)`data class AnnotationResultStoreResponse` |
| [ListProject](-list-project/index.md) | View data class - all properties necessary to display project in list in the frontend`data class ListProject` |
| [PostAnnotationResult](-post-annotation-result/index.md) | Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into other data structures for storing.`data class PostAnnotationResult` |
| [ValidationError](-validation-error/index.md) | Single [ValidationError](-validation-error/index.md) w.r.t. an annotation definition + target`data class ValidationError` |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [kotlin.collections.MutableMap](kotlin.collections.-mutable-map/index.md) |  |

### Functions

| Name | Summary |
|---|---|
| [toAnnotateProject](to-annotate-project.md) | Convert a [Project](../project/-project/index.md) to an [AnnotateProject](-annotate-project/index.md), doing some operations to enrich the project data to be able to use it for annotation. For example, if an OpenTagAnnotation is present, this method might aggregate the existing values from all documents of the project and add it to the AnnotateProject.`suspend fun `[`Project`](../project/-project/index.md)`.toAnnotateProject(userIdentifier: `[`UserIdentifier`](../project.userroles/-user-identifier.md)`, userIsCurator: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false): `[`AnnotateProject`](-annotate-project/index.md) |
| [toListProject](to-list-project.md) | Convert a [Project](../project/-project/index.md) to a [ListProject](-list-project/index.md)`fun `[`Project`](../project/-project/index.md)`.toListProject(): `[`ListProject`](-list-project/index.md) |
| [validate](validate.md) | Validate a [PostAnnotationResult](-post-annotation-result/index.md) by applying the enableConditions and validate the annotation if required`suspend fun `[`PostAnnotationResult`](-post-annotation-result/index.md)`.validate(document: `[`Document`](../document/-document/index.md)`, project: `[`Project`](../project/-project/index.md)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`?): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`ValidationError`](-validation-error/index.md)`>` |
