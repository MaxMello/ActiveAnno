package common

import application.applicationConfig
import application.httpClient
import com.auth0.jwt.JWT
import com.auth0.jwt.interfaces.DecodedJWT
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.client.HttpClient
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.url
import io.ktor.client.response.HttpResponse
import io.ktor.features.BadRequestException
import io.ktor.http.ContentType
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.request.header
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.method
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.pipeline.ContextDsl
import io.ktor.util.pipeline.PipelineContext
import io.ktor.util.pipeline.PipelineInterceptor
import org.slf4j.LoggerFactory
import java.net.URL


private val logger = LoggerFactory.getLogger("Security")

/**
 * Extract the JWT Base64 string from the request header or throw [AuthenticationException] if missing
 */
@KtorExperimentalAPI
fun jwtFromHeader(call: ApplicationCall): String {
    return call.request.header("Authorization")?.substringAfter("Bearer ")
        ?: throw AuthenticationException("Missing Authorization Header")
}

/**
 * Validate JWT token, either accept the token as valid by configuration or call the configured
 * authentication service
 */
@KtorExperimentalAPI
suspend fun isTokenStillValid(client: HttpClient, jwt: String): Boolean {
    return applicationConfig.jwt.validation.acceptAllTokens || client.post<HttpResponse> {
        url(URL(applicationConfig.jwt.validation.url))
        contentType(ContentType.Application.Json)
        headers {
            append("Authorization", "Bearer $jwt")
        }
    }.status == HttpStatusCode.OK
}

/**
 * Extension value to easily access the [DecodedJWT] from the call
 */
@KtorExperimentalAPI
val PipelineContext<Unit, ApplicationCall>.jwt: DecodedJWT
    get() = JWT.decode(jwtFromHeader(call))

/**
 * Extension value to easily access the list of roles from the JWT
 */
@KtorExperimentalAPI
val DecodedJWT.roles: List<String>
    get() = (this.claims[applicationConfig.jwt.rolesKey]?.asList(String::class.java) ?: throw BadRequestException("roles are not an array")).toList()

/**
 * Extension value to easily access the userIdentifier from the JWT
 */
@KtorExperimentalAPI
val DecodedJWT.userIdentifier: String
    get() = (this.claims[applicationConfig.jwt.userIdentifierKey]?.asString() ?: throw BadRequestException("userIdentifier missing"))

/**
 * Extension value to easily access the userName from the JWT
 */
@KtorExperimentalAPI
val DecodedJWT.userName: String?
    get() = this.claims[applicationConfig.jwt.userNameKey]?.asString()

/**
 * Higher order function that will check for authorization by checking the JWT roles against a list of required roles. If
 * only one role must match, use the [onlyOneMustMatch] parameter to true
 */
@KtorExperimentalAPI
suspend fun PipelineContext<Unit, ApplicationCall>.protectedByRole(
    requiredRoles: List<String>, onlyOneMustMatch: Boolean = false,
    block: suspend () -> Unit
) {
    val enterCondition = if(applicationConfig.jwt.useRoleProtection) {
        validateRole(requiredRoles, onlyOneMustMatch)
    } else {
        logger.warn("Role protection disabled, allow all requests")
        true
    }
    if (enterCondition) {
        try {
            block()
        } catch (e: Exception) {
            logger.error("Could not handle request", e)
            call.respond(HttpStatusCode.InternalServerError)
        }
    } else {
        call.respond(HttpStatusCode.Unauthorized, "Role missing")
    }
}

/**
 * Extension function on a [PipelineContext] to validate a role and return true if the user is authorized, false otherwise
 */
@KtorExperimentalAPI
fun PipelineContext<Unit, ApplicationCall>.validateRole(requiredRoles: List<String>, onlyOneMustMatch: Boolean = false): Boolean {
    val jwt = call.request.header("Authorization")?.substringAfter("Bearer ")
        ?: throw BadRequestException("JWT no present")
    val decoded = JWT.decode(jwt)
    val roles = decoded.roles
    return if (onlyOneMustMatch) {
        roles.map { it }.toSet().intersect(requiredRoles).isNotEmpty()
    } else {
        roles.containsAll(requiredRoles)
    }
}

/**
 * Higher order function to handle a request secured by a JWT
 */
@KtorExperimentalAPI
@ContextDsl
fun Route.handleAuthenticatedByJwt(
    requiredRoles: List<String> = listOf(),
    onlyOneMustMatch: Boolean = false,
    body: PipelineInterceptor<Unit, ApplicationCall>
) {
    handle {
        if (isTokenStillValid(httpClient, jwtFromHeader(call))) {
            protectedByRole(requiredRoles, onlyOneMustMatch) {
                body(this, Unit)
            }
        } else {
            call.respond(HttpStatusCode.Unauthorized, "Token invalid")
        }
    }
}

/*
 * The following extension functions are shorthands to handle different HTTP methods authenticated with JWT
 */

@KtorExperimentalAPI
@ContextDsl
fun Route.getAuthenticatedByJwt(
    path: String,
    requiredRoles: List<String> = listOf(),
    onlyOneMustMatch: Boolean = false,
    body: PipelineInterceptor<Unit, ApplicationCall>
): Route {
    return route(path, HttpMethod.Get) { handleAuthenticatedByJwt(requiredRoles, onlyOneMustMatch, body) }
}

@KtorExperimentalAPI
@ContextDsl
fun Route.getAuthenticatedByJwt(
    requiredRoles: List<String> = listOf(),
    onlyOneMustMatch: Boolean = false,
    body: PipelineInterceptor<Unit, ApplicationCall>
): Route {
    return method(HttpMethod.Get) { handleAuthenticatedByJwt(requiredRoles, onlyOneMustMatch, body) }
}

@KtorExperimentalAPI
@ContextDsl
fun Route.postAuthenticatedByJwt(
    path: String,
    requiredRoles: List<String> = listOf(),
    onlyOneMustMatch: Boolean = false,
    body: PipelineInterceptor<Unit, ApplicationCall>
): Route {
    return route(path, HttpMethod.Post) { handleAuthenticatedByJwt(requiredRoles, onlyOneMustMatch, body) }
}

@ContextDsl
@KtorExperimentalAPI
fun Route.postAuthenticatedByJwt(
    requiredRoles: List<String> = listOf(),
    onlyOneMustMatch: Boolean = false,
    body: PipelineInterceptor<Unit, ApplicationCall>
): Route {
    return method(HttpMethod.Post) { handleAuthenticatedByJwt(requiredRoles, onlyOneMustMatch, body) }
}

@ContextDsl
@KtorExperimentalAPI
fun Route.putAuthenticatedByJwt(path: String,
              requiredRoles: List<String> = listOf(),
              onlyOneMustMatch: Boolean = false,
              body: PipelineInterceptor<Unit, ApplicationCall>): Route {
    return route(path, HttpMethod.Put) { handleAuthenticatedByJwt(requiredRoles, onlyOneMustMatch, body) }
}

@ContextDsl
@KtorExperimentalAPI
fun Route.putAuthenticatedByJwt(requiredRoles: List<String> = listOf(),
              onlyOneMustMatch: Boolean = false,
              body: PipelineInterceptor<Unit, ApplicationCall>): Route {
    return method(HttpMethod.Put) { handleAuthenticatedByJwt(requiredRoles, onlyOneMustMatch, body) }
}

@ContextDsl
@KtorExperimentalAPI
fun Route.deleteAuthenticatedByJwt(path: String,
                                requiredRoles: List<String> = listOf(),
                                onlyOneMustMatch: Boolean = false,
                                body: PipelineInterceptor<Unit, ApplicationCall>): Route {
    return route(path, HttpMethod.Delete) { handleAuthenticatedByJwt(requiredRoles, onlyOneMustMatch, body) }
}

@ContextDsl
@KtorExperimentalAPI
fun Route.deleteAuthenticatedByJwt(requiredRoles: List<String> = listOf(),
                                onlyOneMustMatch: Boolean = false,
                                body: PipelineInterceptor<Unit, ApplicationCall>): Route {
    return method(HttpMethod.Delete) { handleAuthenticatedByJwt(requiredRoles, onlyOneMustMatch, body) }
}