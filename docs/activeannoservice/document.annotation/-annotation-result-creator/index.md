[activeannoservice](../../index.md) / [document.annotation](../index.md) / [AnnotationResultCreator](./index.md)

# AnnotationResultCreator

`sealed class AnnotationResultCreator`

The [AnnotationResultCreator](./index.md) represents by whom an [AnnotationResult](../-annotation-result/index.md) was created, which can be by humans ([Annotator](-annotator/index.md), [Curator](-curator/index.md)),
a machine [Generators](-generators/index.md), externally [Import](-import/index.md) or through consensus of all the previous [Consensus](-consensus/index.md).

### Types

| Name | Summary |
|---|---|
| [Annotator](-annotator/index.md) | `data class Annotator : `[`AnnotationResultCreator`](./index.md) |
| [Consensus](-consensus/index.md) | `data class Consensus : `[`AnnotationResultCreator`](./index.md) |
| [Curator](-curator/index.md) | `data class Curator : `[`AnnotationResultCreator`](./index.md) |
| [Generators](-generators/index.md) | `data class Generators : `[`AnnotationResultCreator`](./index.md) |
| [Import](-import/index.md) | `data class Import : `[`AnnotationResultCreator`](./index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [mapAnnotationResultCreatorToDTO](../../api.annotate/map-annotation-result-creator-to-d-t-o.md) | Convert [AnnotationResultCreator](./index.md) to [AnnotationResultCreatorDTO](../../api.annotate/-annotation-result-creator-d-t-o/index.md)`suspend fun `[`AnnotationResultCreator`](./index.md)`.mapAnnotationResultCreatorToDTO(): `[`AnnotationResultCreatorDTO`](../../api.annotate/-annotation-result-creator-d-t-o/index.md) |
