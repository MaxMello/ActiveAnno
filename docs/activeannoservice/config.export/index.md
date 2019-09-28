[activeannoservice](../index.md) / [config.export](./index.md)

## Package config.export

### Types

| Name | Summary |
|---|---|
| [Export](-export/index.md) | `data class Export`<br>Export configuration for consuming the results of this service |
| [ExportDocument](-export-document/index.md) | `data class ExportDocument` |
| [ExportFormat](-export-format/index.md) | `data class ExportFormat`<br>What aspects for the document and results to export |
| [OnOverwrittenFinalizedAnnotationBehavior](-on-overwritten-finalized-annotation-behavior/index.md) | `enum class OnOverwrittenFinalizedAnnotationBehavior`<br>Define behavior what to do when a finalizedAnnotation was defined, but a new one was set afterwards. This would not happen normally, but cannot be prevented for cases where an annotation is found via search to correct an earlier mistake. For this case, we need to define if we want to trigger web hooks again or not. |
| [OnWebHookFailureBehavior](-on-web-hook-failure-behavior/index.md) | `enum class OnWebHookFailureBehavior`<br>What to do when calling the WebHook failed |
| [RestAuthentication](-rest-authentication/index.md) | `sealed class RestAuthentication` |
| [RestConfig](-rest-config/index.md) | `data class RestConfig`<br>What REST endpoints to activate and how to export them |
| [WebHookAuthentication](-web-hook-authentication/index.md) | `sealed class WebHookAuthentication`<br>Inspiration: https://www.sparkpost.com/docs/tech-resources/webhook-authentication/ |
| [WebHookConfig](-web-hook-config/index.md) | `data class WebHookConfig` |

### Functions

| Name | Summary |
|---|---|
| [callWebHook](call-web-hook.md) | `suspend fun `[`WebHookConfig`](-web-hook-config/index.md)`.callWebHook(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [checkWebHooks](check-web-hooks.md) | `suspend fun `[`Export`](-export/index.md)`.checkWebHooks(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [convertDocument](convert-document.md) | `fun `[`ExportFormat`](-export-format/index.md)`.convertDocument(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`): `[`ExportDocument`](-export-document/index.md) |
