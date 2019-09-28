[activeannoservice](../index.md) / [common](./index.md)

## Package common

### Exceptions

| Name | Summary |
|---|---|
| [AuthenticationException](-authentication-exception/index.md) | `class AuthenticationException : `[`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/index.html)<br>Custom exception indicating the user is not authenticated properly (missing / invalid auth token), will be used to return appropriate http error code |
| [AuthorizationException](-authorization-exception/index.md) | `class AuthorizationException : `[`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/index.html)<br>Custom exception indicating the user is not authorized properly (missing role), will be used to return appropriate http error code |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [com.auth0.jwt.interfaces.DecodedJWT](com.auth0.jwt.interfaces.-decoded-j-w-t/index.md) |  |
| [com.fasterxml.jackson.databind.node.ObjectNode](com.fasterxml.jackson.databind.node.-object-node/index.md) |  |
| [io.ktor.routing.Route](io.ktor.routing.-route/index.md) |  |
| [io.ktor.util.pipeline.PipelineContext](io.ktor.util.pipeline.-pipeline-context/index.md) |  |
| [kotlin.collections.MutableList](kotlin.collections.-mutable-list/index.md) |  |
| [org.litote.kmongo.coroutine.CoroutineDatabase](org.litote.kmongo.coroutine.-coroutine-database/index.md) |  |

### Functions

| Name | Summary |
|---|---|
| [isTokenStillValid](is-token-still-valid.md) | `suspend fun isTokenStillValid(client: HttpClient, jwt: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)<br>Validate JWT token, either accept the token as valid by configuration or call the configured authentication service |
| [jwtFromHeader](jwt-from-header.md) | `fun jwtFromHeader(call: ApplicationCall): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)<br>Extract the JWT Base64 string from the request header or throw [AuthenticationException](-authentication-exception/index.md) if missing |
