[activeannoservice](../index.md) / [project.export](./index.md)

## Package project.export

### Types

| Name | Summary |
|---|---|
| [Export](-export/index.md) | Export configuration for consuming the results of this service`data class Export` |
| [ExportDocument](-export-document/index.md) | `data class ExportDocument` |
| [ExportFormat](-export-format/index.md) | What aspects for the document and results to export`data class ExportFormat` |
| [OnOverwrittenFinalizedAnnotationBehavior](-on-overwritten-finalized-annotation-behavior/index.md) | Define behavior what to do when a finalizedAnnotation was defined, but a new one was set afterwards. This would not happen normally, but cannot be prevented for cases where an annotation is found via search to correct an earlier mistake. For this case, we need to define if we want to trigger web hooks again or not.`enum class OnOverwrittenFinalizedAnnotationBehavior` |
| [OnWebHookFailureBehavior](-on-web-hook-failure-behavior/index.md) | What to do when calling the WebHook failed`enum class OnWebHookFailureBehavior` |
| [RestAuthentication](-rest-authentication/index.md) | `sealed class RestAuthentication` |
| [RestConfig](-rest-config/index.md) | What REST endpoints to activate and how to export them`data class RestConfig` |
| [WebHookConfig](-web-hook-config/index.md) | `data class WebHookConfig` |

### Functions

| Name | Summary |
|---|---|
| [callWebHook](call-web-hook.md) | `suspend fun `[`WebHookConfig`](-web-hook-config/index.md)`.callWebHook(projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [checkWebHooks](check-web-hooks.md) | `suspend fun `[`Export`](-export/index.md)`.checkWebHooks(projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [convertDocument](convert-document.md) | `fun `[`ExportFormat`](-export-format/index.md)`.convertDocument(projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`, includeUsedProject: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, includeDocumentData: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, includeExportStatistics: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false): `[`ExportDocument`](-export-document/index.md) |
