[activeannoservice](../../index.md) / [api.annotate](../index.md) / [AnnotationResultCreatorDTO](./index.md)

# AnnotationResultCreatorDTO

`sealed class AnnotationResultCreatorDTO`

Equivalent to [AnnotationResultCreator](../../document.annotation/-annotation-result-creator/index.md) but streamlined to a single [displayName](display-name.md) for the frontend

### Types

| Name | Summary |
|---|---|
| [Annotator](-annotator/index.md) | `data class Annotator : `[`AnnotationResultCreatorDTO`](./index.md) |
| [Consensus](-consensus/index.md) | `data class Consensus : `[`AnnotationResultCreatorDTO`](./index.md) |
| [Curator](-curator/index.md) | `data class Curator : `[`AnnotationResultCreatorDTO`](./index.md) |
| [Generators](-generators/index.md) | `data class Generators : `[`AnnotationResultCreatorDTO`](./index.md) |
| [Import](-import/index.md) | `data class Import : `[`AnnotationResultCreatorDTO`](./index.md) |

### Properties

| Name | Summary |
|---|---|
| [displayName](display-name.md) | `abstract val displayName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
