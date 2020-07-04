[activeannoservice](../../index.md) / [api.annotate](../index.md) / [io.ktor.routing.Route](./index.md)

### Extensions for io.ktor.routing.Route

| Name | Summary |
|---|---|
| [annotate](annotate.md) | Annotate routes are used by the frontend for users that are annotators for a project. Therefore, it provides endpoints to get projects for annotation as well as documents, and endpoints to post the annotation results`fun Route.annotate(applicationConfig: `[`ApplicationConfig`](../../application/-application-config/index.md)`, userDAO: `[`UserDAO`](../../user/-user-d-a-o/index.md)`, projectDAO: `[`ProjectDAO`](../../project/-project-d-a-o/index.md)`, documentDAO: `[`DocumentDAO`](../../document/-document-d-a-o/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [curate](curate.md) | Curate routes are used by the frontend for users that are curators for a project. Therefore, it provides endpoints to get projects for curation as well as documents, and endpoints to post the annotation results`fun Route.curate(applicationConfig: `[`ApplicationConfig`](../../application/-application-config/index.md)`, userDAO: `[`UserDAO`](../../user/-user-d-a-o/index.md)`, projectDAO: `[`ProjectDAO`](../../project/-project-d-a-o/index.md)`, documentDAO: `[`DocumentDAO`](../../document/-document-d-a-o/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
