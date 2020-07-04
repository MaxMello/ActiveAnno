package annotationdefinition

import annotationdefinition.TagSetAnnotationDefinition.TagSetOption
import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanTarget
import annotationdefinition.target.Target
import api.annotate.dto.ValidationError
import common.getMessageString
import document.annotation.*
import document.annotation.Annotation
import java.util.*

/**
 * Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption]s
 */
class TagSetAnnotationDefinition(
    id: AnnotationID,
    name: String,
    shortName: String?,
    createdTimestamp: Long = System.currentTimeMillis(),
    var minNumberOfTags: Int = 1,
    var maxNumberOfTags: Int? = null,
    var options: List<TagSetOption>
) : AnnotationDefinition(id, name, shortName, createdTimestamp) {

    /**
     * Option for a tag set.
     */
    data class TagSetOption(
        /**
         * Unique ID for the tag set option, needs to be unique for the annotation. If you want comparability across annotations,
         * you might want to re-use them if it makes sense.
         */
        val id: String,
        /**
         * Short, clear name describing the option. Will be displayed in a button or dropdown.
         */
        val name: String,
        /**
         * Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e.
         * for inline span labels
         */
        val shortName: String?
    )

    override fun validateAnnotation(
        annotations: AnnotationMap,
        target: Target,
        locale: Locale?
    ): ValidationError? {
        val checkOptions = options.map { it.id }
        commonCheck(annotations, minNumberOfTags == 0, target, locale)?.let { return it }
        val maxNrTags = maxNumberOfTags
        when (target) {
            is DocumentTarget -> {
                commonDocumentTargetAnnotationCheck(annotations, minNumberOfTags == 0, locale)?.let { return it }
                if(minNumberOfTags > 0 && !applyConditionOnDocumentAnnotation(annotations) { it.values.size >= minNumberOfTags}) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.notEnough", locale))
                }
                if(!applyConditionOnDocumentAnnotation(annotations) { (maxNrTags == null || it.values.size <=
                            maxNrTags)}) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.tooMany", locale))
                }
                if(!applyConditionOnDocumentAnnotation(annotations) {
                        it.values.all { option -> option.value is String && option.value in checkOptions }}) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.notInOptions", locale))
                }
            }
            is SpanTarget -> {
                commonSpanTargetAnnotationCheck(annotations, minNumberOfTags == 0, locale)?.let { return it }
                if(minNumberOfTags > 0 && applyConditionOnAllSpanAnnotations(annotations) { it.values.size >= minNumberOfTags }) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.notEnough", locale))
                }
                if(!applyConditionOnAllSpanAnnotations(annotations) {
                        (maxNrTags == null || it.values.size <= maxNrTags) }) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.tooMany", locale))
                }
                if(!applyConditionOnAllSpanAnnotations(annotations) {
                        it.values.all { option -> option.value is String && option.value in checkOptions }}) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.notInOptions", locale))
                }
            }
        }
        return null
    }

    override fun transformGeneratedAnnotation(annotation: Annotation<*>): Annotation<*> {
        val maxNrOfTags = this.maxNumberOfTags
        return when(annotation) {
            is DocumentTargetAnnotation -> {
                val filteredValues = if ((maxNrOfTags == null || maxNrOfTags > 1)) {
                    // multiClass = all above 0.5 + limited by max number of tags
                    annotation.values.filter { it.probability != null && it.probability > 0.5 }.let {
                        if(maxNrOfTags != null) {
                            it.take(maxNrOfTags)
                        } else {
                            it
                        }
                    }
                } else {
                    // MaxNumberOfTags = 1
                    annotation.values.sortedByDescending { it.probability ?: 0.0 }.take(minNumberOfTags)
                }
                DocumentTargetAnnotation(filteredValues)
            }
            is SpanTargetAnnotation -> {
                SpanTargetAnnotation(
                    annotation.annotations.map {
                        SpanTargetSingleAnnotation(it.spans,
                        if ((maxNrOfTags == null || maxNrOfTags > 1)) {
                            // OVA = all above 0.5
                            it.values.filter { it.probability != null && it.probability > 0.5 }
                        } else {
                            it.values.sortedByDescending { it.probability ?: 0.0 }.take(minNumberOfTags)
                        })
                    }.toSet()
                )
            }
        }
    }

    override fun updateModel(newAnnotationDefinition: AnnotationDefinition) {
        super.updateModel(newAnnotationDefinition)
        if(newAnnotationDefinition is TagSetAnnotationDefinition) {
            this.maxNumberOfTags = newAnnotationDefinition.maxNumberOfTags
            this.minNumberOfTags = newAnnotationDefinition.minNumberOfTags
            this.options = this.options.map { oldOption ->
                TagSetOption(oldOption.id,
                    newAnnotationDefinition.options.firstOrNull { it.id == oldOption.id }?.name ?: oldOption.name,
                    newAnnotationDefinition.options.firstOrNull { it.id == oldOption.id }?.shortName ?: oldOption.shortName
                )
            }
        }
    }
}

