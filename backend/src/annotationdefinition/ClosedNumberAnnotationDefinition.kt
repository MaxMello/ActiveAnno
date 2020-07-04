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
 * Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider.
 */
class ClosedNumberAnnotationDefinition(
    id: AnnotationID,
    name: String,
    shortName: String?,
    createdTimestamp: Long = System.currentTimeMillis(),
    var min: Double,
    var max: Double,
    var step: Double,
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
                if(!applyConditionOnDocumentAnnotation(annotations) { it.singleValue?.value?.let { value ->
                        value.toDoubleOrNull() != null
                    } == true }) return ValidationError(id, target
                    .type, getMessageString("validationError.typeMismatch.number", locale))
                if(!applyConditionOnDocumentAnnotation(annotations) { it.singleValue?.value?.let { value ->
                        value.toDoubleOrNull()?.let { number ->
                            number in min..max
                        } == true
                    } == true }) return ValidationError(id, target
                    .type, getMessageString("validationError.number.outsideMinMax", locale))
                if(!applyConditionOnDocumentAnnotation(annotations) { it.singleValue?.value?.let { value ->
                        value.toDoubleOrNull()?.isRemainderZero(step) == true
                    } == true }) return ValidationError(id, target
                    .type, getMessageString("validationError.number.invalidStep", locale))
            }
            is SpanTarget -> {
                commonSpanTargetAnnotationCheck(annotations, optional, locale)?.let { return it }
            }
        }
        return null
    }

    override fun updateModel(newAnnotationDefinition: AnnotationDefinition) {
        super.updateModel(newAnnotationDefinition)
        if(newAnnotationDefinition is ClosedNumberAnnotationDefinition) {
            this.min = newAnnotationDefinition.min
            this.max = newAnnotationDefinition.max
            this.step = newAnnotationDefinition.step
            this.optional = newAnnotationDefinition.optional
        }
    }
}