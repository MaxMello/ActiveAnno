[activeannoservice](../../index.md) / [document.annotation](../index.md) / [WebHookExport](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`WebHookExport(url: `[`URL`](https://docs.oracle.com/javase/6/docs/api/java/net/URL.html)`, tries: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 0, success: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, updatedTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, failureLogs: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = mutableListOf())`

Information about a web hook export, containing the export URL, how often it was tries, if it was successful,
and possible failure logs for debugging purposes (for example when the web hook returns a 401 unauthorized etc.)

