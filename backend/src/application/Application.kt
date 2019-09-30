package application

import api.admin.admin
import api.annotate.annotate
import api.curate.curate
import api.export.export
import api.import.import
import api.manage.manage
import api.pagesetup.pageSetup
import api.search.search
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import common.AuthenticationException
import common.AuthorizationException
import config.*
import config.annotations.*
import config.export.*
import config.inputmapping.DocumentText
import config.inputmapping.InputMapping
import config.inputmapping.MetaData
import config.layout.*
import config.policy.FinalizeAnnotationPolicy
import config.policy.Policy
import config.sort.Order
import config.sort.Sort
import config.sort.SortElement
import config.userroles.UserRoles
import document.DocumentDAO
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.application.log
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
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
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.coroutine.CoroutineClient
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.coroutine.coroutine
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import org.slf4j.event.Level
import user.message.MessageDAO
import user.UserDAO


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

lateinit var projectConfigDAO: ProjectConfigDAO
lateinit var documentDAO: DocumentDAO
lateinit var userDAO: UserDAO
lateinit var messageDAO: MessageDAO

private val logger = LoggerFactory.getLogger("Application")

/*
 * Application module
 */

@KtorExperimentalAPI
fun Application.module() {
    applicationConfig = ApplicationConfig(environment)

    val mongoClient: CoroutineClient by lazy {
        org.litote.kmongo.reactivestreams.KMongo.createClient(applicationConfig.mongo.connectionString)
            .coroutine
    }
    val database: CoroutineDatabase by lazy {
        mongoClient.getDatabase(applicationConfig.mongo.databaseName)
    }

    documentDAO = DocumentDAO(database)
    projectConfigDAO = ProjectConfigDAO(database)
    userDAO = UserDAO(database)
    messageDAO = MessageDAO(database)

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
    generateExampleProject()
}

@KtorExperimentalAPI
fun Application.setupApplication() {

    httpClient = HttpClient(CIO) {
        install(JsonFeature) {
            serializer = JacksonSerializer()
        }
        engine {
            maxConnectionsCount = 1000 // Maximum number of socket connections.
            endpoint.apply {
                maxConnectionsPerRoute = 100 // Maximum number of requests for a specific endpoint route.
                pipelineMaxSize = 20 // Max number of opened endpoints.
                keepAliveTime = 5000 // Max number of milliseconds to keep each connection alive.
                connectTimeout = 5000 // Number of milliseconds to wait trying to connect to the server.
                connectRetryAttempts = 5 // Maximum number of attempts for retrying a connection.
            }
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
        level = Level.valueOf(applicationConfig.loggingConfig.level)
        filter { call -> call.request.path().startsWith("/") }
    }

    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Head)
        method(HttpMethod.Put)
        method(HttpMethod.Get)
        method(HttpMethod.Post)
        method(HttpMethod.Delete)
        header(HttpHeaders.ContentType)
        header(HttpHeaders.Authorization)
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
            jsonMapper = this
        }
    }

    routing {
        route("/api/v1/") {
            pageSetup(applicationConfig, userDAO, projectConfigDAO, documentDAO, messageDAO)

            annotate(applicationConfig, userDAO, projectConfigDAO, documentDAO)
            curate(applicationConfig, userDAO, projectConfigDAO, documentDAO)
            manage(applicationConfig, userDAO, projectConfigDAO, documentDAO)
            admin(applicationConfig, documentDAO)
            search(applicationConfig, userDAO, projectConfigDAO, documentDAO)

            import(applicationConfig, documentDAO)
            export(applicationConfig, projectConfigDAO, documentDAO)
        }
    }

    install(StatusPages) {
        exception<AuthenticationException> { cause ->
            log.error("AuthenticationException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.Unauthorized, cause.message ?: "Unauthorized")
        }
        exception<AuthorizationException> { cause ->
            log.error("AuthorizationException handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.Forbidden, cause.message ?: "Forbidden")
        }
        exception<Throwable> { cause ->
            log.error("Exception handling ${this.context.request.path()} with cause", cause)
            call.respond(HttpStatusCode.InternalServerError)
        }
    }

}

@KtorExperimentalAPI
fun generateExampleProject() {
    logger.info("Check generateExampleProject=${applicationConfig.generateExampleProject}")
    if (applicationConfig.generateExampleProject) {
        runBlocking {
            try {
                val project = projectConfigDAO.getConfigById("EXAMPLE_PROJECT_APP_REVIEWS")
                logger.info("Example project already exists: $project")
            } catch (e: NotFoundException) {
                logger.info("Create example project")
                val exampleProject = ProjectConfig(
                    "EXAMPLE_PROJECT_APP_REVIEWS",
                    "Example project: App reviews",
                    "This is an automatically generated example project. It shows of the different capabilities of ActiveAnno. " +
                            "The setup is based on the Paper 'How Do Users Like this Feature? A Fine Grained Sentiment Analysis of App Reviews' " +
                            "by Guzman and Maalej. The differences to the paper setup is, that sentiment is assigned here on a document level, " +
                            "not on a per-feature level. Also, we additionally ask to label the review for spam / no spam and to define a " +
                            "usefulness scale for software engineers.",
                    "admin",
                    System.currentTimeMillis(), System.currentTimeMillis(), 0, true,
                    UserRoles(
                        listOf("admin", "testmanager"),
                        listOf("admin", "testcurator"),
                        listOf("admin", "testannotator")
                    ),
                    InputMapping(
                        DocumentText("review", false), listOf(
                            MetaData("TIMESTAMP", "timestamp"),
                            MetaData("APP", "appName"),
                            MetaData("USER", "reviewer"),
                            MetaData("STAR_RATING", "stars")
                        )
                    ), null, Sort(listOf(SortElement("timestamp", Order.DESC))),
                    Annotations(
                        mapOf(
                            "IS_SPAM" to BooleanAnnotation(
                                "IS_SPAM",
                                "Is spam",
                                "Spam",
                                setOf(DocumentTarget()),
                                false
                            ),
                            "SENTIMENT" to PredefinedTagSetAnnotation(
                                "SENTIMENT", "Sentiment", "Sentiment", setOf(DocumentTarget()),
                                1, 1, listOf(
                                    TagSetOption("VERY_NEGATIVE", "Very negative", "-2"),
                                    TagSetOption("NEGATIVE", "Negative", "-1"),
                                    TagSetOption("NEUTRAL", "Neutral", "0"),
                                    TagSetOption("POSITIVE", "Positive", "+1"),
                                    TagSetOption("VERY_POSITIVE", "Very positive", "+2")
                                )
                            ),
                            "REVIEW_CONTAINS" to PredefinedTagSetAnnotation(
                                "REVIEW_CONTAINS",
                                "This review contains a",
                                "Contains",
                                setOf(DocumentTarget()),
                                0,
                                3,
                                listOf(
                                    TagSetOption(
                                        "FEATURE_FEEDBACK",
                                        "Feedback about a feature",
                                        "Feedback"
                                    ),
                                    TagSetOption("BUG_REPORT", "Bug report", "Bug"),
                                    TagSetOption("FEATURE_REQUEST", "Feature request", "Request")
                                )
                            ),
                            "REVIEW_CONTAINS_OTHER" to OpenTextAnnotation(
                                "REVIEW_CONTAINS_OTHER",
                                "Other things this review contains",
                                "Other",
                                setOf(DocumentTarget()),
                                1,
                                100,
                                false,
                                false,
                                true
                            ),
                            "FEATURES" to OpenTagAnnotation(
                                "FEATURES",
                                "Mentioned features",
                                "Features",
                                setOf(DocumentTarget()),
                                0,
                                10,
                                true,
                                CaseBehavior.CAPITALIZE,
                                false,
                                mutableListOf()
                            ),
                            "USEFULNESS" to ClosedNumberAnnotation(
                                "USEFULNESS",
                                "How useful is this review for software engineers?",
                                "Usefulness",
                                setOf(DocumentTarget()),
                                1.0,
                                5.0,
                                1.0,
                                false
                            )
                        )
                    ), Layout(
                        mapOf(
                            LayoutAreaType.Common to LayoutArea(
                                LayoutAreaType.Common, listOf(
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 6, 4, 4
                                                ), listOf(
                                                    Text("Review for the App "),
                                                    Bold(TextMetaData("APP"))
                                                )
                                            ),
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 6, 4, 4
                                                ), listOf(
                                                    Text("Reviewer: "), TextMetaData("USER")
                                                )
                                            ),
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 6, 4, 4
                                                ), listOf(
                                                    Text("Stars: "),
                                                    Bold(TextMetaData("STAR_RATING"))
                                                )
                                            ),
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 6, 4, 4
                                                ), listOf(
                                                    Text("Date: "),
                                                    DateMetaData("YYYY-MM-DD", "TIMESTAMP")
                                                )
                                            )
                                        )
                                    ),
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(
                                                    12
                                                ), listOf(
                                                    DocumentTextElement("Review text")
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            LayoutAreaType.DocumentTarget to LayoutArea(
                                LayoutAreaType.DocumentTarget, listOf(
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 6, 6, 6
                                                ), listOf(
                                                    ButtonGroup("IS_SPAM")
                                                )
                                            ),
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 6, 6, 6
                                                ), listOf(
                                                    Slider("USEFULNESS")
                                                )
                                            ),
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 6, 6, 6
                                                ), listOf(
                                                    ButtonGroup("REVIEW_CONTAINS")
                                                )
                                            ),
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 6, 6, 6
                                                ), listOf(
                                                    TextField("REVIEW_CONTAINS_OTHER")
                                                )
                                            ),
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 12, 6, 6
                                                ), listOf(
                                                    Dropdown("SENTIMENT")
                                                )
                                            ),
                                            Column(
                                                ColumnSizes(
                                                    12, 12, 12, 6, 6
                                                ), listOf(
                                                    Chips("FEATURES")
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ), Policy(
                        numberOfAnnotatorsPerDocument = 1,
                        allowManualEscalationToCurator = false,
                        finalizeAnnotationPolicy = FinalizeAnnotationPolicy.ALWAYS_REQUIRE_CURATION
                    ), Export(
                        listOf(),
                        RestConfig(
                            ExportFormat(), RestAuthentication.None
                        ),
                        onOverwrittenFinalizedAnnotationBehavior = OnOverwrittenFinalizedAnnotationBehavior.TRIGGER_EXPORT_AGAIN
                    )
                )
                projectConfigDAO.insertOne(exampleProject)
                logger.info("Inserted $exampleProject")
                logger.info("Generate example data")
            }
            if(documentDAO.getAll().isEmpty()) {
                // These reviews are made up, not actual app reviews
                documentDAO.insertMany(jsonMapper.createArrayNode().apply {
                    this.addAll(listOf(jsonMapper.createObjectNode().apply {
                        put("review", "Great app, I like the fast upload speed and pdf viewer!")
                        put("timestamp", 1506594690000)
                        put("appName", "Dropbox")
                        put("reviewer", "Anonymous")
                        put("stars", 5)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "Good game, but the ads are annoying.")
                        put("timestamp", 1509532290000)
                        put("appName", "Angry Birds")
                        put("reviewer", "Karl W.")
                        put("stars", 3)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "The app is just so ugly, I don't like the colors and the layout at all.")
                        put("timestamp", 1514889090000)
                        put("appName", "Telegram")
                        put("reviewer", "Peter S.")
                        put("stars", 1)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "Bad sfhjs 3fnfs 34r")
                        put("timestamp", 1519295490000)
                        put("appName", "Dropbox")
                        put("reviewer", "Anna B.")
                        put("stars", 1)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "The game is too easy for me, not challenging at all. Also the graphics are lame.")
                        put("timestamp", 1523529090000)
                        put("appName", "Angry Birds")
                        put("reviewer", "Gamemaster01")
                        put("stars", 2)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "I would like there to be a way to mute individual people in a group.")
                        put("timestamp", 1525343490000)
                        put("appName", "Telegram")
                        put("reviewer", "Andrew")
                        put("stars", 3)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "Instantly closes when I try to open it....so bad")
                        put("timestamp", 1527940800000)
                        put("appName", "Dropbox")
                        put("reviewer", "Amy K.")
                        put("stars", 1)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "I like it but I tried to send a video and it was too big so it wouldn't let me send it.")
                        put("timestamp", 1530964800000)
                        put("appName", "Telegram")
                        put("reviewer", "Natalie")
                        put("stars", 4)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "I love it!")
                        put("timestamp", 1538308800000)
                        put("appName", "Angry Birds")
                        put("reviewer", "Tom F.")
                        put("stars", 5)
                    },
                    jsonMapper.createObjectNode().apply {
                        put("review", "I like the stickers and that I can also use it on my computer. Better than WhatsApp!")
                        put("timestamp", 1546257600000)
                        put("appName", "Telegram")
                        put("reviewer", "User#23265")
                        put("stars", 5)
                    }))
                }, "EXAMPLE_PROJECT_APP_REVIEWS")
            }
        }
    }
}