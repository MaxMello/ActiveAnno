[activeannoservice](../../index.md) / [config](../index.md) / [WebHookConfig](./index.md)

# WebHookConfig

`data class WebHookConfig`

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `WebHookConfig(url: `[`URL`](https://docs.oracle.com/javase/6/docs/api/java/net/URL.html)`, onFailure: `[`OnWebHookFailureBehavior`](../-on-web-hook-failure-behavior/index.md)` = OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER, exportFormat: `[`ExportFormat`](../-export-format/index.md)`, authentication: `[`WebHookAuthentication`](../-web-hook-authentication/index.md)`)` |

### Properties

| Name | Summary |
|---|---|
| [authentication](authentication.md) | `val authentication: `[`WebHookAuthentication`](../-web-hook-authentication/index.md) |
| [exportFormat](export-format.md) | `val exportFormat: `[`ExportFormat`](../-export-format/index.md) |
| [onFailure](on-failure.md) | `val onFailure: `[`OnWebHookFailureBehavior`](../-on-web-hook-failure-behavior/index.md) |
| [url](url.md) | `val url: `[`URL`](https://docs.oracle.com/javase/6/docs/api/java/net/URL.html)<br>List of web hook URLs where the results get sent |

### Extension Functions

| Name | Summary |
|---|---|
| [callWebHook](../call-web-hook.md) | `suspend fun `[`WebHookConfig`](./index.md)`.callWebHook(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
