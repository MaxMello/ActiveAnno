package document

import api.KGenericContainer
import application.*
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import document.annotation.*
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.litote.kmongo.coroutine.CoroutineClient
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.coroutine.coroutine
import org.testcontainers.containers.wait.strategy.Wait
import project.ProjectDAO
import user.UserDAO


private object MongoContainer {
    val instance by lazy { startMongoContainer() }

    private fun startMongoContainer() = KGenericContainer("mongo:4").apply {
        withExposedPorts(27017)
        setWaitStrategy(Wait.forListeningPort())
        start()
    }
}

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class DocumentDAOTest {
    private val container = MongoContainer.instance

    @BeforeAll
    fun setup() {
        jsonMapper = jacksonObjectMapper()
        applicationConfig = ApplicationConfig(
            JwtConfiguration(
                useRoleProtection = false, validation = JwtValidation(true, "")
            ), Cors(listOf()), MongoConfig("mongodb://${container.containerIpAddress}:${container.getMappedPort(
                27017
            )}", "activeanno_test"), KtorHttpsConfig(false), FeaturesConfig(false)
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
        projectDAO = ProjectDAO(database)
        userDAO = UserDAO(database)
    }

    @Test
    fun `test insert many returns correct number of ids`() = runBlocking {
        val ids = documentDAO.insertMany(jacksonObjectMapper().createArrayNode().apply {
            add(jacksonObjectMapper().createObjectNode().put("test", "test"))
            add(jacksonObjectMapper().createObjectNode().put("test", "test"))
            add(jacksonObjectMapper().createObjectNode().put("test", "test"))
        })
        assertEquals(3, ids.size)
        val ids2 = documentDAO.insertMany(jacksonObjectMapper().createArrayNode().apply {
            add(jacksonObjectMapper().createObjectNode().put("test", "test"))
        })
        assertEquals(1, ids2.size)
    }

    @Test
    fun `test update and validate is successful`() = runBlocking {
        val annotationStored = documentDAO.updateAndValidate(
            "D1", Document("D1",
                0L, jacksonObjectMapper().createObjectNode())
        )
        assertEquals(true, annotationStored)
    }

    @Test
    fun `test aggregation of values for an annotation`() = runBlocking {
        documentDAO.save(Document("doc1", 0L, jacksonObjectMapper().createObjectNode(), null,
            mutableMapOf(
                "C1" to ProjectAnnotationData(
                    annotationResults = listOf(
                        AnnotationResult(
                            "1", "doc1", "C1", 0L, mutableMapOf(
                                "ANNOTATION_1" to DocumentTargetAnnotation(
                                    listOf(ValueToProbability("A"))
                                ),
                                "ANNOTATION_2" to DocumentTargetAnnotation(
                                    listOf(ValueToProbability(44))
                                ),
                                "ANNOTATION_3" to SpanTargetAnnotation(
                                    setOf(
                                        SpanTargetSingleAnnotation(
                                            setOf(Span(1, 10)), listOf(ValueToProbability("Awesome"))
                                        ),
                                        SpanTargetSingleAnnotation(
                                            setOf(Span(2, 20)), listOf(ValueToProbability("Great"))
                                        )
                                    )
                                )
                            ), AnnotationResultCreator.Annotator("test")
                        ),
                        AnnotationResult(
                            "2", "doc1", "C1", 0L, mutableMapOf(
                                "ANNOTATION_1" to DocumentTargetAnnotation(
                                    listOf(ValueToProbability("B"))
                                )
                            ), AnnotationResultCreator.Annotator("test")
                        )
                    )
                ),
                "C2" to ProjectAnnotationData(
                    annotationResults = listOf(
                        AnnotationResult(
                            "3", "doc1", "C2", 0L, mutableMapOf(
                                "ANNOTATION_1" to DocumentTargetAnnotation(
                                    listOf(ValueToProbability("D"))
                                )
                            ), AnnotationResultCreator.Annotator("test")
                        )
                    )
                )
            )))
        documentDAO.save(Document("doc2", 0L, jacksonObjectMapper().createObjectNode(), null,
            mutableMapOf(
                "C1" to ProjectAnnotationData(
                    annotationResults = listOf(
                        AnnotationResult(
                            "4", "doc2", "C1", 0L, mutableMapOf(
                                "ANNOTATION_1" to DocumentTargetAnnotation(
                                    listOf(ValueToProbability("E"))
                                ),
                                "ANNOTATION_2" to DocumentTargetAnnotation(
                                    listOf(ValueToProbability(40))
                                ),
                                "ANNOTATION_3" to SpanTargetAnnotation(
                                    setOf(
                                        SpanTargetSingleAnnotation(
                                            setOf(Span(3, 33)), listOf(ValueToProbability("Wow"))
                                        )
                                    )
                                )
                            ), AnnotationResultCreator.Annotator("test")
                        ),
                        AnnotationResult(
                            "5", "doc2", "C1", 0L, mutableMapOf(
                                "ANNOTATION_1" to DocumentTargetAnnotation(
                                    listOf(ValueToProbability("B"))
                                )
                            ), AnnotationResultCreator.Annotator("test")
                        )
                    )
                ),
                "C2" to ProjectAnnotationData(
                    annotationResults = listOf(
                        AnnotationResult(
                            "1", "doc2", "C2", 0L, mutableMapOf(
                                "ANNOTATION_1" to DocumentTargetAnnotation(
                                    listOf(ValueToProbability("X"))
                                )
                            ), AnnotationResultCreator.Annotator("test")
                        )
                    )
                )
            )))

        val aggregatedValuesC1andA1 = documentDAO.aggregateValuesForProjectAndAnnotation("C1", "ANNOTATION_1")
        assertEquals(listOf("A", "B", "E"), aggregatedValuesC1andA1)
        val aggregatedValuesC1andA2 = documentDAO.aggregateValuesForProjectAndAnnotation("C1", "ANNOTATION_2")
        assertEquals(listOf("40", "44"), aggregatedValuesC1andA2)
        val aggregatedValuesC1andA3 = documentDAO.aggregateValuesForProjectAndAnnotation("C1", "ANNOTATION_3")
        assertEquals(listOf("Awesome", "Great", "Wow"), aggregatedValuesC1andA3)
        val aggregatedValuesC2andA1 = documentDAO.aggregateValuesForProjectAndAnnotation("C2", "ANNOTATION_1")
        assertEquals(listOf("D", "X"), aggregatedValuesC2andA1)
    }
}