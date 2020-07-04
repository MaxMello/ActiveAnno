[activeannoservice](../../index.md) / [document.annotation](../index.md) / [FinalizedReason](./index.md)

# FinalizedReason

`sealed class FinalizedReason`

Sealed class with two options why a annotation can be finalized

### Types

| Name | Summary |
|---|---|
| [Curator](-curator/index.md) | FinalizedReason that a curator annotated the document.`data class Curator : `[`FinalizedReason`](./index.md) |
| [Policy](-policy.md) | FinalizedReason that the Policy logic decided that the annotations are finished.`object Policy : `[`FinalizedReason`](./index.md) |
