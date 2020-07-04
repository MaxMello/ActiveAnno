[activeannoservice](../../index.md) / [api.manage](../index.md) / [AnalyzedDocument](./index.md)

# AnalyzedDocument

`data class AnalyzedDocument`

A document with additional statistics like agreement and correctness

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | A document with additional statistics like agreement and correctness`AnalyzedDocument(documentID: `[`DocumentID`](../../document/-document-i-d.md)`, storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>, documentStatistics: `[`DocumentStatistics`](../-document-statistics/index.md)`, perAnnotationStatistics: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, `[`DocumentStatistics`](../-document-statistics/index.md)`>, analyzedAnnotationResults: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnalyzedAnnotationResult`](../-analyzed-annotation-result/index.md)`>, finalizedAnnotationResult: `[`FinalizedAnnotationResultForAnalysis`](../-finalized-annotation-result-for-analysis/index.md)`)` |

### Properties

| Name | Summary |
|---|---|
| [analyzedAnnotationResults](analyzed-annotation-results.md) | `val analyzedAnnotationResults: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnalyzedAnnotationResult`](../-analyzed-annotation-result/index.md)`>` |
| [documentData](document-data.md) | `val documentData: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`>` |
| [documentID](document-i-d.md) | `val documentID: `[`DocumentID`](../../document/-document-i-d.md) |
| [documentStatistics](document-statistics.md) | `val documentStatistics: `[`DocumentStatistics`](../-document-statistics/index.md) |
| [finalizedAnnotationResult](finalized-annotation-result.md) | `val finalizedAnnotationResult: `[`FinalizedAnnotationResultForAnalysis`](../-finalized-annotation-result-for-analysis/index.md) |
| [perAnnotationStatistics](per-annotation-statistics.md) | `val perAnnotationStatistics: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`AnnotationID`](../../annotationdefinition/-annotation-i-d.md)`, `[`DocumentStatistics`](../-document-statistics/index.md)`>` |
| [storeTimestamp](store-timestamp.md) | `val storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
