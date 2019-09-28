[activeannoservice](../../index.md) / [document](../index.md) / [ConfigAnnotationData](./index.md)

# ConfigAnnotationData

`data class ConfigAnnotationData`

Data class representing all annotation data for a specific configuration.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `ConfigAnnotationData(annotations: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`> = mutableListOf(), finalizedAnnotations: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`FinalizedAnnotation`](../../document.annotation/-finalized-annotation/index.md)`> = mutableListOf(), policyAction: `[`PolicyAction`](../../config.policy/-policy-action/index.md)` = PolicyAction.ShowToAnnotator())`<br>Data class representing all annotation data for a specific configuration. |

### Properties

| Name | Summary |
|---|---|
| [annotations](annotations.md) | `val annotations: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`>` |
| [finalizedAnnotations](finalized-annotations.md) | `var finalizedAnnotations: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`FinalizedAnnotation`](../../document.annotation/-finalized-annotation/index.md)`>` |
| [policyAction](policy-action.md) | `var policyAction: `[`PolicyAction`](../../config.policy/-policy-action/index.md)<br>The [policyAction](policy-action.md) holds the state of how to handle the document for the specific configuration, to either show if to an annotator, curator etc. |

### Extension Functions

| Name | Summary |
|---|---|
| [getNewestFinalizedAnnotation](../get-newest-finalized-annotation.md) | `fun `[`ConfigAnnotationData`](./index.md)`.getNewestFinalizedAnnotation(): `[`FinalizedAnnotation`](../../document.annotation/-finalized-annotation/index.md)`?`<br>Get the newest finalized annotation, being treated as the actual final annotation. FinalizedAnnotations can be changed after the fact, so the newest one is always the new truth. |
