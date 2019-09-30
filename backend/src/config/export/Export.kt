package config.export

import application.documentDAO
import application.httpClient
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.node.ObjectNode
import config.policy.PolicyAction
import document.*
import document.annotation.*
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.url
import io.ktor.http.ContentType
import io.ktor.http.contentType
import org.apache.commons.codec.binary.Base64
import org.slf4j.LoggerFactory
import java.net.URL


private val logger = LoggerFactory.getLogger("Export")

/**
 * Export configuration for consuming the results of this service
 */
data class Export(
    val webHooks: List<WebHookConfig>,
    val rest: RestConfig?,
    val onOverwrittenFinalizedAnnotationBehavior: OnOverwrittenFinalizedAnnotationBehavior = OnOverwrittenFinalizedAnnotationBehavior.TRIGGER_EXPORT_AGAIN
)

/**
 * Define behavior what to do when a finalizedAnnotation was defined, but a new one was set afterwards. This would not
 * happen normally, but cannot be prevented for cases where an annotation is found via search to correct an earlier
 * mistake. For this case, we need to define if we want to trigger web hooks again or not.
 */
enum class OnOverwrittenFinalizedAnnotationBehavior {
    DO_NOTHING,
    TRIGGER_EXPORT_AGAIN
}

/**
 * What to do when calling the WebHook failed
 */
enum class OnWebHookFailureBehavior {
    /**
     * act as if call was successful, ignore document for future
     */
    IGNORE,
    /**
     * Try to re-send result with next time the web hook gets triggered
     */
    RESEND_ON_NEXT_TRIGGER
}

data class WebHookConfig(
    /**
     * List of web hook URLs where the results get sent
     */
    val url: URL,
    val onFailure: OnWebHookFailureBehavior = OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER,
    val exportFormat: ExportFormat,
    val authentication: WebHookAuthentication
)

/**
 * Inspiration: https://www.sparkpost.com/docs/tech-resources/webhook-authentication/
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = WebHookAuthentication.None::class, name = "None"),
    JsonSubTypes.Type(value = WebHookAuthentication.HttpBasicAuth::class, name = "HttpBasicAuth"),
    JsonSubTypes.Type(value = WebHookAuthentication.OAuth2::class, name = "OAuth2")
])
sealed class WebHookAuthentication {
    object None: WebHookAuthentication() {

        override fun equals(other: Any?): Boolean {
            return other != null && this::class.java == other::class.java
        }

        override fun hashCode(): Int {
            return this::class.java.hashCode()
        }

        override fun toString(): String {
            return "WebHookAuthentication.None"
        }
    }
    data class HttpBasicAuth(val username: String, val password: String): WebHookAuthentication() {
        override fun toString(): String {
            return "HttpBasicAuth(username='${username.take(1)}*********', password='**********')"
        }
    }
    data class OAuth2(val clientID: String, val clientSecret: String, val tokenUrl: URL): WebHookAuthentication() {
        override fun toString(): String {
            return "OAuth2(clientID='$clientID', clientSecret='**********', tokenUrl=$tokenUrl)"
        }
    }
}

suspend fun Export.checkWebHooks(configurationID: String, document: Document) {
    webHooks.forEach {
        try {
            if((document.configAnnotationData[configurationID] ?: throw IllegalArgumentException("No data found for config $configurationID"))
                    .finalizedAnnotations
                    .none { it.exportStatistics
                        .webHookStatistics
                        .any { it.success } } || onOverwrittenFinalizedAnnotationBehavior == OnOverwrittenFinalizedAnnotationBehavior.TRIGGER_EXPORT_AGAIN
            ) {
                logger.debug("Calling web hook for document ${document._id} and config $configurationID")
                it.callWebHook(configurationID, document)
            } else {
                logger.debug("Won't call webhook, was exported already and additional export not wanted")
            }

        } catch (e: Exception) {
            logger.error("Web hook failure for $it", e)
        }
    }
    if(webHooks.any { it.onFailure == OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER }) {
        documentDAO.findFailedWebHookDocuments(configurationID).forEach { doc ->
            webHooks.forEach {
                if (it.onFailure == OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER) {
                    try {
                        logger.debug("Calling webHook for previously failed document ${doc._id} and config $configurationID")
                        it.callWebHook(configurationID, doc)
                    } catch (e: Exception) {
                        logger.error("Web hook failure for $it", e)
                    }
                }
            }
        }
    }
}

suspend fun WebHookConfig.callWebHook(configurationID: String, document: Document) {
    document.configAnnotationData[configurationID]?.let { annotationData ->
       if (annotationData.policyAction == PolicyAction.SaveUpdatedModel || annotationData.policyAction == PolicyAction.DoNothing) {
           annotationData.finalizedAnnotations.lastOrNull()?.let { finalizedDocument ->
               if(finalizedDocument.exportStatistics.webHookStatistics.none {
                    it.url == url && it.success
                   }) {
                   (finalizedDocument.exportStatistics.webHookStatistics.firstOrNull { it.url == url } ?: (WebHookExport(
                       url = url, tries = 0, success = false, createdTimestamp = System.currentTimeMillis(),
                       updatedTimestamp = System.currentTimeMillis()
                   )).also {
                       finalizedDocument.exportStatistics.webHookStatistics.add(it)
                   }).also { webHookExport ->
                       try {
                           val result = httpClient.post<String> {
                               url(webHookExport.url)
                               when(authentication) {
                                   is WebHookAuthentication.HttpBasicAuth -> {
                                       headers {
                                           append("Authorization", "Basic ${Base64.encodeBase64String("${authentication.username}:${authentication.password}".toByteArray())}")
                                       }
                                   }
                                   is WebHookAuthentication.OAuth2 -> {
                                       TODO("OAuth2 not yet supported for WebHook authentication")
                                   }
                               }
                               contentType(ContentType.Application.Json)
                               body = exportFormat.convertDocument(configurationID, document)
                           }
                           logger.info("WebHook result: $result")
                           with(webHookExport) {
                               tries++
                               success = true
                               updatedTimestamp = System.currentTimeMillis()
                           }
                       } catch (e: Exception) {
                           logger.error("Web hook failure for $this", e)
                           if(onFailure == OnWebHookFailureBehavior.IGNORE) {
                               with(webHookExport) {
                                   tries++
                                   success = true
                                   updatedTimestamp = System.currentTimeMillis()
                                   failureLogs += "${e.message} \n ${e.stackTrace.joinToString("\n")}"
                               }
                           } else {
                               with(webHookExport) {
                                   tries++
                                   failureLogs += "${e.message} \n ${e.stackTrace.joinToString("\n")}"
                               }
                           }
                       }
                   }
               } else {

               }
           }
       }
    } ?: throw IllegalArgumentException("ConfigurationID not found in document")
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = RestAuthentication.None::class, name = "None"),
    JsonSubTypes.Type(value = RestAuthentication.HttpBasicAuth::class, name = "HttpBasicAuth"),
    JsonSubTypes.Type(value = RestAuthentication.JwtRole::class, name = "JwtRole")
])
sealed class RestAuthentication {
    object None: RestAuthentication() {

        override fun equals(other: Any?): Boolean {
            return other != null && this::class.java == other::class.java
        }

        override fun hashCode(): Int {
            return this::class.java.hashCode()
        }

        override fun toString(): String {
            return "RestAuthentication.None"
        }
    }
    data class HttpBasicAuth(val username: String, val password: String): RestAuthentication() {
        override fun toString(): String {
            return "HttpBasicAuth(username='${username.take(1)}*********', password='**********')"
        }
    }
    object JwtRole: RestAuthentication() {
        override fun equals(other: Any?): Boolean {
            if (this === other) return true
            if (javaClass != other?.javaClass) return false
            return true
        }

        override fun hashCode(): Int {
            return javaClass.hashCode()
        }

        override fun toString(): String {
            return "RestAuthentication.JwtRole"
        }

    }
}

/**
 * What REST endpoints to activate and how to export them
 */
data class RestConfig(
    val exportFormat: ExportFormat,
    val authentication: RestAuthentication
)

/**
 * What aspects for the document and results to export
 */
data class ExportFormat(
    val includeOriginalDocument: Boolean = true,
    val includeAllAnnotations: Boolean = true
)

data class ExportDocument(
    val id: String,
    val configurationID: String,
    val originalDocument: ObjectNode?,
    val annotations: List<AnnotationResult>,
    val finalizedAnnotations: FinalizedAnnotation
)

fun ExportFormat.convertDocument(configurationID: String, document: Document): ExportDocument {
    return document.configAnnotationData[configurationID]?.let { cad ->
        cad.getNewestFinalizedAnnotation()?.let { finalizedDocument ->
            ExportDocument(
                document._id!!,
                configurationID,
                if (includeOriginalDocument) document.originalDocument else null,
                cad.annotations.filter { includeAllAnnotations || it.id in (finalizedDocument.annotationResultIDs) },
                finalizedDocument
            )
        } ?: throw IllegalStateException("FinalizedDocument does not exist, cannot export")
    } ?: throw IllegalArgumentException("Document does not have data for configurationID")
}