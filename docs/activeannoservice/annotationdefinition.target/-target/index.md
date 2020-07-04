[activeannoservice](../../index.md) / [annotationdefinition.target](../index.md) / [Target](./index.md)

# Target

`sealed class Target`

The target of an annotation can be the whole document or a specific offset of characters, a span.

### Properties

| Name | Summary |
|---|---|
| [type](type.md) | `abstract val type: `[`TargetType`](../-target-type/index.md) |

### Inheritors

| Name | Summary |
|---|---|
| [DocumentTarget](../-document-target/index.md) | Use this for annotations that should be created for the whole document.`class DocumentTarget : `[`Target`](./index.md) |
| [SpanTarget](../-span-target/index.md) | Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set.`data class SpanTarget : `[`Target`](./index.md) |
