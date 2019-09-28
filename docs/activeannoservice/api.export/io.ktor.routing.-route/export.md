[activeannoservice](../../index.md) / [api.export](../index.md) / [io.ktor.routing.Route](index.md) / [export](./export.md)

# export

`fun Route.export(applicationConfig: `[`ApplicationConfig`](../../application/-application-config/index.md)`, projectConfigDAO: `[`ProjectConfigDAO`](../../config/-project-config-d-a-o/index.md)`, documentDAO: `[`DocumentDAO`](../../document/-document-d-a-o/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

The export endpoints are not for the frontend, but defined by the REST export config, giving external services
the ability to read finished documents / annotations.

