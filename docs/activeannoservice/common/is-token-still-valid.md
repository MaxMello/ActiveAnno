[activeannoservice](../index.md) / [common](index.md) / [isTokenStillValid](./is-token-still-valid.md)

# isTokenStillValid

`suspend fun isTokenStillValid(client: HttpClient, jwt: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)

Validate JWT token, either accept the token as valid by configuration or call the configured
authentication service

