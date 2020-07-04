package api

import application.*
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.server.testing.TestApplicationCall
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.ktor.util.KtorExperimentalAPI
import io.mockk.mockk
import org.testcontainers.containers.GenericContainer

internal const val authorizationHeader = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWlsQHRlc3QuY29tIiwibmFtZSI6IlRlc3QiLCJlbWFpbCI6Im1haWxAdGVzdC5jb20iLCJyb2xlcyI6WyJhY3RpdmVhbm5vX2FkbWluIiwiYWN0aXZlYW5ub19tYW5hZ2VyIiwiYWN0aXZlYW5ub191c2VyIiwiYWN0aXZlYW5ub19wcm9kdWNlciIsImFjdGl2ZWFubm9fY29uc3VtZXIiLCJhY3RpdmVhbm5vX2dsb2JhbF9zZWFyY2giXSwiZXhwIjoxNTU5NjY0OTc3LCJpYXQiOjE1NTk2NTc3Nzd9._z0jY0Jf-Kx8RrZKlWIhSo9lIC4h0Bd1pSZ39a7qJzk"
internal const val authorizationHeader2 = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWlsMkB0ZXN0LmNvbSIsIm5hbWUiOiJUZXN0MiIsImVtYWlsIjoibWFpbDJAdGVzdC5jb20iLCJyb2xlcyI6WyJhY3RpdmVhbm5vX2FkbWluIiwiYWN0aXZlYW5ub19tYW5hZ2VyIiwiYWN0aXZlYW5ub191c2VyIiwiYWN0aXZlYW5ub19wcm9kdWNlciIsImFjdGl2ZWFubm9fY29uc3VtZXIiLCJhY3RpdmVhbm5vX2dsb2JhbF9zZWFyY2giXSwiZXhwIjoxNTU5NjY0OTc3LCJpYXQiOjE1NTk2NTc3Nzd9.vDPiXAZ4YMfnZQmvULvWoXxmTezskij9xYKFnVx_uAQ"

internal fun mockDAOs() {
    documentDAO = mockk(relaxed = true)
    projectDAO = mockk(relaxed = true)
    userDAO = mockk(relaxed = true)
    messageDAO = mockk(relaxed = true)
    annotationDefinitionDAO = mockk(relaxed = true)
    annotationGeneratorDAO = mockk(relaxed = true)
}

@KtorExperimentalAPI
internal fun testPost(uri: String, body: String, authHeader: String = authorizationHeader, asserts: TestApplicationCall.() -> Unit): Unit = withTestApplication({ setupApplication() }) {
    handleRequest(HttpMethod.Post, uri) {
        addHeader(HttpHeaders.Authorization, authHeader)
        addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
        setBody(body)
    }.apply {
        asserts()
    }
}

@KtorExperimentalAPI
internal fun testGet(uri: String, authHeader: String = authorizationHeader, asserts: TestApplicationCall.() -> Unit): Unit = withTestApplication({ setupApplication() }) {
    handleRequest(HttpMethod.Get, uri) {
        addHeader(HttpHeaders.Authorization, authHeader)
        addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
    }.apply {
        asserts()
    }
}

class KGenericContainer(imageName: String) : GenericContainer<KGenericContainer>(imageName)