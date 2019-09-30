package api

import api.annotate.AnnotationDocument
import api.annotate.AnnotationStored
import api.annotate.toAnnotationDocument
import api.curate.CurationDocument
import api.curate.toCurationDocument
import api.search.SearchResultDocument
import application.*
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import config.*
import config.annotations.Annotations
import config.annotations.BooleanAnnotation
import config.annotations.DocumentTarget
import config.export.ExportDocument
import config.inputmapping.DocumentText
import config.inputmapping.InputMapping
import config.inputmapping.MetaData
import config.layout.*
import document.Document
import document.DocumentDAO
import document.annotation.FinalizedReason
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.routing.routing
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.ktor.util.KtorExperimentalAPI
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.litote.kmongo.coroutine.CoroutineClient
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.coroutine.coroutine
import org.testcontainers.containers.wait.strategy.Wait
import user.message.MessageDAO
import user.UserDAO
import kotlin.test.assertEquals


private val testLogger = org.slf4j.LoggerFactory.getLogger("IntegrationTest")

object MongoContainer {
    val instance by lazy { startMongoContainer() }

    private fun startMongoContainer() = KGenericContainer("mongo:4").apply {
        withExposedPorts(27017)
        setWaitStrategy(Wait.forListeningPort())
        start()
    }
}

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IntegrationTest {
    private val container = MongoContainer.instance

    private val exampleConfigString = """
        {
            "id": "TEST_CONFIG",
            "name": "Test Config",
            "description": "Test description",
            "priority": 1,
            "active": true,
            "userRoles": {
                "managers": ["mail@test.com"],
                "curators": ["mail@test.com", "mail2@test.com"],
                "annotators": ["mail@test.com"]
            },
            "inputMapping": {
                "documentText": {
                    "key": "comment",
                    "createTextIndex": false
                },
                "metaData": [{
                        "id": "TIMESTAMP",
                        "key": "timestamp"
                    },
                    {
                        "id": "CLIENT_NAME",
                        "key": "clientName"
                    }
                ]
            },
            "filter": {
                "operator": "eq",
                "key": "originalDocument.clientName",
                "value": "TestClient"
            },
            "sort": {
                "sorts": []
            },
            "annotations": {
                "annotationMap": {
                    "IS_SPAM": {
                        "type": "BooleanAnnotation",
                        "id": "IS_SPAM",
                        "name": "Spam",
                        "targets": [{
                            "type": "DocumentTarget"
                        }],
                        "optional": true
                    }
                }
            },
            "layout": {
                "layoutAreas": {
                    "Common": {
                        "id": "Common",
                        "rows": [{
                                "cols": [{
                                        "width": {
                                            "xs": 6
                                        },
                                        "children": [{
                                                "type": "Popover",
                                                "trigger": "HOVER",
                                                "targets": {
                                                    "elements": [{
                                                        "type": "Icon",
                                                        "name": "access_time",
                                                        "interactive": true
                                                    }]
                                                },
                                                "content": {
                                                    "elements": [{
                                                        "type": "Text",
                                                        "text": "GMT"
                                                    }]
                                                }
                                            },
                                            {
                                                "type": "Bold",
                                                "children": [{
                                                    "type": "Text",
                                                    "text": "Date: "
                                                }]
                                            },
                                            {
                                                "type": "DateMetaData",
                                                "formatString": "DD.MM.YYYY HH:mm:ss",
                                                "id": "TIMESTAMP"
                                            }
                                        ]
                                    },
                                    {
                                        "width": {
                                            "xs": 6
                                        },
                                        "children": [{
                                                "type": "Icon",
                                                "name": "person",
                                                "interactive": false
                                            },
                                            {
                                                "type": "Text",
                                                "text": "Client: "
                                            },
                                            {
                                                "type": "TextMetaData",
                                                "id": "CLIENT_NAME"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "cols": [{
                                    "width": {
                                        "xs": 12
                                    },
                                    "children": [{
                                        "type": "Italic",
                                        "children": [{
                                            "type": "DocumentText",
                                            "label": "Comment"
                                        }]
                                    }]
                                }]
                            }
                        ]
                    },
                    "DocumentTarget": {
                        "id": "DocumentTarget",
                        "rows": [{
                            "cols": [{
                                "width": {
                                    "xs": 12
                                },
                                "children": [{
                                    "type": "ButtonGroup",
                                    "referenceAnnotation": "IS_SPAM"
                                }]
                            }]
                        }]
                    }
                }
            },
            "policy": {
                "numberOfAnnotatorsPerDocument": 1,
                "allowManualEscalationToCurator": false,
                "finalizeAnnotationPolicy": "ALWAYS_REQUIRE_CURATION"
            },
            "export": {
                "webHooks": [{
                    "url": "http://localhost:8080/test/webhook",
                    "onFailure": "RESEND_ON_NEXT_TRIGGER",
                    "exportFormat": {
                        "includeOriginalDocument": true,
                        "includeAllAnnotations": true
                    },
                    "authentication": {
                        "type": "None"
                    }
                }],
                "rest": {
                    "exportFormat": {
                        "includeOriginalDocument": true,
                        "includeAllAnnotations": true
                    },
                    "authentication": {
                        "type": "None"
                    }
                }
            }
        }
    """.trimIndent()

    @BeforeAll
    fun setup() {
        jsonMapper = jacksonObjectMapper()
        applicationConfig = ApplicationConfig(
            JwtConfiguration(
                useRoleProtection = false, validation = JwtValidation(true, "")
            ), Cors(listOf()), MongoConfig("mongodb://${container.containerIpAddress}:${container.getMappedPort(
                27017
            )}", "activeanno_test"), KtorHttpsConfig(false), LoggingConfig("DEBUG"), false
        )
        val mongoClient: CoroutineClient by lazy {
            org.litote.kmongo.reactivestreams.KMongo.createClient(
                applicationConfig.mongo.connectionString
            ).coroutine
        }
        val database: CoroutineDatabase by lazy {
            mongoClient.getDatabase(applicationConfig.mongo.databaseName)
        }

        documentDAO = DocumentDAO(database)
        projectConfigDAO = ProjectConfigDAO(database)
        userDAO = UserDAO(database)
        messageDAO = MessageDAO(database)
    }

    @KtorExperimentalAPI
    @Test
    fun fullEndpointsTest() {
        /*
         * Step 1: Add some documents
         */
        testPost(
            "/api/v1/import", """
            {
                "comment": "Test comment 1",
                "clientName": "TestClient",
                "timestamp": "235252353"
            }
        """.trimIndent()
        ) {
            assertEquals(HttpStatusCode.Created.value, response.status()?.value)
            runBlocking {
                documentDAO.getAll().apply {
                    assertEquals(1, size)
                    assertEquals("Test comment 1", this[0].originalDocument.get("comment").asText())
                }
            }
        }
        testPost(
            "/api/v1/import", """
            {
                "comment": "Test comment 2",
                "clientName": "TestClient",
                "timestamp": "235252356"
            }
        """.trimIndent()
        ) {
            assertEquals(HttpStatusCode.Created.value, response.status()?.value)
            runBlocking {
                documentDAO.getAll().apply {
                    assertEquals(2, size)
                    assertEquals("Test comment 2", this[1].originalDocument.get("comment").asText())
                }
            }
        }
        var allDocuments = listOf<Document>()
        testPost(
            "/api/v1/import", """
            {
                "comment": "Test comment 3",
                "clientName": "TestClient",
                "timestamp": "235252358"
            }
        """.trimIndent()
        ) {
            assertEquals(HttpStatusCode.Created.value, response.status()?.value)
            runBlocking {
                documentDAO.getAll().apply {
                    assertEquals(3, size)
                    assertEquals("Test comment 3", this[2].originalDocument.get("comment").asText())
                    allDocuments = this
                }
            }
        }

        testLogger.info("$allDocuments")

        /*
         * Step 2: Create a config
         */
        testPost("/api/v1/manage/config", exampleConfigString) {
            assertEquals(HttpStatusCode.Created.value, response.status()?.value)
            val result = jacksonObjectMapper().readValue(response.content, ManageConfig::class.java)
            assertEquals("TEST_CONFIG", result.id)
            testLogger.info("POST result: $result")
        }


        /*
         * Step 3: Search for documents and config
         */

        testPost(
            "/api/v1/search", """
            {
                "configurationIDs": ["TEST_CONFIG"],
                "filterCondition": {
                    "operator": "eq",
                    "key": "originalDocument.comment",
                    "value": "Test comment 1"
                }
            }
        """.trimIndent()
        ) {
            assertEquals(HttpStatusCode.OK.value, response.status()?.value)
            val type = jacksonObjectMapper().typeFactory.constructCollectionType(
                List::class.java,
                SearchResultDocument::class.java
            )
            val results = jacksonObjectMapper().readValue<List<SearchResultDocument>>(response.content, type)
            assertEquals(1, results.size)
            assertEquals("Test comment 1", results[0].originalDocument.get("comment").asText())
            testLogger.info("Search results: $results")
        }

        /*
         * Step 4: Get list of configs for annotator
         */

        testGet("/api/v1/annotate/config") {
            val type =
                jacksonObjectMapper().typeFactory.constructCollectionType(List::class.java, ListConfig::class.java)
            val results = jacksonObjectMapper().readValue<List<ListConfig>>(response.content, type)
            assertEquals(listOf(ListConfig("TEST_CONFIG", "Test Config", "Test description", 1)), results)
        }

        /*
        * Step 5: Get detailed config for annotator
        *
        *
        */

        var annotateConfig: AnnotateConfig? = null

        testGet("/api/v1/annotate/config/TEST_CONFIG") {
            val result = jacksonObjectMapper().readValue<AnnotateConfig>(response.content, AnnotateConfig::class.java)
            annotateConfig = result
            assertEquals(
                AnnotateConfig(
                    "TEST_CONFIG",
                    "Test Config",
                    "Test description",
                    1,
                    Annotations(
                        mapOf(
                            "IS_SPAM" to BooleanAnnotation(
                                "IS_SPAM",
                                "Spam",
                                null,
                                setOf(DocumentTarget()),
                                optional = true
                            )
                        )
                    ),
                    Layout(
                        mapOf(
                            LayoutAreaType.Common to LayoutArea(
                                LayoutAreaType.Common,
                                listOf(
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(xs = 6), listOf(
                                                    Popover(
                                                        PopoverTarget(
                                                            Icon(
                                                                "access_time",
                                                                true
                                                            )
                                                        ),
                                                        PopoverContent(Text("GMT")),
                                                        PopoverTrigger.HOVER
                                                    ),
                                                    Bold(Text("Date: ")),
                                                    DateMetaData("DD.MM.YYYY HH:mm:ss", "TIMESTAMP")
                                                )
                                            ), Column(
                                                ColumnSizes(xs = 6), listOf(
                                                    Icon("person", false),
                                                    Text("Client: "),
                                                    TextMetaData("CLIENT_NAME")
                                                )
                                            )
                                        )
                                    ),
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(xs = 12), listOf(
                                                    Italic(DocumentTextElement("Comment"))
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            LayoutAreaType.DocumentTarget to LayoutArea(
                                LayoutAreaType.DocumentTarget,
                                listOf(
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(xs = 12), listOf(
                                                    ButtonGroup("IS_SPAM")
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    false
                ), result
            )
        }

        /*
         * Step 6: Get documents for annotation, ignoring the first document of the DB
         *
         */

        testGet("/api/v1/annotate/config/TEST_CONFIG/document?limit=1&ignoreDocuments=${allDocuments[0]._id}") {
            val type =
                jacksonObjectMapper().typeFactory.constructCollectionType(List::class.java, AnnotationDocument::class.java)
            val results = jacksonObjectMapper().readValue<List<AnnotationDocument>>(response.content, type)
            testLogger.info("Annotate documents $results")
            assertEquals(listOf(allDocuments[1].toAnnotationDocument("TEST_CONFIG", InputMapping(
                DocumentText("comment", false),
                listOf(
                    MetaData("TIMESTAMP", "timestamp"),
                    MetaData("CLIENT_NAME", "clientName")
                )
            )
            )), results)
        }

        /*
         * Step 7: Post annotation
         */

        testPost("/api/v1/annotate/annotation", """
            {
                "annotations": [{
                    "documentID": "${allDocuments[1]._id}",
                    "configurationID": "TEST_CONFIG",
                    "documentData": {
                        "DOCUMENT_TEXT": "${allDocuments[1].originalDocument.get("comment").asText()}",
                        "TIMESTAMP": "${allDocuments[1].originalDocument.get("timestamp").asText()}",
                        "CLIENT_NAME": "${allDocuments[1].originalDocument.get("clientName").asText()}"
                    },
                    "documentAnnotations": {
                        "IS_SPAM": {
                            "value": false
                        }
                    },
                    "spanAnnotations": {},
                    "usedConfig": ${jacksonObjectMapper().valueToTree<ObjectNode>(annotateConfig).toString()},
                    "interactionLog": {
                        "durationMillis": 20000
                    }
                }]
            }
        """.trimIndent()) {
            assertEquals(HttpStatusCode.OK.value, response.status()?.value)
            val type = jacksonObjectMapper().typeFactory.constructCollectionType(
                List::class.java,
                AnnotationStored::class.java
            )
            assertEquals(listOf(AnnotationStored("TEST_CONFIG", allDocuments[1]._id!!)), jacksonObjectMapper().readValue<List<AnnotationStored>>(response.content, type))
        }

        // Update allDocuments to include annotations
        runBlocking {
            documentDAO.getAll().apply {
                testLogger.info("Document in DB: $this")
                allDocuments = this
            }
        }

        /*
         * Step 8: Get list of configs for curator
         */

        testGet("/api/v1/curate/config") {
            val type =
                jacksonObjectMapper().typeFactory.constructCollectionType(List::class.java, ListConfig::class.java)
            val results = jacksonObjectMapper().readValue<List<ListConfig>>(response.content, type)
            assertEquals(listOf(ListConfig("TEST_CONFIG", "Test Config", "Test description", 1)), results)
        }

        /*
        * Step 5: Get detailed config for curator
        *
        *
        */

        testGet("/api/v1/curate/config/TEST_CONFIG") {
            val result = jacksonObjectMapper().readValue<AnnotateConfig>(response.content, AnnotateConfig::class.java)
            annotateConfig = result
            assertEquals(
                AnnotateConfig(
                    "TEST_CONFIG",
                    "Test Config",
                    "Test description",
                    1,
                    Annotations(
                        mapOf(
                            "IS_SPAM" to BooleanAnnotation(
                                "IS_SPAM",
                                "Spam",
                                null,
                                setOf(DocumentTarget()),
                                optional = true
                            )
                        )
                    ),
                    Layout(
                        mapOf(
                            LayoutAreaType.Common to LayoutArea(
                                LayoutAreaType.Common,
                                listOf(
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(xs = 6), listOf(
                                                    Popover(
                                                        PopoverTarget(
                                                            Icon(
                                                                "access_time",
                                                                true
                                                            )
                                                        ),
                                                        PopoverContent(Text("GMT")),
                                                        PopoverTrigger.HOVER
                                                    ),
                                                    Bold(Text("Date: ")),
                                                    DateMetaData("DD.MM.YYYY HH:mm:ss", "TIMESTAMP")
                                                )
                                            ), Column(
                                                ColumnSizes(xs = 6), listOf(
                                                    Icon("person", false),
                                                    Text("Client: "),
                                                    TextMetaData("CLIENT_NAME")
                                                )
                                            )
                                        )
                                    ),
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(xs = 12), listOf(
                                                    Italic(DocumentTextElement("Comment"))
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            LayoutAreaType.DocumentTarget to LayoutArea(
                                LayoutAreaType.DocumentTarget,
                                listOf(
                                    Row(
                                        listOf(
                                            Column(
                                                ColumnSizes(xs = 12), listOf(
                                                    ButtonGroup("IS_SPAM")
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    false
                ), result
            )
        }

        /*
         * Step 6: Get documents for curation, ignoring the first document of the DB
         * We need to use a different AUTH header, because we cannot get a curate document if we are the annotator
         */

        testGet("/api/v1/curate/config/TEST_CONFIG/document?limit=1&ignoreDocuments=${allDocuments[0]._id}", authorizationHeader2) {
            val type =
                jacksonObjectMapper().typeFactory.constructCollectionType(List::class.java, CurationDocument::class.java)
            val results = jacksonObjectMapper().readValue<List<CurationDocument>>(response.content, type)
            assertEquals(listOf(allDocuments[1].toCurationDocument("TEST_CONFIG", InputMapping(
                DocumentText("comment", false),
                listOf(
                    MetaData("TIMESTAMP", "timestamp"),
                    MetaData("CLIENT_NAME", "clientName")
                )
            )
            )), results)
        }

        /*
         * Step 7: Post curation
         */

        withTestApplication({
            setupApplication()
        }) {
            handleRequest(HttpMethod.Post, "/api/v1/curate/annotation") {
                addHeader(HttpHeaders.Authorization, authorizationHeader)
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody("""
            {
                "annotations": [
                    {
                        "annotatedDocument": {
                            "documentID": "${allDocuments[1]._id}",
                            "configurationID": "TEST_CONFIG",
                            "documentData": {
                                "DOCUMENT_TEXT": "${allDocuments[1].originalDocument.get("comment").asText()}",
                                "TIMESTAMP": "${allDocuments[1].originalDocument.get("timestamp").asText()}",
                                "CLIENT_NAME": "${allDocuments[1].originalDocument.get("clientName").asText()}"
                            },
                            "documentAnnotations": {
                                "IS_SPAM": {
                                    "value": false
                                }
                            },
                            "spanAnnotations": {},
                            "usedConfig": ${jacksonObjectMapper().valueToTree<ObjectNode>(annotateConfig)},
                            "interactionLog": {
                                "durationMillis": 20000
                            }
                        },
                        "acceptedAnnotatedDocumentID": null,
                        "documentID": "${allDocuments[1]._id}",
                        "configurationID": "TEST_CONFIG"
                    }
                ]
            }
        """.trimIndent())
            }.apply {
                assertEquals(HttpStatusCode.OK.value, response.status()?.value)
                val type = jacksonObjectMapper().typeFactory.constructCollectionType(
                    List::class.java,
                    AnnotationStored::class.java
                )
                assertEquals(listOf(AnnotationStored("TEST_CONFIG", allDocuments[1]._id!!)),
                    jacksonObjectMapper().readValue<List<AnnotationStored>>(response.content, type))
                testLogger.info("Return result ${response.content}")
            }
        }

        /*
         Step 8: Validate REST endpoint
         */

        testGet("/api/v1/export/config/TEST_CONFIG?includeUnfinished=true") {
            testLogger.info(this.response.content)
            val type =
                jacksonObjectMapper().typeFactory.constructCollectionType(List::class.java, ExportDocument::class.java)
            val results = jacksonObjectMapper().readValue<List<ExportDocument>>(response.content, type)
            assertEquals(1, results.size)
            assertEquals(2, results[0].annotations.size)
            assertEquals(1, results[0].finalizedAnnotations.annotationResultIDs.size)
            assertEquals(FinalizedReason.Curator("mail@test.com"), results[0].finalizedAnnotations.finalizedReason)
        }

    }
}