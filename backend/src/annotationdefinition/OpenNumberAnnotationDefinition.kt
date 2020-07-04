package annotationdefinition

import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanTarget
import annotationdefinition.target.Target
import api.annotate.dto.ValidationError
import common.getMessageString
import common.isRemainderZero
import common.toDoubleOrNull
import document.annotation.AnnotationMap
import java.util.*

/**
 * Annotation for an unrestricted number. Cannot be displayed as a slider, only number input.
 */
class OpenNumberAnnotationDefinition(
    id: AnnotationID,
    name: String,
    shortName: String?,
    createdTimestamp: Long = System.currentTimeMillis(),
    var step: Double? = null,
    var optional: Boolean = false
) : AnnotationDefinition(id, name, shortName, createdTimestamp) {

    override fun validateAnnotation(
        annotations: AnnotationMap,
        target: Target,
        locale: Locale?
    ): ValidationError? {
        val stepSize = step
        commonCheck(annotations, optional, target, locale)?.let { return it }
        when (target) {
            is DocumentTarget -> {
                commonDocumentTargetAnnotationCheck(annotations, optional, locale)?.let { return it }
                if(!applyConditionOnDocumentAnnotation(annotations) {
                        it.singleValue?.value?.let { value -> value.toDoubleOrNull() != null } == true }) {
                    return ValidationError(id, target.type, getMessageString("validationError.typeMismatch.number", locale)
                    )
                }
                if(stepSize != null && !applyConditionOnDocumentAnnotation(annotations) { it.singleValue?.value?.let { value ->
                        value.toDoubleOrNull()?.isRemainderZero(stepSize) == true
                    } == true }) return ValidationError(id, target
                    .type, getMessageString("validationError.number.invalidStep", locale)
                )
            }
            is SpanTarget -> {
                commonSpanTargetAnnotationCheck(annotations, optional, locale)?.let { return it }
                if(!applyConditionOnAllSpanAnnotations(annotations) {
                        stepSize != null && (it.singleValue?.value
                            ?.let { value -> value.toDoubleOrNull()?.isRemainderZero(stepSize) == true } == true)}) {
                    return ValidationError(id, target.type, getMessageString("validationError.number.invalidStep", locale))
                }
            }
        }
        return null
    }

    override fun updateModel(newAnnotationDefinition: AnnotationDefinition) {
        super.updateModel(newAnnotationDefinition)
        if(newAnnotationDefinition is OpenNumberAnnotationDefinition) {
            this.step = newAnnotationDefinition.step
            this.optional = newAnnotationDefinition.optional
        }
    }
}