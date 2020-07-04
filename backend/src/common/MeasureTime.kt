package common

/**
 * Higher order helper function to measure and log the execution time of the passed [function] while returning the result of the [function]
 */
inline fun <T> measureTimeMillis(loggingFunction: (Long) -> Unit,
                                 function: () -> T): T {

    val startTime = System.currentTimeMillis()
    val result: T = function.invoke()
    loggingFunction.invoke(System.currentTimeMillis() - startTime)
    return result
}