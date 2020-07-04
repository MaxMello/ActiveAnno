[activeannoservice](../../index.md) / [common](../index.md) / [HttpAuthentication](./index.md)

# HttpAuthentication

`sealed class HttpAuthentication`

Inspiration: https://www.sparkpost.com/docs/tech-resources/webhook-authentication/

### Types

| Name | Summary |
|---|---|
| [ApplicationJwt](-application-jwt/index.md) | Authenticate by sending the application's JWT with the request`class ApplicationJwt : `[`HttpAuthentication`](./index.md) |
| [HttpBasicAuth](-http-basic-auth/index.md) | `data class HttpBasicAuth : `[`HttpAuthentication`](./index.md) |
| [None](-none/index.md) | `object None : `[`HttpAuthentication`](./index.md) |
| [OAuth2](-o-auth2/index.md) | `data class OAuth2 : `[`HttpAuthentication`](./index.md) |
