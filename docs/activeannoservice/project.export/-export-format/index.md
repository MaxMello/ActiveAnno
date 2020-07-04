[activeannoservice](../../index.md) / [project.export](../index.md) / [ExportFormat](./index.md)

# ExportFormat

`data class ExportFormat`

What aspects for the document and results to export

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | What aspects for the document and results to export`ExportFormat(includeOriginalDocument: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, includeAllAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true)` |

### Properties

| Name | Summary |
|---|---|
| [includeAllAnnotations](include-all-annotations.md) | `val includeAllAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [includeOriginalDocument](include-original-document.md) | `val includeOriginalDocument: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Extension Functions

| Name | Summary |
|---|---|
| [convertDocument](../convert-document.md) | `fun `[`ExportFormat`](./index.md)`.convertDocument(projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../../document/-document/index.md)`, includeUsedProject: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, includeDocumentData: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, includeExportStatistics: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false): `[`ExportDocument`](../-export-document/index.md) |
