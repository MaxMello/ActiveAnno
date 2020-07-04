[activeannoservice](../index.md) / [api.annotate.dto](index.md) / [toAnnotateProject](./to-annotate-project.md)

# toAnnotateProject

`suspend fun `[`Project`](../project/-project/index.md)`.toAnnotateProject(userIdentifier: `[`UserIdentifier`](../project.userroles/-user-identifier.md)`, userIsCurator: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false): `[`AnnotateProject`](-annotate-project/index.md)

Convert a [Project](../project/-project/index.md) to an [AnnotateProject](-annotate-project/index.md), doing some operations to enrich the project data to be able to use it
for annotation. For example, if an OpenTagAnnotation is present, this method might aggregate the existing values
from all documents of the project and add it to the AnnotateProject.

