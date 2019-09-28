[activeannoservice](../../index.md) / [api.import](../index.md) / [io.ktor.routing.Route](index.md) / [import](./import.md)

# import

`fun Route.import(applicationConfig: `[`ApplicationConfig`](../../application/-application-config/index.md)`, documentDAO: `[`DocumentDAO`](../../document/-document-d-a-o/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

Endpoints for other services (or users with the producer role, for cases where documents would be inserted via
a tool like curl or Postman) to import documents either as json objects or json arrays.

