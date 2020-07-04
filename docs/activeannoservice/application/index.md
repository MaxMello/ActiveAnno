[activeannoservice](../index.md) / [application](./index.md)

## Package application

### Types

| Name | Summary |
|---|---|
| [ApplicationConfig](-application-config/index.md) | To have easy access to the configuration properties of the application, this class exists`class ApplicationConfig` |
| [Cors](-cors/index.md) | Data class representing the CORS config`data class Cors` |
| [FeaturesConfig](-features-config/index.md) | `data class FeaturesConfig` |
| [JwtConfiguration](-jwt-configuration/index.md) | Data class representing the JTW configuration`data class JwtConfiguration` |
| [JwtValidation](-jwt-validation/index.md) | Data class representing the JWT validation configuration`data class JwtValidation` |
| [KtorHttpsConfig](-ktor-https-config/index.md) | Data class representing the HTTPS config for ktor`data class KtorHttpsConfig` |
| [MongoConfig](-mongo-config/index.md) | Data class representing the MongoDB config`data class MongoConfig` |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [io.ktor.application.Application](io.ktor.application.-application/index.md) |  |

### Properties

| Name | Summary |
|---|---|
| [annotationDefinitionDAO](annotation-definition-d-a-o.md) | `lateinit var annotationDefinitionDAO: `[`AnnotationDefinitionDAO`](../annotationdefinition/-annotation-definition-d-a-o/index.md) |
| [annotationGeneratorDAO](annotation-generator-d-a-o.md) | `lateinit var annotationGeneratorDAO: `[`AnnotationGeneratorDAO`](../annotationdefinition.generator/-annotation-generator-d-a-o/index.md) |
| [applicationConfig](application-config.md) | Top level variable with access to Application config values`lateinit var applicationConfig: `[`ApplicationConfig`](-application-config/index.md) |
| [documentDAO](document-d-a-o.md) | `lateinit var documentDAO: `[`DocumentDAO`](../document/-document-d-a-o/index.md) |
| [httpClient](http-client.md) | Instance of HttpClient to make requests to other services / web hooks`lateinit var httpClient: HttpClient` |
| [jsonMapper](json-mapper.md) | Global instance of correctly configured json mapper`lateinit var jsonMapper: ObjectMapper` |
| [messageDAO](message-d-a-o.md) | `lateinit var messageDAO: `[`MessageDAO`](../user.message/-message-d-a-o/index.md) |
| [projectDAO](project-d-a-o.md) | `lateinit var projectDAO: `[`ProjectDAO`](../project/-project-d-a-o/index.md) |
| [userDAO](user-d-a-o.md) | `lateinit var userDAO: `[`UserDAO`](../user/-user-d-a-o/index.md) |

### Functions

| Name | Summary |
|---|---|
| [generateExampleProject](generate-example-project.md) | Generate an example project to show off the capabilities of ActiveAnno`fun generateExampleProject(applicationConfig: `[`ApplicationConfig`](-application-config/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [main](main.md) | Entry point into application`fun main(args: `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
