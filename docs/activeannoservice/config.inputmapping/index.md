[activeannoservice](../index.md) / [config.inputmapping](./index.md)

## Package config.inputmapping

### Types

| Name | Summary |
|---|---|
| [CreateIndex](-create-index/index.md) | `data class CreateIndex : `[`Index`](-index.md)<br>Use this to define a non-text index with an order as well as an optional unique constraint |
| [CreateTextIndex](-create-text-index/index.md) | `class CreateTextIndex : `[`Index`](-index.md)<br>Use this to apply a text index for a field |
| [DocumentText](-document-text/index.md) | `data class DocumentText` |
| [Index](-index.md) | `interface Index`<br>Representing index options from MongoDB. |
| [InputMapping](-input-mapping/index.md) | `data class InputMapping`<br>Mapping of originalDocument to documentData used in UI. Will be mapped based on this classes values. Additionally, provides the ability to define indices for faster queries in DB |
| [MetaData](-meta-data/index.md) | `data class MetaData` |
