package api

import io.ktor.application.call
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("TestRouting")

class VerifyCalled {
    fun callMe() {
        println("called!")
    }
}

@KtorExperimentalAPI
fun Route.test(verifyCalled: VerifyCalled) {
    route("/test/webhook") {
        post {
            logger.warn("RECEIVED: " + call.receive())
            call.respond("OK!")
            verifyCalled.callMe()
        }
    }
}