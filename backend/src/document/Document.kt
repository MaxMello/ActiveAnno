package document

import com.fasterxml.jackson.databind.node.ObjectNode
import common.getNestedKey
import config.inputmapping.InputMapping
import config.policy.PolicyAction
import document.annotation.AnnotationResult
import document.annotation.FinalizedAnnotation

const val KEY_DOCUMENT_TEXT = "DOCUMENT_TEXT"

/**
 * The data class representing a document with some [originalDocument], a unique [_id], optionally a [restrictedConfig]
 * (marking the document to belong only to that one config), and the [configAnnotationData] holding all the annotations
 * for every config related to the document.
 */
data class Document(val _id: String? = null,
                    val storeTimestamp: Long,
                    val originalDocument: ObjectNode,
                    val restrictedConfig: String? = null,
                    val configAnnotationData: MutableMap<String, ConfigAnnotationData> = mutableMapOf())


/**
 * Data class representing all annotation data for a specific configuration.
 */
data class ConfigAnnotationData(
    val annotations: MutableList<AnnotationResult> = mutableListOf(),
    var finalizedAnnotations: MutableList<FinalizedAnnotation> = mutableListOf(),
    /**
     * The [policyAction] holds the state of how to handle the document for the specific configuration, to either show
     * if to an annotator, curator etc.
     */
    var policyAction: PolicyAction = PolicyAction.ShowToAnnotator()
)

/**
 * Apply the input mapping to a document, returning a map of string keys to string values of the original document.
 */
fun Document.applyInputMapping(inputMapping: InputMapping): Map<String, String> {
    return mapOf(KEY_DOCUMENT_TEXT to (this.originalDocument.getNestedKey(inputMapping.documentText.key)?.asText() ?: "<${inputMapping.documentText.key} missing>")) + inputMapping.metaData.map {
        it.id to (this.originalDocument.getNestedKey(it.key)?.asText() ?: "<${it.key} missing>")
    }
}

/**
 * Get the newest finalized annotation, being treated as the actual final annotation. FinalizedAnnotations can be changed
 * after the fact, so the newest one is always the new truth.
 */
fun ConfigAnnotationData.getNewestFinalizedAnnotation(): FinalizedAnnotation? {
    return finalizedAnnotations.maxBy { it.timestamp }
}