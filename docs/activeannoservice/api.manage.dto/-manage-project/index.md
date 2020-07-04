[activeannoservice](../../index.md) / [api.manage.dto](../index.md) / [ManageProject](./index.md)

# ManageProject

`data class ManageProject`

View data class - all properties necessary to display and edit project from management perspective in frontend

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | View data class - all properties necessary to display and edit project from management perspective in frontend`ManageProject(id: `[`ProjectID`](../../project/-project-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "", priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, userRoles: `[`UserRoles`](../../project.userroles/-user-roles/index.md)`, inputMapping: `[`InputMapping`](../../project.inputmapping/-input-mapping/index.md)`, filter: `[`FilterCondition`](../../project.filter/-filter-condition/index.md)`?, sort: `[`Sort`](../../project.sort/-sort/index.md)`, selection: `[`DocumentSelection`](../../project.selection/-document-selection/index.md)`, annotationSchema: `[`AnnotationSchema`](../../project.annotationschema/-annotation-schema/index.md)`, layout: `[`Layout`](../../project.layout/-layout/index.md)`, policy: `[`Policy`](../../project.policy/-policy/index.md)`, export: `[`Export`](../../project.export/-export/index.md)`, createProjectSpecificIndexes: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`)` |

### Properties

| Name | Summary |
|---|---|
| [active](active.md) | `val active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [annotationSchema](annotation-schema.md) | `val annotationSchema: `[`AnnotationSchema`](../../project.annotationschema/-annotation-schema/index.md) |
| [createProjectSpecificIndexes](create-project-specific-indexes.md) | `val createProjectSpecificIndexes: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [description](description.md) | `val description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [export](export.md) | `val export: `[`Export`](../../project.export/-export/index.md) |
| [filter](filter.md) | `val filter: `[`FilterCondition`](../../project.filter/-filter-condition/index.md)`?` |
| [id](id.md) | `val id: `[`ProjectID`](../../project/-project-i-d.md) |
| [inputMapping](input-mapping.md) | `val inputMapping: `[`InputMapping`](../../project.inputmapping/-input-mapping/index.md) |
| [layout](layout.md) | `val layout: `[`Layout`](../../project.layout/-layout/index.md) |
| [name](name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [policy](policy.md) | `val policy: `[`Policy`](../../project.policy/-policy/index.md) |
| [priority](priority.md) | `val priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [selection](selection.md) | `val selection: `[`DocumentSelection`](../../project.selection/-document-selection/index.md) |
| [sort](sort.md) | `val sort: `[`Sort`](../../project.sort/-sort/index.md) |
| [userRoles](user-roles.md) | `val userRoles: `[`UserRoles`](../../project.userroles/-user-roles/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [toProject](../to-project.md) | Convert a [ManageProject](./index.md) to a [Project](../../project/-project/index.md)`fun `[`ManageProject`](./index.md)`.toProject(creator: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis()): `[`Project`](../../project/-project/index.md) |
