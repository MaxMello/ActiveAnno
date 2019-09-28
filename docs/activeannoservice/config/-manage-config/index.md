[activeannoservice](../../index.md) / [config](../index.md) / [ManageConfig](./index.md)

# ManageConfig

`data class ManageConfig`

View data class - all properties necessary to display and edit config from management perspective in frontend

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `ManageConfig(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "", priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, userRoles: `[`UserRoles`](../../config.userroles/-user-roles/index.md)`, inputMapping: `[`InputMapping`](../../config.inputmapping/-input-mapping/index.md)`, filter: `[`FilterCondition`](../../config.filter/-filter-condition/index.md)`?, sort: `[`Sort`](../../config.sort/-sort/index.md)`, annotations: `[`Annotations`](../../config.annotations/-annotations/index.md)`, layout: `[`Layout`](../../config.layout/-layout/index.md)`, policy: `[`Policy`](../../config.policy/-policy/index.md)`, export: `[`Export`](../../config.export/-export/index.md)`)`<br>View data class - all properties necessary to display and edit config from management perspective in frontend |

### Properties

| Name | Summary |
|---|---|
| [active](active.md) | `val active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [annotations](annotations.md) | `val annotations: `[`Annotations`](../../config.annotations/-annotations/index.md) |
| [description](description.md) | `val description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [export](export.md) | `val export: `[`Export`](../../config.export/-export/index.md) |
| [filter](filter.md) | `val filter: `[`FilterCondition`](../../config.filter/-filter-condition/index.md)`?` |
| [id](id.md) | `val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [inputMapping](input-mapping.md) | `val inputMapping: `[`InputMapping`](../../config.inputmapping/-input-mapping/index.md) |
| [layout](layout.md) | `val layout: `[`Layout`](../../config.layout/-layout/index.md) |
| [name](name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [policy](policy.md) | `val policy: `[`Policy`](../../config.policy/-policy/index.md) |
| [priority](priority.md) | `val priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [sort](sort.md) | `val sort: `[`Sort`](../../config.sort/-sort/index.md) |
| [userRoles](user-roles.md) | `val userRoles: `[`UserRoles`](../../config.userroles/-user-roles/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [toProjectConfig](../to-project-config.md) | `fun `[`ManageConfig`](./index.md)`.toProjectConfig(creator: `[`UserIdentifier`](../../config.userroles/-user-identifier.md)`, creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis()): `[`ProjectConfig`](../-project-config/index.md) |
