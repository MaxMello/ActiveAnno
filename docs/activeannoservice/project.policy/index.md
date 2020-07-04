[activeannoservice](../index.md) / [project.policy](./index.md)

## Package project.policy

### Types

| Name | Summary |
|---|---|
| [FinalizeAnnotationPolicy](-finalize-annotation-policy/index.md) | `enum class FinalizeAnnotationPolicy` |
| [Policy](-policy/index.md) | Data class defining policy of how to handle documents / annotations, especially how and when to finalize an annotation for a document and project.`data class Policy` |
| [PolicyAction](-policy-action/index.md) | Sealed class for the different actions that can be required to be taken for a document to get the annotation done properly`sealed class PolicyAction` |

### Exceptions

| Name | Summary |
|---|---|
| [PolicyFailureException](-policy-failure-exception/index.md) | `class PolicyFailureException : `[`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/index.html) |

### Functions

| Name | Summary |
|---|---|
| [applyPolicy](apply-policy.md) | `suspend fun `[`Policy`](-policy/index.md)`.applyPolicy(project: `[`Project`](../project/-project/index.md)`, document: `[`Document`](../document/-document/index.md)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, annotationSchema: `[`DenormalizedAnnotationSchema`](../project.annotationschema/-denormalized-annotation-schema/index.md)`? = null): `[`PolicyAction`](-policy-action/index.md) |
| [isCompleteAnnotationResult](is-complete-annotation-result.md) | We need to validate that an [AnnotationResult](../document.annotation/-annotation-result/index.md) has every required annotation`fun isCompleteAnnotationResult(annotationResult: `[`AnnotationResult`](../document.annotation/-annotation-result/index.md)`, document: `[`Document`](../document/-document/index.md)`, annotationSchema: `[`DenormalizedAnnotationSchema`](../project.annotationschema/-denormalized-annotation-schema/index.md)`): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
