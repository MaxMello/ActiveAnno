[activeannoservice](../index.md) / [common](./index.md)

## Package common

### Types

| Name | Summary |
|---|---|
| [ErrorCode](-error-code/index.md) | Enum representing detailed errors which are more granular than just the http status code`enum class ErrorCode` |
| [HttpAuthentication](-http-authentication/index.md) | Inspiration: https://www.sparkpost.com/docs/tech-resources/webhook-authentication/`sealed class HttpAuthentication` |
| [HttpErrorResponse](-http-error-response/index.md) | Data class to return on an http error, which can have a more detailed [errorCode](-http-error-response/error-code.md) explaining the reason for the status code`data class HttpErrorResponse` |

### Exceptions

| Name | Summary |
|---|---|
| [ForbiddenException](-forbidden-exception/index.md) | Custom exception indicating the user is not authorized properly (missing role), will be used to return appropriate http error code`class ForbiddenException : `[`HttpErrorException`](-http-error-exception/index.md) |
| [GoneException](-gone-exception/index.md) | Exception indicating that a resource is gone, will be used through StatusPages feature to return the proper status code when this exception is thrown`class GoneException : `[`HttpErrorException`](-http-error-exception/index.md) |
| [HttpErrorException](-http-error-exception/index.md) | Base exception for HTTP errors, can optionally include a detailed http error`open class HttpErrorException : `[`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/index.html) |
| [UnauthorizedException](-unauthorized-exception/index.md) | Custom exception indicating the user is not authenticated properly (missing / invalid auth token), will be used to return appropriate http error code`class UnauthorizedException : `[`HttpErrorException`](-http-error-exception/index.md) |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [com.auth0.jwt.interfaces.DecodedJWT](com.auth0.jwt.interfaces.-decoded-j-w-t/index.md) |  |
| [com.fasterxml.jackson.databind.JsonNode](com.fasterxml.jackson.databind.-json-node/index.md) |  |
| [com.fasterxml.jackson.databind.node.ObjectNode](com.fasterxml.jackson.databind.node.-object-node/index.md) |  |
| [io.ktor.application.ApplicationCall](io.ktor.application.-application-call/index.md) |  |
| [io.ktor.client.request.HttpRequestBuilder](io.ktor.client.request.-http-request-builder/index.md) |  |
| [io.ktor.routing.Route](io.ktor.routing.-route/index.md) |  |
| [io.ktor.util.pipeline.PipelineContext](io.ktor.util.pipeline.-pipeline-context/index.md) |  |
| [kotlin.Any](kotlin.-any/index.md) |  |
| [kotlin.collections.Iterable](kotlin.collections.-iterable/index.md) |  |
| [kotlin.collections.MutableList](kotlin.collections.-mutable-list/index.md) |  |
| [kotlin.collections.MutableMap](kotlin.collections.-mutable-map/index.md) |  |
| [kotlin.Double](kotlin.-double/index.md) |  |
| [kotlin.String](kotlin.-string/index.md) |  |
| [org.litote.kmongo.coroutine.CoroutineDatabase](org.litote.kmongo.coroutine.-coroutine-database/index.md) |  |

### Functions

| Name | Summary |
|---|---|
| [getMessageString](get-message-string.md) | Given a message [key](get-message-string.md#common$getMessageString(kotlin.String, java.util.Locale)/key) and optionally a [locale](get-message-string.md#common$getMessageString(kotlin.String, java.util.Locale)/locale), return the message string. If the locale is missing, use the default locale (english)`fun getMessageString(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`? = null): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [isTokenStillValid](is-token-still-valid.md) | Validate JWT token, either accept the token as valid by configuration or call the configured authentication service`suspend fun isTokenStillValid(client: HttpClient, jwt: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [jwtFromHeader](jwt-from-header.md) | Extract the JWT Base64 string from the request header or throw [UnauthorizedException](-unauthorized-exception/index.md) if missing`fun jwtFromHeader(call: ApplicationCall): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [measureTimeMillis](measure-time-millis.md) | Higher order helper function to measure and log the execution time of the passed [function](measure-time-millis.md#common$measureTimeMillis(kotlin.Function1((kotlin.Long, kotlin.Unit)), kotlin.Function0((common.measureTimeMillis.T)))/function) while returning the result of the [function](measure-time-millis.md#common$measureTimeMillis(kotlin.Function1((kotlin.Long, kotlin.Unit)), kotlin.Function0((common.measureTimeMillis.T)))/function)`fun <T> measureTimeMillis(loggingFunction: (`[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`) -> `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)`, function: () -> T): T` |
| [validateRole](validate-role.md) | Top level function to validate the roles for a JWT`fun validateRole(jwt: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, requiredRoles: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>, onlyOneMustMatch: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
