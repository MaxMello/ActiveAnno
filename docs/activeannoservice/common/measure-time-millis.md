[activeannoservice](../index.md) / [common](index.md) / [measureTimeMillis](./measure-time-millis.md)

# measureTimeMillis

`inline fun <T> measureTimeMillis(loggingFunction: (`[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`) -> `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)`, function: () -> T): T`

Higher order helper function to measure and log the execution time of the passed [function](measure-time-millis.md#common$measureTimeMillis(kotlin.Function1((kotlin.Long, kotlin.Unit)), kotlin.Function0((common.measureTimeMillis.T)))/function) while returning the result of the [function](measure-time-millis.md#common$measureTimeMillis(kotlin.Function1((kotlin.Long, kotlin.Unit)), kotlin.Function0((common.measureTimeMillis.T)))/function)

