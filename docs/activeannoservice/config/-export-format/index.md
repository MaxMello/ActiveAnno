[activeannoservice](../../index.md) / [config](../index.md) / [ExportFormat](./index.md)

# ExportFormat

`data class ExportFormat`

What aspects for the document and results to export

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `ExportFormat(includeOriginalDocument: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, includeAllAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true)`<br>What aspects for the document and results to export |

### Properties

| Name | Summary |
|---|---|
| [includeAllAnnotations](include-all-annotations.md) | `val includeAllAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [includeOriginalDocument](include-original-document.md) | `val includeOriginalDocument: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |

### Extension Functions

| Name | Summary |
|---|---|
| [convertDocument](../convert-document.md) | `fun `[`ExportFormat`](./index.md)`.convertDocument(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../../document/-document/index.md)`): `[`ExportDocument`](../-export-document/index.md) |
