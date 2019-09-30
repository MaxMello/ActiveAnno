package document.annotation

import config.AnnotateConfig
import config.annotations.AnnotationID
import config.userroles.UserIdentifier


/**
 * Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses
 * by the policy logic.
 */
data class AnnotationResult(
    val id: String,
    val documentID: String,
    val configurationID: String,
    val timestamp: Long,
    val documentAnnotations: Map<AnnotationID, DocumentAnnotation>, // for every annotationID, there can only be one document annotation
    val spanAnnotations: Map<AnnotationID, List<SpanAnnotation>>, // for every id, there can be multiple span annotations
    val creator: List<AnnotationResultCreator>,
    val interactionLog: InteractionLog? = null, // only when created by user
    val documentData: Map<String, Any>? = null, // only when created by user
    val usedConfig: AnnotateConfig? = null // only when created by user
)

/**
 * A document annotation is a single object only containing the value of the annotation, which can be [Any] type
 * (but actually only primitives, String, and collection of those types)
 */
data class DocumentAnnotation(
    val value: Any
)

/**
 * A span annotation maps a list of spans to the annotation value, which can be [Any] type
 * (but actually only primitives, String, and collection of those types)
 */
data class SpanAnnotation(
    /**
     * Every [SpanAnnotation] can have multiple spans with gaps in between. For continuous spans, the [spans] list will
     * have size 1.
     */
    val spans: List<Span>,
    /**
     * The [value] of the annotation
     */
    val value: Any
)

/**
 * When reading annotations, you can either extract the referenced substring by using the [begin] and [end] values,
 * or use the copy of the substring [text] directly.
 */
data class Span(
    val begin: Int,
    val end: Int,
    val text: String
)

/**
 * Enum class representing the two user types able to create annotations.
 */
enum class AnnotationResultCreatorType {
    ANNOTATOR, CURATOR
}

/**
 * Data class mapping a user identifier to the role it had for the annotation
 */
data class AnnotationResultCreator(
    val userIdentifier: UserIdentifier,
    val type: AnnotationResultCreatorType
)

/**
 * Data class representing log data from the interaction of the user with the document during annotation.
 */
data class InteractionLog(
    val firstShownTimestamp: Long,
    val firstInteractionTimestamp: Long,
    val lastInteractionTimestamp: Long
)