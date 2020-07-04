[activeannoservice](../../index.md) / [common](../index.md) / [HttpErrorResponse](./index.md)

# HttpErrorResponse

`data class HttpErrorResponse`

Data class to return on an http error, which can have a more detailed [errorCode](error-code.md) explaining the reason for the status code

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class to return on an http error, which can have a more detailed [errorCode](error-code.md) explaining the reason for the status code`HttpErrorResponse(message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, errorCode: `[`ErrorCode`](../-error-code/index.md)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [errorCode](error-code.md) | `val errorCode: `[`ErrorCode`](../-error-code/index.md)`?` |
| [message](message.md) | `val message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
