[activeannoservice](../index.md) / [config](index.md) / [Target](./-target.md)

# Target

`interface Target`

The target of an annotation can be the whole document or a specific offset of characters, a span.

### Inheritors

| Name | Summary |
|---|---|
| [DocumentTarget](-document-target/index.md) | `class DocumentTarget : `[`Target`](./-target.md)<br>Use this for annotations that should be created for the whole document. |
| [SpanTarget](-span-target/index.md) | `data class SpanTarget : `[`Target`](./-target.md)<br>Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set. |
