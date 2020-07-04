[activeannoservice](../../index.md) / [document](../index.md) / [ProjectAnnotationData](./index.md)

# ProjectAnnotationData

`class ProjectAnnotationData`

Data class representing all annotation data for a specific project.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class representing all annotation data for a specific project.`ProjectAnnotationData(generatedAnnotationData: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`> = listOf(), annotationResults: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`> = listOf(), finalizedAnnotationResults: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`FinalizedAnnotationResult`](../../document.annotation/-finalized-annotation-result/index.md)`> = listOf(), policyAction: `[`PolicyAction`](../../project.policy/-policy-action/index.md)` = PolicyAction.ShowToAnnotator())` |

### Properties

| Name | Summary |
|---|---|
| [annotationResults](annotation-results.md) | `var annotationResults: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`>` |
| [finalizedAnnotationResults](finalized-annotation-results.md) | `var finalizedAnnotationResults: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`FinalizedAnnotationResult`](../../document.annotation/-finalized-annotation-result/index.md)`>` |
| [generatedAnnotationData](generated-annotation-data.md) | `var generatedAnnotationData: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`>` |
| [policyAction](policy-action.md) | The [policyAction](policy-action.md) holds the state of how to handle the document for the specific project, to either show if to an annotator, curator etc.`var policyAction: `[`PolicyAction`](../../project.policy/-policy-action/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [getNewestFinalizedAnnotationResult](../get-newest-finalized-annotation-result.md) | Get the newest finalized annotation, being treated as the actual final annotation. FinalizedAnnotations can be changed after the fact, so the newest one is always the new truth.`fun `[`ProjectAnnotationData`](./index.md)`.getNewestFinalizedAnnotationResult(): `[`FinalizedAnnotationResult`](../../document.annotation/-finalized-annotation-result/index.md)`?` |
