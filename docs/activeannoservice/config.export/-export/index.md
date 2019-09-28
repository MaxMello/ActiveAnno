[activeannoservice](../../index.md) / [config.export](../index.md) / [Export](./index.md)

# Export

`data class Export`

Export configuration for consuming the results of this service

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `Export(webHooks: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`WebHookConfig`](../-web-hook-config/index.md)`>, rest: `[`RestConfig`](../-rest-config/index.md)`?, onOverwrittenFinalizedAnnotationBehavior: `[`OnOverwrittenFinalizedAnnotationBehavior`](../-on-overwritten-finalized-annotation-behavior/index.md)` = OnOverwrittenFinalizedAnnotationBehavior.TRIGGER_EXPORT_AGAIN)`<br>Export configuration for consuming the results of this service |

### Properties

| Name | Summary |
|---|---|
| [onOverwrittenFinalizedAnnotationBehavior](on-overwritten-finalized-annotation-behavior.md) | `val onOverwrittenFinalizedAnnotationBehavior: `[`OnOverwrittenFinalizedAnnotationBehavior`](../-on-overwritten-finalized-annotation-behavior/index.md) |
| [rest](rest.md) | `val rest: `[`RestConfig`](../-rest-config/index.md)`?` |
| [webHooks](web-hooks.md) | `val webHooks: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`WebHookConfig`](../-web-hook-config/index.md)`>` |

### Extension Functions

| Name | Summary |
|---|---|
| [checkWebHooks](../check-web-hooks.md) | `suspend fun `[`Export`](./index.md)`.checkWebHooks(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
