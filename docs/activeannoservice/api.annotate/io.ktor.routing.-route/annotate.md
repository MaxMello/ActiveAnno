[activeannoservice](../../index.md) / [api.annotate](../index.md) / [io.ktor.routing.Route](index.md) / [annotate](./annotate.md)

# annotate

`fun Route.annotate(applicationConfig: `[`ApplicationConfig`](../../application/-application-config/index.md)`, userDAO: `[`UserDAO`](../../user/-user-d-a-o/index.md)`, projectDAO: `[`ProjectDAO`](../../project/-project-d-a-o/index.md)`, documentDAO: `[`DocumentDAO`](../../document/-document-d-a-o/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

Annotate routes are used by the frontend for users that are annotators for a project. Therefore, it provides
endpoints to get projects for annotation as well as documents, and endpoints to post the annotation results

