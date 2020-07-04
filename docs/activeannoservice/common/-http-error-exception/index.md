[activeannoservice](../../index.md) / [common](../index.md) / [HttpErrorException](./index.md)

# HttpErrorException

`open class HttpErrorException : `[`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/index.html)

Base exception for HTTP errors, can optionally include a detailed http error

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Base exception for HTTP errors, can optionally include a detailed http error`HttpErrorException(message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "", errorCode: `[`ErrorCode`](../-error-code/index.md)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [errorCode](error-code.md) | `val errorCode: `[`ErrorCode`](../-error-code/index.md)`?` |

### Inheritors

| Name | Summary |
|---|---|
| [ForbiddenException](../-forbidden-exception/index.md) | Custom exception indicating the user is not authorized properly (missing role), will be used to return appropriate http error code`class ForbiddenException : `[`HttpErrorException`](./index.md) |
| [GoneException](../-gone-exception/index.md) | Exception indicating that a resource is gone, will be used through StatusPages feature to return the proper status code when this exception is thrown`class GoneException : `[`HttpErrorException`](./index.md) |
| [UnauthorizedException](../-unauthorized-exception/index.md) | Custom exception indicating the user is not authenticated properly (missing / invalid auth token), will be used to return appropriate http error code`class UnauthorizedException : `[`HttpErrorException`](./index.md) |
