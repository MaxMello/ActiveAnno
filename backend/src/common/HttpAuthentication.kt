package common

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.headers
import org.apache.commons.codec.binary.Base64
import java.net.URL

/**
 * Inspiration: https://www.sparkpost.com/docs/tech-resources/webhook-authentication/
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = HttpAuthentication.None::class, name = "None"),
        JsonSubTypes.Type(value = HttpAuthentication.HttpBasicAuth::class, name = "HttpBasicAuth"),
        JsonSubTypes.Type(value = HttpAuthentication.ApplicationJwt::class, name = "ApplicationJwt"),
        JsonSubTypes.Type(value = HttpAuthentication.OAuth2::class, name = "OAuth2")
    ]
)
sealed class HttpAuthentication {
    object None : HttpAuthentication() {

        override fun equals(other: Any?): Boolean {
            return other != null && this::class.java == other::class.java
        }

        override fun hashCode(): Int {
            return this::class.java.hashCode()
        }

        override fun toString(): String {
            return "HttpAuthentication.None"
        }
    }

    data class HttpBasicAuth(val username: String, val password: String) : HttpAuthentication() {
        override fun toString(): String {
            return "HttpBasicAuth(username='${username.take(1)}*********', password='**********')"
        }
    }

    /**
     * Authenticate by sending the application's JWT with the request
     */
    class ApplicationJwt : HttpAuthentication() {
        override fun toString(): String {
            return "ApplicationJwt"
        }

        override fun equals(other: Any?): Boolean {
            return this === other
        }

        override fun hashCode(): Int {
            return System.identityHashCode(this)
        }
    }

    data class OAuth2(val clientID: String, val clientSecret: String, val tokenUrl: URL) : HttpAuthentication() {
        override fun toString(): String {
            return "OAuth2(clientID='$clientID', clientSecret='**********', tokenUrl=$tokenUrl)"
        }
    }
}

fun HttpRequestBuilder.applyHttpAuthentication(httpAuthentication: HttpAuthentication) {
    when (httpAuthentication) {
        is HttpAuthentication.HttpBasicAuth -> {
            headers {
                append(
                    "Authorization",
                    "Basic ${Base64.encodeBase64String("${httpAuthentication.username}:${httpAuthentication.password}".toByteArray())}"
                )
            }
        }
        is HttpAuthentication.None -> {

        }
        // Other cases need to be implemented
    }
}