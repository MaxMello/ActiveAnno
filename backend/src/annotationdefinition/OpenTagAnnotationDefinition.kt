package annotationdefinition

import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanTarget
import annotationdefinition.target.Target
import api.annotate.dto.ValidationError
import common.getMessageString
import document.annotation.AnnotationMap
import java.util.*

/**
 * Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string
 */
class OpenTagAnnotationDefinition(
    id: AnnotationID,
    name: String,
    shortName: String?,
    createdTimestamp: Long = System.currentTimeMillis(),
    var minNumberOfTags: Int = 1,
    var maxNumberOfTags: Int? = null,
    val trimWhitespace: Boolean = true,
    val caseBehavior: CaseBehavior = CaseBehavior.KEEP_ORIGINAL,
    var useExistingValuesAsPredefinedTags: Boolean = false,
    var predefinedTags: MutableList<String>
) : AnnotationDefinition(id, name, shortName, createdTimestamp) {

    override fun validateAnnotation(
        annotations: AnnotationMap,
        target: Target,
        locale: Locale?
    ): ValidationError? {
        commonCheck(annotations, minNumberOfTags == 0, target, locale)?.let { return it }
        val maxNrTags = maxNumberOfTags
        when (target) {
            is DocumentTarget -> {
                commonDocumentTargetAnnotationCheck(annotations, minNumberOfTags == 0, locale)?.let { return it }
                if(minNumberOfTags > 0 && !applyConditionOnDocumentAnnotation(annotations) { it.values.size >= minNumberOfTags}) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.notEnough", locale))
                }
                if(!applyConditionOnDocumentAnnotation(annotations) { (maxNrTags == null || it.values.size <= maxNrTags)}) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.tooMany", locale))
                }
                if(!applyConditionOnDocumentAnnotation(annotations) { it.values.all { it.value is String }}) {
                    return ValidationError(id, target.type, getMessageString("validationError.typeMismatch.tags", locale))
                }
            }
            is SpanTarget -> {
                commonSpanTargetAnnotationCheck(annotations, minNumberOfTags == 0, locale)?.let { return it }
                if(minNumberOfTags > 0 && !applyConditionOnAllSpanAnnotations(annotations) { it.values.size >= minNumberOfTags }) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.notEnough", locale))
                }
                if(!applyConditionOnAllSpanAnnotations(annotations) { (maxNrTags == null || it.values.size <= maxNrTags) }) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.tooMany", locale))
                }
                if(!applyConditionOnAllSpanAnnotations(annotations) { it.values.all { it.value is String } }) {
                    return ValidationError(id, target.type, getMessageString("validationError.typeMismatch.tags", locale))
                }
            }
        }
        return null
    }

    override fun updateModel(newAnnotationDefinition: AnnotationDefinition) {
        super.updateModel(newAnnotationDefinition)
        if(newAnnotationDefinition is OpenTagAnnotationDefinition) {
            this.minNumberOfTags = newAnnotationDefinition.minNumberOfTags
            this.maxNumberOfTags = newAnnotationDefinition.maxNumberOfTags
            this.useExistingValuesAsPredefinedTags = newAnnotationDefinition.useExistingValuesAsPredefinedTags
            this.predefinedTags = newAnnotationDefinition.predefinedTags
        }
    }
}

/**
 * How to handle differences in cases between tags?
 */
enum class CaseBehavior {
    /**
     * Keep case as is, allowing "tag", "Tag", "tAg", ... to exist side by side
     */
    KEEP_ORIGINAL,
    /**
     * Lower case all tags, "TAG", "Tag" => "tag"
     */
    TO_LOWER,
    /**
     * Upper case all tags, "tag", "Tag" => "TAG"
     */
    TO_UPPER,
    /**
     * Capitalize all tags, "tags, "tAGS" => "Tags"
     */
    CAPITALIZE
}