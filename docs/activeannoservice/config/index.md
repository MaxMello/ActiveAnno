[activeannoservice](../index.md) / [config](./index.md)

## Package config

### Types

| Name | Summary |
|---|---|
| [AnnotateConfig](-annotate-config/index.md) | `data class AnnotateConfig`<br>View data class - all properties relevant to annotate / curate a config in the frontend |
| [ConfigValidationError](-config-validation-error/index.md) | `data class ConfigValidationError`<br>A single validation error for a specific key of the [ManageConfig](-manage-config/index.md) |
| [ConfigValidationResult](-config-validation-result/index.md) | `data class ConfigValidationResult`<br>Data class wrapping the map of [ConfigValidationError](-config-validation-error/index.md)s |
| [ListConfig](-list-config/index.md) | `data class ListConfig`<br>View data class - all properties necessary to display config in list in the frontend |
| [ManageConfig](-manage-config/index.md) | `data class ManageConfig`<br>View data class - all properties necessary to display and edit config from management perspective in frontend |
| [ProjectConfig](-project-config/index.md) | `data class ProjectConfig`<br>Complete model of a project configuration. This model represents the database structure / is stored in mongoDB |
| [ProjectConfigDAO](-project-config-d-a-o/index.md) | `class ProjectConfigDAO`<br>DAO for the [ProjectConfig](-project-config/index.md) regulating access to the config collection |

### Functions

| Name | Summary |
|---|---|
| [getFilterConditions](get-filter-conditions.md) | `fun `[`ProjectConfig`](-project-config/index.md)`.getFilterConditions(): `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`FilterCondition`](../config.filter/-filter-condition/index.md)`>`<br>Get the filterCondition to use for a [ProjectConfig](-project-config/index.md). If the config is null, it is treated as a restricted config and the ID will be used to filter for restrictedConfig from documents. Else, the method will make sure that no restricted document for another config will be accidentally included for this config. |
| [toAnnotateConfig](to-annotate-config.md) | `suspend fun `[`ProjectConfig`](-project-config/index.md)`.toAnnotateConfig(): `[`AnnotateConfig`](-annotate-config/index.md)<br>Convert a [ProjectConfig](-project-config/index.md) to an [AnnotateConfig](-annotate-config/index.md), doing some operations to enrich the config data to be able to use it for annotation. For example, if an [OpenTagAnnotation](../config.annotations/-open-tag-annotation/index.md) is present, this method might aggregate the existing values from all documents of the config and add it to the annotation config. |
| [toListConfig](to-list-config.md) | `fun `[`ProjectConfig`](-project-config/index.md)`.toListConfig(): `[`ListConfig`](-list-config/index.md) |
| [toManageConfig](to-manage-config.md) | `fun `[`ProjectConfig`](-project-config/index.md)`.toManageConfig(): `[`ManageConfig`](-manage-config/index.md) |
| [toProjectConfig](to-project-config.md) | `fun `[`ManageConfig`](-manage-config/index.md)`.toProjectConfig(creator: `[`UserIdentifier`](../config.userroles/-user-identifier.md)`, creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis()): `[`ProjectConfig`](-project-config/index.md) |
| [validateManageConfig](validate-manage-config.md) | `fun validateManageConfig(config: ObjectNode): `[`ConfigValidationResult`](-config-validation-result/index.md)<br>Validate a config, using a [ObjectNode](#) format to be able to check every necessary field even when a automatic mapping to [ManageConfig](-manage-config/index.md) would fail. |
