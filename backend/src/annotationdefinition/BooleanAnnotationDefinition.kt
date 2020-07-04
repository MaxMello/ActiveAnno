package annotationdefinition

import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanTarget
import annotationdefinition.target.Target
import api.annotate.dto.ValidationError
import common.getMessageString
import document.annotation.AnnotationMap
import java.util.*

/**
 * Annotation for a boolean input.
 */
class BooleanAnnotationDefinition(
    id: AnnotationID,
    name: String,
    shortName: String?,
    createdTimestamp: Long = System.currentTimeMillis(),
    var optional: Boolean = false
) : AnnotationDefinition(id, name, shortName, createdTimestamp) {

    override fun validateAnnotation(
        annotations: AnnotationMap,
        target: Target,
        locale: Locale?
    ): ValidationError? {
        commonCheck(annotations, optional, target, locale)?.let { return it }
        when (target) {
            is DocumentTarget -> {
                commonDocumentTargetAnnotationCheck(annotations, optional, locale)?.let { return it }
                if(!applyConditionOnDocumentAnnotation(annotations) { it.singleValue?.value is Boolean }) {
                    return ValidationError(id, target.type, getMessageString("validationError.typeMismatch.boolean", locale))
                }
            }
            is SpanTarget -> {
                commonSpanTargetAnnotationCheck(annotations, optional, locale)?.let { return it }
                if(!applyConditionOnAllSpanAnnotations(annotations) {
                        it.singleValue?.value is Boolean }) {
                    return ValidationError(id, target.type, getMessageString("validationError.typeMismatch.boolean", locale))
                }
            }
        }
        return null
    }

    override fun updateModel(newAnnotationDefinition: AnnotationDefinition) {
        super.updateModel(newAnnotationDefinition)
        if(newAnnotationDefinition is BooleanAnnotationDefinition) {
            this.optional = newAnnotationDefinition.optional
        }
    }

}