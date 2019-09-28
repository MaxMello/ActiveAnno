[activeannoservice](../index.md) / [config.policy](./index.md)

## Package config.policy

### Types

| Name | Summary |
|---|---|
| [FinalizeAnnotationPolicy](-finalize-annotation-policy/index.md) | `enum class FinalizeAnnotationPolicy` |
| [Policy](-policy/index.md) | `data class Policy`<br>Data class defining policy of how to handle documents / annotations, especially how and when to finalize an annotation for a document and configuration. |
| [PolicyAction](-policy-action/index.md) | `sealed class PolicyAction`<br>Sealed class for the different actions that can be required to be taken for a document to get the annotation done properly |

### Functions

| Name | Summary |
|---|---|
| [applyPolicy](apply-policy.md) | `fun `[`Policy`](-policy/index.md)`.applyPolicy(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null): `[`PolicyAction`](-policy-action/index.md) |
