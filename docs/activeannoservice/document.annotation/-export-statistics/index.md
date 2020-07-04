[activeannoservice](../../index.md) / [document.annotation](../index.md) / [ExportStatistics](./index.md)

# ExportStatistics

`data class ExportStatistics`

Data class holding information about where and how often the annotations were exported.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class holding information about where and how often the annotations were exported.`ExportStatistics(webHookStatistics: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`WebHookExport`](../-web-hook-export/index.md)`> = mutableListOf(), restStatistics: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`RestCall`](../-rest-call/index.md)`> = mutableListOf())` |

### Properties

| Name | Summary |
|---|---|
| [restStatistics](rest-statistics.md) | `val restStatistics: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`RestCall`](../-rest-call/index.md)`>` |
| [webHookStatistics](web-hook-statistics.md) | `val webHookStatistics: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`WebHookExport`](../-web-hook-export/index.md)`>` |
