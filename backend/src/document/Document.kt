package document

import com.fasterxml.jackson.databind.node.ObjectNode
import common.getNestedKey
import common.putIfAbsentAndGet
import document.annotation.AnnotationResult
import document.annotation.FinalizedAnnotationResult
import document.annotation.GeneratedAnnotationData
import org.bson.codecs.pojo.annotations.BsonId
import org.litote.kmongo.newId
import project.Project
import project.annotationschema.DenormalizedAnnotationSchema
import project.export.checkWebHooks
import project.inputmapping.InputMapping
import project.policy.PolicyAction
import project.policy.applyPolicy

const val KEY_DOCUMENT_TEXT = "DOCUMENT_TEXT"

/**
 * To make code more readable, define the ID of a document as a typealias on String
 */
typealias DocumentID = String

/**
 * The data class representing a document with some [originalDocument], a unique [id], optionally a [restrictedProjectID]
 * (marking the document to belong only to that one project), and the [projectAnnotationData] holding all the annotations
 * for every project related to the document.
 */
data class Document(
    /**
     * Unique, generated ID (mongo ID)
     */
    @BsonId val id: DocumentID = newId<Document>().toString(),
    val storeTimestamp: Long,
    val originalDocument: ObjectNode,
    /**
     * Optionally, a [Document] can be restricted to a single [Project] through this field.
     */
    val restrictedProjectID: String? = null,
    val projectAnnotationData: MutableMap<String, ProjectAnnotationData> = mutableMapOf()
) {
    init {
        // Validate originalDocument is valid to be stored in MongoDB: https://docs.mongodb.com/manual/core/document/#field-names
        require(
            originalDocument.fieldNames().asSequence().all {
                it != "null" && !it.contains("$") && !it.contains(".")
            }
        ) {
            "Inserted document has invalid JSON key. They are not allowed to equal 'null' or contain the characters '$' and '.'"
        }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Document) return false

        if (id != other.id) return false

        return true
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}

/**
 * Data class representing all annotation data for a specific project.
 */
class ProjectAnnotationData(
    /**
     * Data generated from AnnotationGenerators.
     */
    generatedAnnotationData: List<GeneratedAnnotationData> = listOf(),
    annotationResults: List<AnnotationResult> = listOf(),
    finalizedAnnotationResults: List<FinalizedAnnotationResult> = listOf(),
    /**
     * The [policyAction] holds the state of how to handle the document for the specific project, to either show
     * if to an annotator, curator etc.
     */
    var policyAction: PolicyAction = PolicyAction.ShowToAnnotator()
) {
    var generatedAnnotationData: List<GeneratedAnnotationData> = generatedAnnotationData
        internal set

    var annotationResults: List<AnnotationResult> = annotationResults
        internal set

    var finalizedAnnotationResults: List<FinalizedAnnotationResult> = finalizedAnnotationResults
        internal set
}

/**
 * Apply the input mapping to a document, returning a map of string keys to string values of the original document.
 */
fun Document.applyInputMapping(inputMapping: InputMapping): Map<String, String> {
    return mapOf(
        KEY_DOCUMENT_TEXT to (this.originalDocument.getNestedKey(inputMapping.documentText.key)
            ?.asText()
            ?: "<${inputMapping.documentText.key} missing>")
    ) + inputMapping.metaData.map {
        it.id to (this.originalDocument.getNestedKey(it.key)?.asText() ?: "<${it.key} missing>")
    }
}

/**
 * Get the newest finalized annotation, being treated as the actual final annotation. FinalizedAnnotations can be
 * changed after the fact, so the newest one is always the new truth.
 */
fun ProjectAnnotationData.getNewestFinalizedAnnotationResult(): FinalizedAnnotationResult? {
    return finalizedAnnotationResults.maxBy { it.timestamp }
}

fun Document.addEmptyProjectAnnotationData(project: Project) {
    this.projectAnnotationData.putIfAbsentAndGet(project.id, ProjectAnnotationData())
}

fun Document.addGeneratedAnnotationDataForProject(project: Project, generatedAnnotationData: GeneratedAnnotationData) {
    this.projectAnnotationData.putIfAbsentAndGet(project.id, ProjectAnnotationData()).let {
        it.generatedAnnotationData = it.generatedAnnotationData + generatedAnnotationData
    }
}

suspend fun Document.addAnnotationResultForProject(project: Project, annotationResult: AnnotationResult,
                                                   checkWebHooks: Boolean,
                                                   applyPolicy: Boolean, overwriteFinalizedAnnotations: Boolean = false,
                                                   curationRequest: String? = null,
                                                   annotationSchema: DenormalizedAnnotationSchema? = null) {
    this.projectAnnotationData.putIfAbsentAndGet(project.id, ProjectAnnotationData()).let {
        it.annotationResults = it.annotationResults + annotationResult
        if (applyPolicy) {
            it.policyAction = project.policy.applyPolicy(project, this, overwriteFinalizedAnnotations, curationRequest, annotationSchema)
        }
        if(checkWebHooks) {
            project.export.checkWebHooks(project.id, this)
        }
    }
}

/**
 * Extension function to add [FinalizedAnnotationResult] to a [Document] and a [Project]. Might also do
 * logic related to the [Project] after adding the result.
 */
suspend fun Document.addFinalizedAnnotationResultForProject(
    project: Project,
    finalizedAnnotationResult: FinalizedAnnotationResult,
    checkWebHooks: Boolean,
    applyPolicy: Boolean,
    overwriteFinalizedAnnotations: Boolean = false,
    curationRequest: String? = null,
    annotationSchema: DenormalizedAnnotationSchema? = null
): ProjectAnnotationData {
    return this.projectAnnotationData.putIfAbsentAndGet(project.id, ProjectAnnotationData()).also { annotationData ->
        if(finalizedAnnotationResult.annotationResultIDs.any { id -> id !in annotationData.annotationResults.map { it.id } }) {
            throw IllegalArgumentException("AnnotationResultIDs ${finalizedAnnotationResult.annotationResultIDs} do not all exist")
        }
        annotationData.finalizedAnnotationResults = annotationData.finalizedAnnotationResults + finalizedAnnotationResult
        if (applyPolicy) {
            annotationData.policyAction = project.policy.applyPolicy(project, this, overwriteFinalizedAnnotations, curationRequest,
                annotationSchema)
        }
        if(checkWebHooks) {
            project.export.checkWebHooks(project.id, this)
        }
    }
}