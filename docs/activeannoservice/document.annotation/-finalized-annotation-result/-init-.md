[activeannoservice](../../index.md) / [document.annotation](../index.md) / [FinalizedAnnotationResult](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`FinalizedAnnotationResult(annotationResultIDs: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>, finalizedReason: `[`FinalizedReason`](../-finalized-reason/index.md)`, usedPolicy: `[`Policy`](../../project.policy/-policy/index.md)`, timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, exportStatistics: `[`ExportStatistics`](../-export-statistics/index.md)` = ExportStatistics())`

Data class representing a finalized annotation, which can be one or multiple annotations (referenced by their IDs).
It also contains meta data about why the document was finalized, which policy was used, when the finalization happened,
and statistics about how the annotations were exported.

