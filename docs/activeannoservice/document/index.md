[activeannoservice](../index.md) / [document](./index.md)

## Package document

### Types

| Name | Summary |
|---|---|
| [Document](-document/index.md) | The data class representing a document with some [originalDocument](-document/original-document.md), a unique [id](-document/id.md), optionally a [restrictedProjectID](-document/restricted-project-i-d.md) (marking the document to belong only to that one project), and the [projectAnnotationData](-document/project-annotation-data.md) holding all the annotations for every project related to the document.`data class Document` |
| [DocumentDAO](-document-d-a-o/index.md) | This DAO provides all methods to interact with the document collection. It hides the collection and controls access to it via the public methods.`class DocumentDAO` |
| [DocumentID](-document-i-d.md) | To make code more readable, define the ID of a document as a typealias on String`typealias DocumentID = `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [ProjectAnnotationData](-project-annotation-data/index.md) | Data class representing all annotation data for a specific project.`class ProjectAnnotationData` |

### Properties

| Name | Summary |
|---|---|
| [KEY_DOCUMENT_TEXT](-k-e-y_-d-o-c-u-m-e-n-t_-t-e-x-t.md) | `const val KEY_DOCUMENT_TEXT: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Functions

| Name | Summary |
|---|---|
| [addAnnotationResultForProject](add-annotation-result-for-project.md) | `suspend fun `[`Document`](-document/index.md)`.addAnnotationResultForProject(project: `[`Project`](../project/-project/index.md)`, annotationResult: `[`AnnotationResult`](../document.annotation/-annotation-result/index.md)`, checkWebHooks: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, applyPolicy: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, annotationSchema: `[`DenormalizedAnnotationSchema`](../project.annotationschema/-denormalized-annotation-schema/index.md)`? = null): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [addEmptyProjectAnnotationData](add-empty-project-annotation-data.md) | `fun `[`Document`](-document/index.md)`.addEmptyProjectAnnotationData(project: `[`Project`](../project/-project/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [addFinalizedAnnotationResultForProject](add-finalized-annotation-result-for-project.md) | Extension function to add [FinalizedAnnotationResult](../document.annotation/-finalized-annotation-result/index.md) to a [Document](-document/index.md) and a [Project](../project/-project/index.md). Might also do logic related to the [Project](../project/-project/index.md) after adding the result.`suspend fun `[`Document`](-document/index.md)`.addFinalizedAnnotationResultForProject(project: `[`Project`](../project/-project/index.md)`, finalizedAnnotationResult: `[`FinalizedAnnotationResult`](../document.annotation/-finalized-annotation-result/index.md)`, checkWebHooks: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, applyPolicy: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, annotationSchema: `[`DenormalizedAnnotationSchema`](../project.annotationschema/-denormalized-annotation-schema/index.md)`? = null): `[`ProjectAnnotationData`](-project-annotation-data/index.md) |
| [addGeneratedAnnotationDataForProject](add-generated-annotation-data-for-project.md) | `fun `[`Document`](-document/index.md)`.addGeneratedAnnotationDataForProject(project: `[`Project`](../project/-project/index.md)`, generatedAnnotationData: `[`GeneratedAnnotationData`](../document.annotation/-generated-annotation-data/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [applyInputMapping](apply-input-mapping.md) | Apply the input mapping to a document, returning a map of string keys to string values of the original document.`fun `[`Document`](-document/index.md)`.applyInputMapping(inputMapping: `[`InputMapping`](../project.inputmapping/-input-mapping/index.md)`): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>` |
| [getNewestFinalizedAnnotationResult](get-newest-finalized-annotation-result.md) | Get the newest finalized annotation, being treated as the actual final annotation. FinalizedAnnotations can be changed after the fact, so the newest one is always the new truth.`fun `[`ProjectAnnotationData`](-project-annotation-data/index.md)`.getNewestFinalizedAnnotationResult(): `[`FinalizedAnnotationResult`](../document.annotation/-finalized-annotation-result/index.md)`?` |
| [updateIndexes](update-indexes.md) | Create all indexes in mongoDB. If they already exist, nothing will happen. Every index is sparse, because they are dynamic and depend on user input. Normally, this would not be recommended when designing a database, but because of the highly configurable nature of ActiveAnno, it is done that way.`suspend fun updateIndexes(): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
