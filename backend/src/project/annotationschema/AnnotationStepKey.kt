package project.annotationschema

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import common.asAny
import common.getNestedKey
import document.Document
import document.annotation.Annotation
import document.annotation.AnnotationMap
import document.annotation.GeneratedAnnotationData

/**
 * Base class for subclasses that define how some data from a [Document] or [GeneratedAnnotationData] is extracted
 * and used for EnableCondition or annotation generation.
 *
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = OriginalDocumentKey::class, name = "OriginalDocumentKey"),
        JsonSubTypes.Type(value = AnnotationsKey::class, name = "AnnotationsKey")
    ]
)
sealed class AnnotationStepKey {
    abstract fun getValue(document: Document, annotations: AnnotationMap): Any?
}

/**
 * Get some data from the originalDocument of a [Document]
 */
data class OriginalDocumentKey(
    /**
     * The key inside the Document.originalDocument
     */
    val key: String
) : AnnotationStepKey() {

    override fun getValue(document: Document, annotations: AnnotationMap): Any? {
        return document.originalDocument.getNestedKey(key).asAny()
    }
}

/**
 * Get some data from some annotations
 */
data class AnnotationsKey(
    /**
     * The annotation ID
     */
    val key: String
) : AnnotationStepKey() {

    override fun getValue(document: Document, annotations: AnnotationMap): Annotation<*>? {
        return annotations[key]
    }

}