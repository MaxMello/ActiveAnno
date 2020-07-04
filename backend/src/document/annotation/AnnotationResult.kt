package document.annotation

import annotationdefinition.AnnotationID
import document.DocumentID
import project.ProjectID
import project.UsedAnnotateProject

typealias AnnotationMap = MutableMap<AnnotationID, Annotation<*>>
typealias AnnotationResultID = String

/**
 * Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses
 * by the policy logic.
 */
data class AnnotationResult(
    val id: AnnotationResultID,
    val documentID: DocumentID,
    val projectID: ProjectID,
    val timestamp: Long,
    val annotations: AnnotationMap,
    val creator: AnnotationResultCreator,
    val interactionLog: InteractionLog? = null, // only when created by user
    val documentData: Map<String, Any>? = null, // only when created by user
    val usedProject: UsedAnnotateProject? = null, // only when created by user
    val generatedAnnotationDataID: String? = null // only when created by generator
)