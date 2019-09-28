[activeannoservice](../../index.md) / [config](../index.md) / [ProjectConfig](./index.md)

# ProjectConfig

`data class ProjectConfig`

Complete model of a project configuration. This model represents the database structure / is stored in mongoDB

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `ProjectConfig(_id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "", creator: `[`UserIdentifier`](../-user-identifier.md)`, creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, userRoles: `[`UserRoles`](../-user-roles/index.md)`, inputMapping: `[`InputMapping`](../-input-mapping/index.md)`, filter: `[`FilterCondition`](../-filter-condition/index.md)`?, sort: `[`Sort`](../-sort/index.md)`, annotations: `[`Annotations`](../-annotations/index.md)`, layout: `[`Layout`](../-layout/index.md)`, policy: `[`Policy`](../-policy/index.md)`, export: `[`Export`](../-export/index.md)`)`<br>Complete model of a project configuration. This model represents the database structure / is stored in mongoDB |

### Properties

| Name | Summary |
|---|---|
| [_id](_id.md) | `var _id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)<br>DB id (auto-generated after storing / will be not-null when retrieved from DB) |
| [active](active.md) | `val active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)<br>Flag indicating if the config is active or not - only active configs will be used for annotation / curation. |
| [annotations](annotations.md) | `val annotations: `[`Annotations`](../-annotations/index.md) |
| [creationTimestamp](creation-timestamp.md) | `val creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [creator](creator.md) | `val creator: `[`UserIdentifier`](../-user-identifier.md)<br>Initial creator of the project config |
| [description](description.md) | `val description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)<br>Longer description of the project, can be displayed in the UI and should be useful for annotators to read. |
| [export](export.md) | `val export: `[`Export`](../-export/index.md) |
| [filter](filter.md) | `val filter: `[`FilterCondition`](../-filter-condition/index.md)`?`<br>If the filter is null, the Project is a one-off project and will use the config ID to filter documents with a matching restrictedConfig |
| [inputMapping](input-mapping.md) | `val inputMapping: `[`InputMapping`](../-input-mapping/index.md) |
| [layout](layout.md) | `val layout: `[`Layout`](../-layout/index.md) |
| [name](name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)<br>Short, descriptive name of project |
| [policy](policy.md) | `val policy: `[`Policy`](../-policy/index.md) |
| [priority](priority.md) | `val priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)<br>An integer value indicating the priority of the project - will be used to sort project configurations (higher = more important) |
| [sort](sort.md) | `val sort: `[`Sort`](../-sort/index.md) |
| [updateTimestamp](update-timestamp.md) | `val updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [userRoles](user-roles.md) | `val userRoles: `[`UserRoles`](../-user-roles/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [getFilterConditions](../get-filter-conditions.md) | `fun `[`ProjectConfig`](./index.md)`.getFilterConditions(): `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`FilterCondition`](../-filter-condition/index.md)`>`<br>Get the filterCondition to use for a [ProjectConfig](./index.md). If the config is null, it is treated as a restricted config and the ID will be used to filter for restrictedConfig from documents. Else, the method will make sure that no restricted document for another config will be accidentally included for this config. |
| [toAnnotateConfig](../to-annotate-config.md) | `suspend fun `[`ProjectConfig`](./index.md)`.toAnnotateConfig(): `[`AnnotateConfig`](../-annotate-config/index.md)<br>Convert a [ProjectConfig](./index.md) to an [AnnotateConfig](../-annotate-config/index.md), doing some operations to enrich the config data to be able to use it for annotation. For example, if an [OpenTagAnnotation](../-open-tag-annotation/index.md) is present, this method might aggregate the existing values from all documents of the config and add it to the annotation config. |
| [toListConfig](../to-list-config.md) | `fun `[`ProjectConfig`](./index.md)`.toListConfig(): `[`ListConfig`](../-list-config/index.md) |
| [toManageConfig](../to-manage-config.md) | `fun `[`ProjectConfig`](./index.md)`.toManageConfig(): `[`ManageConfig`](../-manage-config/index.md) |
