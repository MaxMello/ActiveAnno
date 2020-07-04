[activeannoservice](../index.md) / [api.manage.dto](./index.md)

## Package api.manage.dto

### Types

| Name | Summary |
|---|---|
| [ManageListProject](-manage-list-project/index.md) | View data class - all properties necessary to display project in list in the frontend for managers`data class ManageListProject` |
| [ManageProject](-manage-project/index.md) | View data class - all properties necessary to display and edit project from management perspective in frontend`data class ManageProject` |

### Functions

| Name | Summary |
|---|---|
| [toManageListProject](to-manage-list-project.md) | Convert a [Project](../project/-project/index.md) to a [ManageListProject](-manage-list-project/index.md)`fun `[`Project`](../project/-project/index.md)`.toManageListProject(): `[`ManageListProject`](-manage-list-project/index.md) |
| [toManageProject](to-manage-project.md) | Convert a [Project](../project/-project/index.md) to a [ManageProject](-manage-project/index.md)`fun `[`Project`](../project/-project/index.md)`.toManageProject(): `[`ManageProject`](-manage-project/index.md) |
| [toProject](to-project.md) | Convert a [ManageProject](-manage-project/index.md) to a [Project](../project/-project/index.md)`fun `[`ManageProject`](-manage-project/index.md)`.toProject(creator: `[`UserIdentifier`](../project.userroles/-user-identifier.md)`, creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis()): `[`Project`](../project/-project/index.md) |
