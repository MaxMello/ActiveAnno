[activeannoservice](../../index.md) / [project.policy](../index.md) / [Policy](./index.md)

# Policy

`data class Policy`

Data class defining policy of how to handle documents / annotations, especially how and when to finalize an annotation
for a document and project.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class defining policy of how to handle documents / annotations, especially how and when to finalize an annotation for a document and project.`Policy(numberOfAnnotatorsPerDocument: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, allowManualEscalationToCurator: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, finalizeAnnotationPolicy: `[`FinalizeAnnotationPolicy`](../-finalize-annotation-policy/index.md)` = FinalizeAnnotationPolicy.MAJORITY_VOTE_WHOLE_DOCUMENT_OR_CURATOR)` |

### Properties

| Name | Summary |
|---|---|
| [allowManualEscalationToCurator](allow-manual-escalation-to-curator.md) | `val allowManualEscalationToCurator: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [finalizeAnnotationPolicy](finalize-annotation-policy.md) | `val finalizeAnnotationPolicy: `[`FinalizeAnnotationPolicy`](../-finalize-annotation-policy/index.md) |
| [numberOfAnnotatorsPerDocument](number-of-annotators-per-document.md) | `val numberOfAnnotatorsPerDocument: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |

### Extension Functions

| Name | Summary |
|---|---|
| [applyPolicy](../apply-policy.md) | `suspend fun `[`Policy`](./index.md)`.applyPolicy(project: `[`Project`](../../project/-project/index.md)`, document: `[`Document`](../../document/-document/index.md)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, annotationSchema: `[`DenormalizedAnnotationSchema`](../../project.annotationschema/-denormalized-annotation-schema/index.md)`? = null): `[`PolicyAction`](../-policy-action/index.md) |
