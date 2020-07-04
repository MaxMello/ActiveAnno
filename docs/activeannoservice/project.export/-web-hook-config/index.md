[activeannoservice](../../index.md) / [project.export](../index.md) / [WebHookConfig](./index.md)

# WebHookConfig

`data class WebHookConfig`

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `WebHookConfig(url: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, onFailure: `[`OnWebHookFailureBehavior`](../-on-web-hook-failure-behavior/index.md)` = OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER, exportFormat: `[`ExportFormat`](../-export-format/index.md)`, authentication: `[`HttpAuthentication`](../../common/-http-authentication/index.md)`)` |

### Properties

| Name | Summary |
|---|---|
| [authentication](authentication.md) | `val authentication: `[`HttpAuthentication`](../../common/-http-authentication/index.md) |
| [exportFormat](export-format.md) | `val exportFormat: `[`ExportFormat`](../-export-format/index.md) |
| [onFailure](on-failure.md) | `val onFailure: `[`OnWebHookFailureBehavior`](../-on-web-hook-failure-behavior/index.md) |
| [url](url.md) | List of web hook URLs where the results get sent`val url: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Extension Functions

| Name | Summary |
|---|---|
| [callWebHook](../call-web-hook.md) | `suspend fun `[`WebHookConfig`](./index.md)`.callWebHook(projectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
