[activeannoservice](../../index.md) / [api.manage](../index.md) / [TopLevelStatistics](./index.md)

# TopLevelStatistics

`data class TopLevelStatistics`

Statistics calculated over all documents

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Statistics calculated over all documents`TopLevelStatistics(documentAccuracyStatistics: `[`AccuracyStatistics`](../-accuracy-statistics/index.md)`, perAnnotationAccuracyStatistics: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, `[`AccuracyStatistics`](../-accuracy-statistics/index.md)`>, perAnnotatorAverageFullDuration: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, `[`TimeWrapper`](../-time-wrapper/index.md)`>, averageAnnotatorFullDuration: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html)`, perAnnotatorAverageInteractionDuration: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, `[`TimeWrapper`](../-time-wrapper/index.md)`>, averageAnnotatorInteractionDuration: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html)`)` |

### Properties

| Name | Summary |
|---|---|
| [averageAnnotatorFullDuration](average-annotator-full-duration.md) | `val averageAnnotatorFullDuration: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html) |
| [averageAnnotatorInteractionDuration](average-annotator-interaction-duration.md) | `val averageAnnotatorInteractionDuration: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html) |
| [documentAccuracyStatistics](document-accuracy-statistics.md) | `val documentAccuracyStatistics: `[`AccuracyStatistics`](../-accuracy-statistics/index.md) |
| [perAnnotationAccuracyStatistics](per-annotation-accuracy-statistics.md) | `val perAnnotationAccuracyStatistics: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, `[`AccuracyStatistics`](../-accuracy-statistics/index.md)`>` |
| [perAnnotatorAverageFullDuration](per-annotator-average-full-duration.md) | `val perAnnotatorAverageFullDuration: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, `[`TimeWrapper`](../-time-wrapper/index.md)`>` |
| [perAnnotatorAverageInteractionDuration](per-annotator-average-interaction-duration.md) | `val perAnnotatorAverageInteractionDuration: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, `[`TimeWrapper`](../-time-wrapper/index.md)`>` |
