[activeannoservice](../../index.md) / [api.search](../index.md) / [io.ktor.routing.Route](./index.md)

### Extensions for io.ktor.routing.Route

| Name | Summary |
|---|---|
| [search](search.md) | `fun Route.search(applicationConfig: `[`ApplicationConfig`](../../application/-application-config/index.md)`, userDAO: `[`UserDAO`](../../user/-user-d-a-o/index.md)`, projectConfigDAO: `[`ProjectConfigDAO`](../../config/-project-config-d-a-o/index.md)`, documentDAO: `[`DocumentDAO`](../../document/-document-d-a-o/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)<br>The search endpoint is available for all user roles, based on the role with limited scope of search. Searches are restricted to a list of configs with additional filter conditions that can be defined in the frontend. |
