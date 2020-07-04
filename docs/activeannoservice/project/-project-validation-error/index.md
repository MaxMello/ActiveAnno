[activeannoservice](../../index.md) / [project](../index.md) / [ProjectValidationError](./index.md)

# ProjectValidationError

`data class ProjectValidationError`

A single validation error for a specific key of the [ManageProject](#)

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | A single validation error for a specific key of the [ManageProject](#)`ProjectValidationError(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, criticalError: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false)` |

### Properties

| Name | Summary |
|---|---|
| [criticalError](critical-error.md) | [criticalError](critical-error.md) means, the project cannot be saved. Else, it just cannot be set active`val criticalError: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [key](key.md) | `val key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [message](message.md) | `val message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
