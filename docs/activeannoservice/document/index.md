[activeannoservice](../index.md) / [document](./index.md)

## Package document

### Types

| Name | Summary |
|---|---|
| [ConfigAnnotationData](-config-annotation-data/index.md) | `data class ConfigAnnotationData`<br>Data class representing all annotation data for a specific configuration. |
| [Document](-document/index.md) | `data class Document`<br>The data class representing a document with some [originalDocument](-document/original-document.md), a unique [_id](-document/_id.md), optionally a [restrictedConfig](-document/restricted-config.md) (marking the document to belong only to that one config), and the [configAnnotationData](-document/config-annotation-data.md) holding all the annotations for every config related to the document. |
| [DocumentDAO](-document-d-a-o/index.md) | `class DocumentDAO`<br>This DAO provides all methods to interact with the document collection. It hides the collection and controls access to it via the public methods. |

### Properties

| Name | Summary |
|---|---|
| [KEY_DOCUMENT_TEXT](-k-e-y_-d-o-c-u-m-e-n-t_-t-e-x-t.md) | `const val KEY_DOCUMENT_TEXT: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [KEY_RESTRICTED_CONFIG](-k-e-y_-r-e-s-t-r-i-c-t-e-d_-c-o-n-f-i-g.md) | `const val KEY_RESTRICTED_CONFIG: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Functions

| Name | Summary |
|---|---|
| [applyInputMapping](apply-input-mapping.md) | `fun `[`Document`](-document/index.md)`.applyInputMapping(inputMapping: `[`InputMapping`](../config.inputmapping/-input-mapping/index.md)`): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>`<br>Apply the input mapping to a document, returning a map of string keys to string values of the original document. |
| [getNewestFinalizedAnnotation](get-newest-finalized-annotation.md) | `fun `[`ConfigAnnotationData`](-config-annotation-data/index.md)`.getNewestFinalizedAnnotation(): `[`FinalizedAnnotation`](../document.annotation/-finalized-annotation/index.md)`?`<br>Get the newest finalized annotation, being treated as the actual final annotation. FinalizedAnnotations can be changed after the fact, so the newest one is always the new truth. |
