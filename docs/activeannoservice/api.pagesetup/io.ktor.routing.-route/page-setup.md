[activeannoservice](../../index.md) / [api.pagesetup](../index.md) / [io.ktor.routing.Route](index.md) / [pageSetup](./page-setup.md)

# pageSetup

`fun Route.pageSetup(applicationConfig: `[`ApplicationConfig`](../../application/-application-config/index.md)`, userDAO: `[`UserDAO`](../../user/-user-d-a-o/index.md)`, projectConfigDAO: `[`ProjectConfigDAO`](../../config/-project-config-d-a-o/index.md)`, documentDAO: `[`DocumentDAO`](../../document/-document-d-a-o/index.md)`, messageDAO: `[`MessageDAO`](../../user.message/-message-d-a-o/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

This route is used by the frontend to load the correct UI pages. It also serves as the endpoint to get the current
number of open tasks per page where applicable

* for annotate, the number of open documents to annotate for the user
* for curate, the number of open documents to curate for the user
* for messages, the number of unread messages
