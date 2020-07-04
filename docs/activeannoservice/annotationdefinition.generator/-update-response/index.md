[activeannoservice](../../index.md) / [annotationdefinition.generator](../index.md) / [UpdateResponse](./index.md)

# UpdateResponse

`data class UpdateResponse`

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `UpdateResponse(score: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html)`?, numberOfExamples: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, version: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis())` |

### Properties

| Name | Summary |
|---|---|
| [numberOfExamples](number-of-examples.md) | How many samples were used to train the model (if online learning, the sum of all previous samples as well)`val numberOfExamples: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [score](score.md) | Some quality score where higher means better. Can be F1 score, accuracy score, MEA, MSE, etc. depending on the implementation`val score: `[`Double`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double/index.html)`?` |
| [timestamp](timestamp.md) | Creation timestamp of the UpdateResponse (when was the update finished)`val timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [version](version.md) | What version number was assigned to this generator version`val version: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
