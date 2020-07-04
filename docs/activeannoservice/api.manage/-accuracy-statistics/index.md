[activeannoservice](../../index.md) / [api.manage](../index.md) / [AccuracyStatistics](./index.md)

# AccuracyStatistics

`data class AccuracyStatistics`

Statistics about the accuracy and IAA

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Statistics about the accuracy and IAA`AccuracyStatistics(interAnnotatorAgreement: `[`PercentWrapper`](../-percent-wrapper/index.md)`, annotatorAccuracy: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`PercentWrapper`](../-percent-wrapper/index.md)`>, averageAnnotatorAccuracy: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html)`, generatorAccuracy: `[`PercentWrapper`](../-percent-wrapper/index.md)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [annotatorAccuracy](annotator-accuracy.md) | `val annotatorAccuracy: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`PercentWrapper`](../-percent-wrapper/index.md)`>` |
| [averageAnnotatorAccuracy](average-annotator-accuracy.md) | `val averageAnnotatorAccuracy: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html) |
| [generatorAccuracy](generator-accuracy.md) | `val generatorAccuracy: `[`PercentWrapper`](../-percent-wrapper/index.md)`?` |
| [interAnnotatorAgreement](inter-annotator-agreement.md) | `val interAnnotatorAgreement: `[`PercentWrapper`](../-percent-wrapper/index.md) |
