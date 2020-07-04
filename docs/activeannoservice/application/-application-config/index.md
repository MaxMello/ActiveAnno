[activeannoservice](../../index.md) / [application](../index.md) / [ApplicationConfig](./index.md)

# ApplicationConfig

`class ApplicationConfig`

To have easy access to the configuration properties of the application, this class exists

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `ApplicationConfig(environment: ApplicationEnvironment)`<br>`ApplicationConfig(jwtConfiguration: `[`JwtConfiguration`](../-jwt-configuration/index.md)`, cors: `[`Cors`](../-cors/index.md)`, mongoConfig: `[`MongoConfig`](../-mongo-config/index.md)`, ktorHttpsConfig: `[`KtorHttpsConfig`](../-ktor-https-config/index.md)`, featuresConfig: `[`FeaturesConfig`](../-features-config/index.md)`)`<br>To have easy access to the configuration properties of the application, this class exists`ApplicationConfig()` |

### Properties

| Name | Summary |
|---|---|
| [cors](cors.md) | `lateinit var cors: `[`Cors`](../-cors/index.md) |
| [featuresConfig](features-config.md) | `lateinit var featuresConfig: `[`FeaturesConfig`](../-features-config/index.md) |
| [jwt](jwt.md) | `lateinit var jwt: `[`JwtConfiguration`](../-jwt-configuration/index.md) |
| [ktorHttpsConfig](ktor-https-config.md) | `lateinit var ktorHttpsConfig: `[`KtorHttpsConfig`](../-ktor-https-config/index.md) |
| [mongo](mongo.md) | `lateinit var mongo: `[`MongoConfig`](../-mongo-config/index.md) |
