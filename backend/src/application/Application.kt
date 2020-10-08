package application

import annotationdefinition.AnnotationDefinitionDAO
import annotationdefinition.generator.AnnotationGeneratorDAO
import api.admin.admin
import api.annotate.annotate
import api.annotate.curate
import api.export.export
import api.generators.generators
import api.import.import
import api.manage.manage
import api.pagesetup.pageSetup
import api.search.search
import com.auth0.jwt.exceptions.JWTDecodeException
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import common.*
import document.DocumentDAO
import document.updateIndexes
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.application.log
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.features.HttpTimeout
import io.ktor.client.features.defaultRequest
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.header
import io.ktor.features.*
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.request.path
import io.ktor.response.respond
import io.ktor.routing.route
import io.ktor.routing.routing
import io.ktor.util.KtorExperimentalAPI
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.litote.kmongo.coroutine.CoroutineClient
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.id.jackson.IdJacksonModule
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import project.ProjectDAO
import user.UserDAO
import user.message.MessageDAO
import java.util.concurrent.TimeUnit
import kotlin.random.Random

/**
 * Entry point into application
 */
fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)


/*
 * 'Global' variables
 * Normally, you would use a dependency injection mechanism to have access to those classes like the HttpClient and the DAOs
 * But as the size of the project is rather small, those objects are available as top level variables
 * By using the lateinit modifier, they can still be mocked in tests, in production, the Application.module will instantiate them
 */

/**
 * Top level variable with access to Application config values
 */
lateinit var applicationConfig: ApplicationConfig

/**
 * Instance of HttpClient to make requests to other services / web hooks
 */
lateinit var httpClient: HttpClient

/**
 * Global instance of correctly configured json mapper
 */
lateinit var jsonMapper: ObjectMapper

/*
 * DAOs
 */

lateinit var projectDAO: ProjectDAO
lateinit var documentDAO: DocumentDAO
lateinit var userDAO: UserDAO
lateinit var messageDAO: MessageDAO
lateinit var annotationDefinitionDAO: AnnotationDefinitionDAO
lateinit var annotationGeneratorDAO: AnnotationGeneratorDAO

private val logger = LoggerFactory.getLogger("Application")

/*
 * Application module
 */
@KtorExperimentalAPI
fun Application.module() {
    applicationConfig = ApplicationConfig(environment)

    val mongoClient: CoroutineClient by lazy {
        org.litote.kmongo.reactivestreams.KMongo.createClient(applicationConfig.mongo.connectionString).coroutine
    }
    val database: CoroutineDatabase by lazy {
        mongoClient.getDatabase(applicationConfig.mongo.databaseName)
    }

    documentDAO = DocumentDAO(database)
    projectDAO = ProjectDAO(database)
    userDAO = UserDAO(database)
    messageDAO = MessageDAO(database)
    annotationDefinitionDAO = AnnotationDefinitionDAO(database)
    annotationGeneratorDAO = AnnotationGeneratorDAO(database)

    if (applicationConfig.ktorHttpsConfig.redirect) {
        install(HttpsRedirect) {
            // The port to redirect to. By default 443, the default HTTPS port.
            sslPort = 443
            // 301 Moved Permanently, or 302 Found redirect.
            permanentRedirect = true
        }
    } else {
        logger.info("HTTPS redirect disabled")
    }

    setupApplication()

    generateExampleProject(applicationConfig)
    generateOffensEvalProject(applicationConfig)

    // Periodically update the dynamic indexes of the mongoDB
    launch(Dispatchers.IO) {
        while(true) {
            updateIndexes()
            delay(Random(42).nextLong(600_000, 1_200_000))    // Every 10 - 20 minutes
        }
    }
}

@KtorExperimentalAPI
fun Application.setupApplication() {

    // HttpClient to send requests to external services, for example for webhooks
    httpClient = HttpClient(CIO) {
        install(JsonFeature) {
            serializer = JacksonSerializer {
                    enable(SerializationFeature.INDENT_OUTPUT)
                    disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES)
                    disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                    enable(DeserializationFeature.READ_ENUMS_USING_TO_STRING)
                    disable(DeserializationFeature.READ_DATE_TIMESTAMPS_AS_NANOSECONDS)
                    enable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES) // "NULL" long should not be auto 0, instead explicitly 0 or fail
                    // KMongo type safe IDs
                    registerModule(IdJacksonModule())
                }
        }
        engine {
            maxConnectionsCount = 10000 // Maximum number of socket connections.
            endpoint.apply {
                maxConnectionsPerRoute = 1000 // Maximum number of requests for a specific endpoint route.
                pipelineMaxSize = 100 // Max number of opened endpoints.
                keepAliveTime = 5000 // Max number of milliseconds to keep each connection alive.
                connectTimeout = 5000 // Number of milliseconds to wait trying to connect to the server.
                requestTimeout = TimeUnit.HOURS.toMillis(1) // Set to 1 hour by default
                connectRetryAttempts = 3 // Maximum number of attempts for retrying a connection.
            }
        }
        install(HttpTimeout) {
            requestTimeoutMillis = 60_000
        }
        defaultRequest {
            // if we have a correlation id add it to outgoing requests - useful for tracking requests through multiple services
            MDC.get("X-Request-ID")?.also {
                header("X-Correlation-ID", it)
            }
        }
    }

    install(Compression) {
        gzip {
            priority = 1.0
        }
        deflate {
            priority = 10.0
            minimumSize(1024) // condition
        }
    }

    install(CallLogging) {
        filter { call -> call.request.path().startsWith("/") }
    }

    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Head)
        method(HttpMethod.Put)
        method(HttpMethod.Get)
        method(HttpMethod.Post)
        method(HttpMethod.Delete)
        header(HttpHeaders.AccessControlAllowHeaders)
        header(HttpHeaders.AccessControlAllowOrigin)
        header(HttpHeaders.AccessControlRequestHeaders)
        header(HttpHeaders.AccessControlRequestMethod)
        header(HttpHeaders.ContentType)
        header(HttpHeaders.Authorization)
        header(HttpHeaders.Origin)
        header(HttpHeaders.Pragma)
        header(HttpHeaders.UserAgent)
        header(HttpHeaders.Referrer)
        header(HttpHeaders.Connection)
        allowCredentials = true
        applicationConfig.cors.hosts.forEach { host ->
            host(host, listOf("http", "https"))
        }
    }

    install(HSTS) {
        includeSubDomains = true
    }

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
            disable(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES)
            disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            enable(DeserializationFeature.READ_ENUMS_USING_TO_STRING)
            disable(DeserializationFeature.READ_DATE_TIMESTAMPS_AS_NANOSECONDS)
            enable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES) // "NULL" long should not be auto 0, instead explicitly 0 or fail
            // KMongo type safe IDs
            registerModule(IdJacksonModule())
            jsonMapper = this
        }
    }

    install(StatusPages) {
        exception<JWTDecodeException> { cause ->
            log.error("JWTDecodeException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.Unauthorized, HttpErrorResponse("Unauthorized", ErrorCode.UNAUTHORIZED_JWT_INVALID))
        }
        exception<UnauthorizedException> { cause ->
            log.error("AuthenticationException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.Unauthorized, HttpErrorResponse("Unauthorized", cause.errorCode))
        }
        exception<ForbiddenException> { cause ->
            log.error("AuthorizationException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.Forbidden, HttpErrorResponse("Forbidden", cause.errorCode))
        }
        exception<NotFoundException> { cause ->
            log.error("NotFoundException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.NotFound, HttpErrorResponse("Not Found"))
        }
        exception<GoneException> { cause ->
            log.error("GoneException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.Gone, HttpErrorResponse("Gone", cause.errorCode))
        }
        exception<BadRequestException> { cause ->
            log.error("BadRequestException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.BadRequest, HttpErrorResponse("Bad Request"))
        }
        exception<IllegalArgumentException> { cause ->
            log.error("IllegalArgumentException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.BadRequest, HttpErrorResponse("Bad Request"))
        }
        exception<Throwable> { cause ->
            log.error("Exception handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.InternalServerError, HttpErrorResponse("Internal Server Error"))
        }
    }

    routing {
        route("/api/v1/") {
            pageSetup(applicationConfig, userDAO, projectDAO, documentDAO, messageDAO)

            annotate(applicationConfig, userDAO, projectDAO, documentDAO)
            curate(applicationConfig, userDAO, projectDAO, documentDAO)
            manage(applicationConfig, userDAO, projectDAO, documentDAO, annotationDefinitionDAO, annotationGeneratorDAO)
            admin(applicationConfig, documentDAO)
            search(applicationConfig, userDAO, projectDAO, documentDAO)

            import(applicationConfig, documentDAO)
            export(applicationConfig, projectDAO, documentDAO)

            generators(applicationConfig, projectDAO, documentDAO)
        }
    }
}