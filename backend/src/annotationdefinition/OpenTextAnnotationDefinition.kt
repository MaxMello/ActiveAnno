package annotationdefinition

import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanTarget
import annotationdefinition.target.Target
import api.annotate.dto.ValidationError
import common.getMessageString
import document.annotation.AnnotationMap
import java.util.*

/**
 * Annotation for some open text input
 */
class OpenTextAnnotationDefinition(
    id: AnnotationID,
    name: String,
    shortName: String?,
    createdTimestamp: Long = System.currentTimeMillis(),
    var minLength: Int = 1,
    var maxLength: Int? = null,
    /**
     * copy documentData value by key
     */
    val documentDataDefault: String? = null,
    var optional: Boolean = false
) : AnnotationDefinition(id, name, shortName, createdTimestamp) {

    override fun validateAnnotation(
        annotations: AnnotationMap,
        target: Target,
        locale: Locale?
    ): ValidationError? {
        commonCheck(annotations, optional, target, locale)?.let { return it }
        val maxLen = maxLength
        when (target) {
            is DocumentTarget -> {
                commonDocumentTargetAnnotationCheck(annotations, optional, locale)?.let { return it }
                if(!applyConditionOnDocumentAnnotation(annotations) { it.singleValue?.value is String }) {
                    return ValidationError(id, target.type, getMessageString("validationError.typeMismatch.string", locale))
                }
                if(!applyConditionOnDocumentAnnotation(annotations) { it.singleValue?.value?.let { value -> value is String &&
                            value.length >= minLength } == true }) {
                    return ValidationError(id, target.type, getMessageString("validationError.string.tooShort", locale))
                }
                if(!applyConditionOnDocumentAnnotation(annotations) { it.singleValue?.value?.let { value -> value is String &&
                            (maxLen == null || value.length <= maxLen) } == true }) {
                    return ValidationError(id, target.type, getMessageString("validationError.string.tooLong", locale))
                }
            }
            is SpanTarget -> {
                commonSpanTargetAnnotationCheck(annotations, optional, locale)?.let { return it }
                if(!applyConditionOnAllSpanAnnotations(annotations) { it.singleValue?.value is String }) {
                    return ValidationError(id, target.type, getMessageString("validationError.typeMismatch.string", locale))
                }
                if(!applyConditionOnAllSpanAnnotations(annotations) { it.singleValue?.value?.let { value -> value is String &&
                            value.length >= minLength } == true }) {
                    return ValidationError(id, target.type, getMessageString("validationError.string.tooShort", locale))
                }
                if(!applyConditionOnAllSpanAnnotations(annotations) { it.singleValue?.value?.let { value -> value is String &&
                            (maxLen == null || value.length <= maxLen) } == true }) {
                    return ValidationError(id, target.type, getMessageString("validationError.string.tooLong", locale))
                }
            }
        }
        return null
    }

    override fun updateModel(newAnnotationDefinition: AnnotationDefinition) {
        super.updateModel(newAnnotationDefinition)
        if(newAnnotationDefinition is OpenTextAnnotationDefinition) {
            this.minLength = newAnnotationDefinition.minLength
            this.maxLength = newAnnotationDefinition.maxLength
            this.optional = newAnnotationDefinition.optional
        }
    }
}