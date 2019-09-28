[activeannoservice](../../index.md) / [config](../index.md) / [ManageConfig](./index.md)

# ManageConfig

`data class ManageConfig`

View data class - all properties necessary to display and edit config from management perspective in frontend

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `ManageConfig(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "", priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, userRoles: `[`UserRoles`](../-user-roles/index.md)`, inputMapping: `[`InputMapping`](../-input-mapping/index.md)`, filter: `[`FilterCondition`](../-filter-condition/index.md)`?, sort: `[`Sort`](../-sort/index.md)`, annotations: `[`Annotations`](../-annotations/index.md)`, layout: `[`Layout`](../-layout/index.md)`, policy: `[`Policy`](../-policy/index.md)`, export: `[`Export`](../-export/index.md)`)`<br>View data class - all properties necessary to display and edit config from management perspective in frontend |

### Properties

| Name | Summary |
|---|---|
| [active](active.md) | `val active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [annotations](annotations.md) | `val annotations: `[`Annotations`](../-annotations/index.md) |
| [description](description.md) | `val description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [export](export.md) | `val export: `[`Export`](../-export/index.md) |
| [filter](filter.md) | `val filter: `[`FilterCondition`](../-filter-condition/index.md)`?` |
| [id](id.md) | `val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [inputMapping](input-mapping.md) | `val inputMapping: `[`InputMapping`](../-input-mapping/index.md) |
| [layout](layout.md) | `val layout: `[`Layout`](../-layout/index.md) |
| [name](name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [policy](policy.md) | `val policy: `[`Policy`](../-policy/index.md) |
| [priority](priority.md) | `val priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [sort](sort.md) | `val sort: `[`Sort`](../-sort/index.md) |
| [userRoles](user-roles.md) | `val userRoles: `[`UserRoles`](../-user-roles/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [toProjectConfig](../to-project-config.md) | `fun `[`ManageConfig`](./index.md)`.toProjectConfig(creator: `[`UserIdentifier`](../-user-identifier.md)`, creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis()): `[`ProjectConfig`](../-project-config/index.md) |
