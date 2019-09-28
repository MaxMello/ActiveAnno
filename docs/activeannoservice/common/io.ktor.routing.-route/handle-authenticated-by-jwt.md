[activeannoservice](../../index.md) / [common](../index.md) / [io.ktor.routing.Route](index.md) / [handleAuthenticatedByJwt](./handle-authenticated-by-jwt.md)

# handleAuthenticatedByJwt

`fun Route.handleAuthenticatedByJwt(requiredRoles: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`> = listOf(), onlyOneMustMatch: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, body: PipelineInterceptor<`[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)`, ApplicationCall>): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

Higher order function to handle a request secured by a JWT

