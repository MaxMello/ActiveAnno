package application

import common.tryReadAsFileOrReturnValue
import io.ktor.application.ApplicationEnvironment
import io.ktor.util.KtorExperimentalAPI

/**
 * To have easy access to the configuration properties of the application, this class exists
 */
class ApplicationConfig() {

    lateinit var jwt: JwtConfiguration
    lateinit var cors: Cors
    lateinit var mongo: MongoConfig
    lateinit var ktorHttpsConfig: KtorHttpsConfig
    lateinit var featuresConfig: FeaturesConfig

    @KtorExperimentalAPI
    constructor(environment: ApplicationEnvironment) : this() {
        jwt = JwtConfiguration(
            useRoleProtection = environment.config.property("jwt.useRoleProtection").getString().toBoolean(),
            rolesKey = environment.config.property("jwt.rolesKey").getString(),
            roleAdmin = environment.config.property("jwt.role.admin").getString(),
            roleManager = environment.config.property("jwt.role.manager").getString(),
            roleUser = environment.config.property("jwt.role.user").getString(),
            roleProducer = environment.config.property("jwt.role.producer").getString(),
            roleConsumer = environment.config.property("jwt.role.consumer").getString(),
            roleGlobalSearch = environment.config.property("jwt.role.globalSearch").getString(),
            userIdentifierKey = environment.config.property("jwt.userIdentifierKey").getString(),
            userNameKey = environment.config.property("jwt.userNameKey").getString(),
            validation = JwtValidation(
                environment.config.property("jwt.validation.acceptAllTokens").getString().toBoolean(),
                environment.config.property("jwt.validation.url").getString()
            )
        )
        cors = Cors(environment.config.property("cors.hosts").getString().split(","))
        @Suppress("LongLine")
        mongo = MongoConfig(
            "mongodb://${environment.config.property("mongo.user").getString().tryReadAsFileOrReturnValue()}:${environment.config.property("mongo.password").getString().tryReadAsFileOrReturnValue()}@${environment.config.property(
                "mongo.connection"
            ).getString()}/?retryWrites=false", // Fix for standalone server wrong error message
            environment.config.property("mongo.databaseName").getString()
        )
        ktorHttpsConfig = KtorHttpsConfig(environment.config.property("ktor.https.redirect").getString().toBoolean())
        featuresConfig = FeaturesConfig(
            generateExampleProject = environment.config.property("features.generateExampleProject").getString().toBoolean()
        )
    }

    constructor(
        jwtConfiguration: JwtConfiguration, cors: Cors, mongoConfig: MongoConfig,
        ktorHttpsConfig: KtorHttpsConfig, featuresConfig: FeaturesConfig
    ) : this() {
        this.jwt = jwtConfiguration
        this.cors = cors
        this.mongo = mongoConfig
        this.ktorHttpsConfig = ktorHttpsConfig
        this.featuresConfig = featuresConfig
    }
}

/**
 * Data class representing the JTW configuration
 */
data class JwtConfiguration(
    val useRoleProtection: Boolean = true,
    val rolesKey: String = "roles",
    val roleAdmin: String = "activeanno_admin",
    val roleManager: String = "activeanno_manager",
    val roleUser: String = "activeanno_user",
    val roleProducer: String = "activeanno_producer",
    val roleConsumer: String = "activeanno_consumer",
    val roleGlobalSearch: String = "activeanno_global_search",
    val userIdentifierKey: String = "sub",
    val userNameKey: String = "name",
    val validation: JwtValidation
)

/**
 * Data class representing the JWT validation configuration
 */
data class JwtValidation(
    val acceptAllTokens: Boolean = true,
    val url: String
)

/**
 * Data class representing the CORS config
 */
data class Cors(
    val hosts: List<String>
)

/**
 * Data class representing the MongoDB config
 */
data class MongoConfig(
    val connectionString: String,
    val databaseName: String = "activeanno"
)

/**
 * Data class representing the HTTPS config for ktor
 */
data class KtorHttpsConfig(
    val redirect: Boolean = false
)

data class FeaturesConfig(
    val generateExampleProject: Boolean = false
)