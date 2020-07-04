[activeannoservice](../../index.md) / [document.annotation](../index.md) / [WebHookExport](./index.md)

# WebHookExport

`data class WebHookExport`

Information about a web hook export, containing the export URL, how often it was tries, if it was successful,
and possible failure logs for debugging purposes (for example when the web hook returns a 401 unauthorized etc.)

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Information about a web hook export, containing the export URL, how often it was tries, if it was successful, and possible failure logs for debugging purposes (for example when the web hook returns a 401 unauthorized etc.)`WebHookExport(url: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, tries: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 0, success: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, updatedTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, failureLogs: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = mutableListOf())` |

### Properties

| Name | Summary |
|---|---|
| [createdTimestamp](created-timestamp.md) | `val createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [failureLogs](failure-logs.md) | `val failureLogs: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>` |
| [success](success.md) | `var success: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [tries](tries.md) | `var tries: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [updatedTimestamp](updated-timestamp.md) | `var updatedTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [url](url.md) | `val url: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
