[activeannoservice](../index.md) / [application](./index.md)

## Package application

### Types

| Name | Summary |
|---|---|
| [ApplicationConfig](-application-config/index.md) | `class ApplicationConfig`<br>To have easy access to the configuration properties of the application, this class exists |
| [Cors](-cors/index.md) | `data class Cors`<br>Data class representing the CORS config |
| [JwtConfiguration](-jwt-configuration/index.md) | `data class JwtConfiguration`<br>Data class representing the JTW configuration |
| [JwtValidation](-jwt-validation/index.md) | `data class JwtValidation`<br>Data class representing the JWT validation configuration |
| [KtorHttpsConfig](-ktor-https-config/index.md) | `data class KtorHttpsConfig`<br>Data class representing the HTTPS config for ktor |
| [LoggingConfig](-logging-config/index.md) | `data class LoggingConfig`<br>Data class representing the logging config |
| [MongoConfig](-mongo-config/index.md) | `data class MongoConfig`<br>Data class representing the MongoDB config |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [io.ktor.application.Application](io.ktor.application.-application/index.md) |  |

### Properties

| Name | Summary |
|---|---|
| [applicationConfig](application-config.md) | `lateinit var applicationConfig: `[`ApplicationConfig`](-application-config/index.md)<br>Top level variable with access to Application config values |
| [documentDAO](document-d-a-o.md) | `lateinit var documentDAO: `[`DocumentDAO`](../document/-document-d-a-o/index.md) |
| [httpClient](http-client.md) | `lateinit var httpClient: HttpClient`<br>Instance of HttpClient to make requests to other services / web hooks |
| [jsonMapper](json-mapper.md) | `lateinit var jsonMapper: ObjectMapper`<br>Global instance of correctly configured json mapper |
| [messageDAO](message-d-a-o.md) | `lateinit var messageDAO: `[`MessageDAO`](../user/-message-d-a-o/index.md) |
| [projectConfigDAO](project-config-d-a-o.md) | `lateinit var projectConfigDAO: `[`ProjectConfigDAO`](../config/-project-config-d-a-o/index.md) |
| [userDAO](user-d-a-o.md) | `lateinit var userDAO: `[`UserDAO`](../user/-user-d-a-o/index.md) |

### Functions

| Name | Summary |
|---|---|
| [generateExampleProject](generate-example-project.md) | `fun generateExampleProject(): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [main](main.md) | `fun main(args: `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)<br>Entry point into application |
