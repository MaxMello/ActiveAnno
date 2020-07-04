package project.export

import application.documentDAO
import application.httpClient
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.node.ObjectNode
import common.HttpAuthentication
import common.applyHttpAuthentication
import document.Document
import document.annotation.AnnotationResult
import document.annotation.ExportStatistics
import document.annotation.FinalizedAnnotationResult
import document.annotation.WebHookExport
import document.getNewestFinalizedAnnotationResult
import io.ktor.client.request.post
import io.ktor.client.request.url
import io.ktor.http.ContentType
import io.ktor.http.contentType
import org.slf4j.LoggerFactory
import project.policy.PolicyAction


private val logger = LoggerFactory.getLogger("Export")

/**
 * Export configuration for consuming the results of this service
 */
data class Export(
    val webHooks: List<WebHookConfig>,
    val rest: RestConfig?,
    val onOverwrittenFinalizedAnnotationBehavior: OnOverwrittenFinalizedAnnotationBehavior =
        OnOverwrittenFinalizedAnnotationBehavior.TRIGGER_EXPORT_AGAIN
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
    val url: String,
    val onFailure: OnWebHookFailureBehavior = OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER,
    val exportFormat: ExportFormat,
    val authentication: HttpAuthentication
)

suspend fun Export.checkWebHooks(projectID: String, document: Document) {
    webHooks.forEach { webHookConfig ->
        try {
            if ((document.projectAnnotationData[projectID] ?: throw IllegalArgumentException("No data found for project $projectID"))
                    .finalizedAnnotationResults
                    .let { finalizedAnnotations ->
                        finalizedAnnotations.isNotEmpty() && (finalizedAnnotations.none { finalizedAnnotation ->
                            finalizedAnnotation.exportStatistics.webHookStatistics.any { it.success }
                        } ||
                                onOverwrittenFinalizedAnnotationBehavior == OnOverwrittenFinalizedAnnotationBehavior.TRIGGER_EXPORT_AGAIN)
                    }
            ) {
                logger.debug("Calling web hook for document ${document.id} and project $projectID")
                webHookConfig.callWebHook(projectID, document)
            } else {
                logger.debug("Won't call webhook, either no finalized annotation yet or was exported already and additional export not wanted")
            }
        } catch (e: Exception) {
            logger.error("Web hook failure for $webHookConfig", e)
        }
    }
    if (webHooks.any { it.onFailure == OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER }) {
        documentDAO.findFailedWebHookDocuments(projectID).forEach { doc ->
            webHooks.forEach {
                if (it.onFailure == OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER) {
                    try {
                        logger.debug("Calling webHook for previously failed document ${doc.id} and project $projectID")
                        it.callWebHook(projectID, doc)
                    } catch (e: Exception) {
                        logger.error("Web hook failure for $it", e)
                    }
                }
            }
        }
    }
}

suspend fun WebHookConfig.callWebHook(projectID: String, document: Document) {
    document.projectAnnotationData[projectID]?.let { annotationData ->
        if (annotationData.policyAction == PolicyAction.SaveUpdatedModel || annotationData.policyAction == PolicyAction.DoNothing) {
            annotationData.finalizedAnnotationResults.lastOrNull()?.let { finalizedDocument ->
                if (finalizedDocument.exportStatistics.webHookStatistics.none {
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
                                applyHttpAuthentication(authentication)
                                contentType(ContentType.Application.Json)
                                body = exportFormat.convertDocument(projectID, document, true, true, true)
                            }
                            logger.info("WebHook result: $result")
                            with(webHookExport) {
                                tries++
                                success = true
                                updatedTimestamp = System.currentTimeMillis()
                            }
                        } catch (e: Exception) {
                            logger.error("Web hook failure for $this", e)
                            if (onFailure == OnWebHookFailureBehavior.IGNORE) {
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
    } ?: throw IllegalArgumentException("ProjectID not found in document")
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = RestAuthentication.None::class, name = "None"),
        JsonSubTypes.Type(value = RestAuthentication.HttpBasicAuth::class, name = "HttpBasicAuth"),
        JsonSubTypes.Type(value = RestAuthentication.JwtRole::class, name = "JwtRole")
    ]
)
sealed class RestAuthentication {
    object None : RestAuthentication() {

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

    data class HttpBasicAuth(val username: String, val password: String) : RestAuthentication() {
        override fun toString(): String {
            return "HttpBasicAuth(username='${username.take(1)}*********', password='**********')"
        }
    }

    object JwtRole : RestAuthentication() {
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
    val projectID: String,
    val originalDocument: ObjectNode?,
    val annotations: List<AnnotationResult>,
    val finalizedAnnotationResult: FinalizedAnnotationResult
)

fun ExportFormat.convertDocument(
    projectID: String, document: Document, includeUsedProject: Boolean = false,
    includeDocumentData: Boolean = false, includeExportStatistics: Boolean = false
): ExportDocument {
    return document.projectAnnotationData[projectID]?.let { cad ->
        cad.getNewestFinalizedAnnotationResult()?.let { finalizedAnnotation ->
            ExportDocument(
                document.id,
                projectID,
                if (includeOriginalDocument) document.originalDocument else null,
                cad.annotationResults.filter { includeAllAnnotations || it.id in (finalizedAnnotation.annotationResultIDs) }
                    .map {
                        it.copy(
                            usedProject = if (includeUsedProject) it.usedProject else null,
                            documentData = if (includeDocumentData) it.documentData else null
                        )
                    },
                finalizedAnnotation.let { if (includeExportStatistics) it else it.copy(exportStatistics = ExportStatistics()) }
            )
        } ?: throw IllegalStateException("FinalizedDocument does not exist, cannot export")
    } ?: throw IllegalArgumentException("Document does not have data for projectID")
}