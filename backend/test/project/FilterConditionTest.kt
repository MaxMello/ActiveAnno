package project

import api.KGenericContainer
import application.*
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import document.DocumentDAO
import kotlinx.coroutines.runBlocking
import org.assertj.core.api.Assertions.assertThat
import org.junit.Assert.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.litote.kmongo.coroutine.CoroutineClient
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.coroutine.coroutine
import org.testcontainers.containers.wait.strategy.Wait
import project.filter.*
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
internal class FilterConditionTest {

    private val container = MongoContainer.instance

    @BeforeAll
    fun setup() = runBlocking {
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

        documentDAO.insertMany(
            jsonMapper.createArrayNode().apply {
                add(jsonMapper.createObjectNode().apply {
                    put("type", 1)
                    put("id", 1)
                    put("text", "Hello my friend")
                    put("additionalField", true)
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 1)
                    put("id", 2)
                    put("text", "Hello my buddy")
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 1)
                    put("id", 3)
                    put("text", "Hello my pal")
                    set<ArrayNode>("array", jsonMapper.createArrayNode().apply {
                        add("hello")
                        add("hi")
                    })
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 1)
                    put("id", 4)
                    put("text", "")
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 1)
                    put("id", 5)
                    put("text", "...")
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 2)
                    put("uuid", "a")
                    put("comment", "Great")
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 2)
                    put("uuid", "b")
                    put("comment", "Awesome")
                    put("additionalField", true)
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 2)
                    put("uuid", "c")
                    put("comment", "awesome")
                    put("date", "2018-05-22T12:00:00")
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 2)
                    put("uuid", "d")
                    put("comment", "Nice")
                    put("date", "2016-05-22T10:06:45")
                })
                add(jsonMapper.createObjectNode().apply {
                    put("type", 2)
                    put("uuid", "e")
                    put("comment", null as String?)
                })
            }
        )
        Unit
    }

    @Test
    fun `Every subclass of FilterCondition is part of the JsonSubTypes annotation`() {
        FilterCondition::class.sealedSubclasses.forEach {
            val presentAnnotation = mutableListOf<String>()
            FilterCondition::class.annotations.forEach {
                if (it is JsonSubTypes) {
                    presentAnnotation.addAll(it.value.map { it.value.simpleName.toString() })
                }
            }
            assertThat(presentAnnotation).contains(it.simpleName)
        }
    }

    @Test
    fun `single equals call returns two documents that match condition`(): Unit = runBlocking {
        val filter = Equals("originalDocument.additionalField", true)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(2).anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 1 }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "b" }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `equals call fails because string is not equal boolean`(): Unit = runBlocking {
        val filter = Equals("originalDocument.additionalField", "true")
        val result = documentDAO.findForFilter(filter)
        assertThat(result).isEmpty()
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `stringEquals call returns two documents that match condition`(): Unit = runBlocking {
        val filter = StringEquals("originalDocument.additionalField", "true")
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(2).anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 1 }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "b" }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `date Less than equals call returns one document that match condition`(): Unit = runBlocking {
        val filter = DateLessThanEquals("originalDocument.date", "%Y-%m-%dT%H:%M:%S", 1483228800000L /* 1.1.2017 */)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(1).allMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "d" }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `date greater than equals call returns one document that match condition`(): Unit = runBlocking {
        val filter = DateGreaterThanEquals("originalDocument.date", "%Y-%m-%dT%H:%M:%S", 1483228800000L /* 1.1.2017 */)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(1).allMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "c" }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `not equals call returns all 5 elements matching condition`(): Unit = runBlocking {
        val filter = NotEquals("originalDocument.type", 2)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(5).allMatch { it.originalDocument.has("id") }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `keyExists true call returns all 5 elements matching condition`(): Unit = runBlocking {
        val filter = KeyExists("originalDocument.text", true)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(5).allMatch { it.originalDocument.has("id") }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `keyExists false call returns all 5 elements matching condition`(): Unit = runBlocking {
        val filter = KeyExists("originalDocument.text", false)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(5).allMatch { it.originalDocument.has("uuid") }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `test case insensitive regex to find 3 documents containing hello `(): Unit = runBlocking {
        val filter = Regex("originalDocument.text", "HELLO.*", "i")
        val result = documentDAO.findForFilter(filter)
        println(result.toString())
        assertThat(result).hasSize(3).anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 1 }
            .anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 2 }
            .anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 3 }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `greater than 4 returns only document with id 5`(): Unit = runBlocking {
        val filter = GreaterThan("originalDocument.id", 4)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(1).allMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 5 }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `greater than equals 5 returns only document with id 5`(): Unit = runBlocking {
        val filter = GreaterThanEquals("originalDocument.id", 5)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(1).allMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 5 }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `less than 2 returns only document with id 1`(): Unit = runBlocking {
        val filter = LessThan("originalDocument.id", 2)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(1).allMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 1 }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `less than equals 1 returns only document with id 1`(): Unit = runBlocking {
        val filter = LessThanEquals("originalDocument.id", 1)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(1).allMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 1 }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `id in 3, 4 returns that both documents`(): Unit = runBlocking {
        val filter = In("originalDocument.id", listOf(3, 4))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(2).anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 3 }
            .anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 4 }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `not id in 3, 4, 5 returns documents 1, 2, 6-10`(): Unit = runBlocking {
        val filter = NotIn("originalDocument.id", listOf(3, 4, 5, 6, 7, 8))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(7).anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 1 }
            .anyMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 2 }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "a" }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "b" }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "c" }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "d" }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "e" }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `containsAll of inner array returns the document`(): Unit = runBlocking {
        val filter = ContainsAll("originalDocument.array", listOf("hi", "hello"))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(1).allMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 3 }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }


    @Test
    fun `size = 2 of inner array returns the document`(): Unit = runBlocking {
        val filter = Size("originalDocument.array", 2)
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(1).allMatch { it.originalDocument.has("id") && it.originalDocument.get("id").asInt() == 3 }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `negation of not equals call returns all 5 elements matching the original eq`(): Unit = runBlocking {
        val filter = Not(NotEquals("originalDocument.type", 2))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(5).anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "a" }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "b" }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "c" }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "d" }
            .anyMatch { it.originalDocument.has("uuid") && it.originalDocument.get("uuid").asText() == "e" }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `greater than returns same as not less than equals`(): Unit = runBlocking {
        val filter = GreaterThan("originalDocument.id", 3)
        val filter2 = And(Not(LessThanEquals("originalDocument.id", 3)), KeyExists("originalDocument.id", true))
        val result = documentDAO.findForFilter(filter)
        val result2 = documentDAO.findForFilter(filter2)
        assertThat(result2).containsExactlyElementsOf(result).hasSize(2)
        assertEquals("Bson query unequal to json query", filter2.buildQuery(), jsonMapper.readTree(filter2.buildBson().toJson()))
        assertEquals("Bson query unequal to json query", filter2.buildQuery(), jsonMapper.readTree(filter2.buildBson().toJson()))

        Unit
    }

    @Test
    fun `has id or uuid returns all 10 documents`(): Unit = runBlocking {
        val filter = Or(KeyExists("originalDocument.id", true), KeyExists("originalDocument.uuid", true))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(10)
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `has id and not has uuid returns 5 documents`(): Unit = runBlocking {
        val filter = And(KeyExists("originalDocument.id", true), Not(KeyExists("originalDocument.uuid", true)))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(5).allMatch { it.originalDocument.has("id") }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `has id and not has id returns 0 documents`(): Unit = runBlocking {
        val filter = And(KeyExists("originalDocument.id", true), Not(KeyExists("originalDocument.id", true)))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(0)
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `has neither id nor uuid returns 0 documents`(): Unit = runBlocking {
        val filter = Nor(KeyExists("originalDocument.id", true), KeyExists("originalDocument.uuid", true))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(0)
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }

    @Test
    fun `has neither id nor NOT uuid returns 5 documents`(): Unit = runBlocking {
        val filter = Nor(KeyExists("originalDocument.id", true), Not(KeyExists("originalDocument.uuid", true)))
        val result = documentDAO.findForFilter(filter)
        assertThat(result).hasSize(5).allMatch { it.originalDocument.has("uuid") }
        assertEquals("Bson query unequal to json query", filter.buildQuery(), jsonMapper.readTree(filter.buildBson().toJson()))
        Unit
    }
}