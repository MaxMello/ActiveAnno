[activeannoservice](../../index.md) / [document](../index.md) / [Document](./index.md)

# Document

`data class Document`

The data class representing a document with some [originalDocument](original-document.md), a unique [id](id.md), optionally a [restrictedProjectID](restricted-project-i-d.md)
(marking the document to belong only to that one project), and the [projectAnnotationData](project-annotation-data.md) holding all the annotations
for every project related to the document.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | The data class representing a document with some [originalDocument](original-document.md), a unique [id](id.md), optionally a [restrictedProjectID](restricted-project-i-d.md) (marking the document to belong only to that one project), and the [projectAnnotationData](project-annotation-data.md) holding all the annotations for every project related to the document.`Document(id: `[`DocumentID`](../-document-i-d.md)` = newId<Document>().toString(), storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, originalDocument: ObjectNode, restrictedProjectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, projectAnnotationData: `[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ProjectAnnotationData`](../-project-annotation-data/index.md)`> = mutableMapOf())` |

### Properties

| Name | Summary |
|---|---|
| [id](id.md) | Unique, generated ID (mongo ID)`val id: `[`DocumentID`](../-document-i-d.md) |
| [originalDocument](original-document.md) | `val originalDocument: ObjectNode` |
| [projectAnnotationData](project-annotation-data.md) | `val projectAnnotationData: `[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ProjectAnnotationData`](../-project-annotation-data/index.md)`>` |
| [restrictedProjectID](restricted-project-i-d.md) | Optionally, a [Document](./index.md) can be restricted to a single [Project](../../project/-project/index.md) through this field.`val restrictedProjectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [storeTimestamp](store-timestamp.md) | `val storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |

### Functions

| Name | Summary |
|---|---|
| [equals](equals.md) | `fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |

### Extension Functions

| Name | Summary |
|---|---|
| [addAnnotationResultForProject](../add-annotation-result-for-project.md) | `suspend fun `[`Document`](./index.md)`.addAnnotationResultForProject(project: `[`Project`](../../project/-project/index.md)`, annotationResult: `[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`, checkWebHooks: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, applyPolicy: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, annotationSchema: `[`DenormalizedAnnotationSchema`](../../project.annotationschema/-denormalized-annotation-schema/index.md)`? = null): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [addEmptyProjectAnnotationData](../add-empty-project-annotation-data.md) | `fun `[`Document`](./index.md)`.addEmptyProjectAnnotationData(project: `[`Project`](../../project/-project/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [addFinalizedAnnotationResultForProject](../add-finalized-annotation-result-for-project.md) | Extension function to add [FinalizedAnnotationResult](../../document.annotation/-finalized-annotation-result/index.md) to a [Document](./index.md) and a [Project](../../project/-project/index.md). Might also do logic related to the [Project](../../project/-project/index.md) after adding the result.`suspend fun `[`Document`](./index.md)`.addFinalizedAnnotationResultForProject(project: `[`Project`](../../project/-project/index.md)`, finalizedAnnotationResult: `[`FinalizedAnnotationResult`](../../document.annotation/-finalized-annotation-result/index.md)`, checkWebHooks: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, applyPolicy: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, annotationSchema: `[`DenormalizedAnnotationSchema`](../../project.annotationschema/-denormalized-annotation-schema/index.md)`? = null): `[`ProjectAnnotationData`](../-project-annotation-data/index.md) |
| [addGeneratedAnnotationDataForProject](../add-generated-annotation-data-for-project.md) | `fun `[`Document`](./index.md)`.addGeneratedAnnotationDataForProject(project: `[`Project`](../../project/-project/index.md)`, generatedAnnotationData: `[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [applyInputMapping](../apply-input-mapping.md) | Apply the input mapping to a document, returning a map of string keys to string values of the original document.`fun `[`Document`](./index.md)`.applyInputMapping(inputMapping: `[`InputMapping`](../../project.inputmapping/-input-mapping/index.md)`): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>` |
| [toSearchResultDocument](../../api.search/to-search-result-document.md) | Convert a [Document](./index.md) to a [SearchResultDocument](../../api.search/-search-result-document/index.md)`fun `[`Document`](./index.md)`.toSearchResultDocument(project: `[`Project`](../../project/-project/index.md)`): `[`SearchResultDocument`](../../api.search/-search-result-document/index.md) |
