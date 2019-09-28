[activeannoservice](../../index.md) / [document](../index.md) / [FinalizedAnnotation](./index.md)

# FinalizedAnnotation

`data class FinalizedAnnotation`

Data class representing a finalized annotation, which can be one or multiple annotations (referenced by their IDs).
It also contains meta data about why the document was finalized, which policy was used, when the finalization happened,
and statistics about how the annotations were exported.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `FinalizedAnnotation(annotationResultIDs: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>, finalizedReason: `[`FinalizedReason`](../-finalized-reason/index.md)`, usedPolicy: `[`Policy`](../../config/-policy/index.md)`, timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, exportStatistics: `[`ExportStatistics`](../-export-statistics/index.md)` = ExportStatistics())`<br>Data class representing a finalized annotation, which can be one or multiple annotations (referenced by their IDs). It also contains meta data about why the document was finalized, which policy was used, when the finalization happened, and statistics about how the annotations were exported. |

### Properties

| Name | Summary |
|---|---|
| [annotationResultIDs](annotation-result-i-ds.md) | `val annotationResultIDs: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>` |
| [exportStatistics](export-statistics.md) | `val exportStatistics: `[`ExportStatistics`](../-export-statistics/index.md) |
| [finalizedReason](finalized-reason.md) | `val finalizedReason: `[`FinalizedReason`](../-finalized-reason/index.md) |
| [timestamp](timestamp.md) | `val timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [usedPolicy](used-policy.md) | `val usedPolicy: `[`Policy`](../../config/-policy/index.md) |
