[activeannoservice](../index.md) / [annotationdefinition.target](./index.md)

## Package annotationdefinition.target

### Types

| Name | Summary |
|---|---|
| [DocumentTarget](-document-target/index.md) | Use this for annotations that should be created for the whole document.`class DocumentTarget : `[`Target`](-target/index.md) |
| [SpanGranularity](-span-granularity/index.md) | What is the allowed cutoff point for a span, a single character or only whole tokens?`enum class SpanGranularity` |
| [SpanTarget](-span-target/index.md) | Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set.`data class SpanTarget : `[`Target`](-target/index.md) |
| [Target](-target/index.md) | The target of an annotation can be the whole document or a specific offset of characters, a span.`sealed class Target` |
| [TargetType](-target-type/index.md) | Enum class representing the two Target types, equivalent value to the JsonSubType of Target class`enum class TargetType` |
