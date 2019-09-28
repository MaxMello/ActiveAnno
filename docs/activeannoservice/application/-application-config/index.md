[activeannoservice](../../index.md) / [application](../index.md) / [ApplicationConfig](./index.md)

# ApplicationConfig

`class ApplicationConfig`

To have easy access to the configuration properties of the application, this class exists

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `ApplicationConfig(environment: ApplicationEnvironment)`<br>`ApplicationConfig(jwtConfiguration: `[`JwtConfiguration`](../-jwt-configuration/index.md)`, cors: `[`Cors`](../-cors/index.md)`, mongoConfig: `[`MongoConfig`](../-mongo-config/index.md)`, ktorHttpsConfig: `[`KtorHttpsConfig`](../-ktor-https-config/index.md)`, loggingConfig: `[`LoggingConfig`](../-logging-config/index.md)`, generateExampleProject: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`)``ApplicationConfig()`<br>To have easy access to the configuration properties of the application, this class exists |

### Properties

| Name | Summary |
|---|---|
| [cors](cors.md) | `lateinit var cors: `[`Cors`](../-cors/index.md) |
| [generateExampleProject](generate-example-project.md) | `var generateExampleProject: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [jwt](jwt.md) | `lateinit var jwt: `[`JwtConfiguration`](../-jwt-configuration/index.md) |
| [ktorHttpsConfig](ktor-https-config.md) | `lateinit var ktorHttpsConfig: `[`KtorHttpsConfig`](../-ktor-https-config/index.md) |
| [loggingConfig](logging-config.md) | `lateinit var loggingConfig: `[`LoggingConfig`](../-logging-config/index.md) |
| [mongo](mongo.md) | `lateinit var mongo: `[`MongoConfig`](../-mongo-config/index.md) |
