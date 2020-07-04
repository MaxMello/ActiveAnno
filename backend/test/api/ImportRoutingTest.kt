package api

import application.*
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.TestApplicationCall
import io.mockk.coEvery
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import kotlin.test.assertEquals

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ImportRoutingTest {

    @BeforeAll
    fun setup() {
        mockDAOs()
        jsonMapper = jacksonObjectMapper()
        applicationConfig = ApplicationConfig(JwtConfiguration(
            useRoleProtection = false, validation = JwtValidation(true, "")
        ), Cors(listOf()), MongoConfig("", "activeanno_test"),
            KtorHttpsConfig(false), FeaturesConfig(false))
        coEvery { documentDAO.insert(any()) } returns "1"
        coEvery { documentDAO.insertMany(any()) } returns listOf("1", "2")
    }

    private fun testImportBase(body: String, asserts: TestApplicationCall.() -> Unit): Unit = testPost("/api/v1/import/document", body,
        authorizationHeader, asserts)

    @Test
    fun `test empty json object results in BadRequest 400`() = testImportBase("{}") {
        assertEquals(HttpStatusCode.BadRequest.value, response.status()?.value)
    }

    @Test
    fun `test empty json array results in BadRequest 400`() = testImportBase("[]") {
        assertEquals(HttpStatusCode.BadRequest.value, response.status()?.value)
    }

    @Test
    fun `test json object results in Created 201`() = testImportBase("""
        {
        "key": "value"
        }
    """.trimIndent()) {
        assertEquals(HttpStatusCode.Created.value, response.status()?.value)
    }

    @Test
    fun `test json array results in Created 201`() = testImportBase("""
        [{
        "key": "value"
        },
        {
        "key2": "value2"
        }]
    """.trimIndent()) {
        assertEquals(HttpStatusCode.Created.value, response.status()?.value)
    }

}