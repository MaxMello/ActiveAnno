[activeannoservice](../../index.md) / [project.selection](../index.md) / [DateRangeFilter](./index.md)

# DateRangeFilter

`data class DateRangeFilter`

How should the date range filter work

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | How should the date range filter work`DateRangeFilter(dateKey: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "storeTimestamp", dateFormat: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [dateFormat](date-format.md) | DateFormat to parse the date if it is not a timestamp already, null for timestamp parsing`val dateFormat: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [dateKey](date-key.md) | can be customized by any key inside originalDocument`val dateKey: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
