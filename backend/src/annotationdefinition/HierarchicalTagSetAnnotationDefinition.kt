package annotationdefinition

import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanTarget
import annotationdefinition.target.Target
import api.annotate.dto.ValidationError
import common.getMessageString
import document.annotation.AnnotationMap
import java.util.*

/**
 * Annotation definition which requests the annotator to chose from a set of predefined [HierarchicalTagSetOption]s
 */
class HierarchicalTagSetAnnotationDefinition(
    id: AnnotationID,
    name: String,
    shortName: String?,
    createdTimestamp: Long = System.currentTimeMillis(),
    var minNumberOfTags: Int = 1,
    var maxNumberOfTags: Int? = null,
    /**
     * Prevents chosing higher level options when those options have any children
     */
    val requireDeepestLevel: Boolean = false,
    val options: List<HierarchicalTagSetOption>
) : AnnotationDefinition(id, name, shortName, createdTimestamp) {

    /**
     * Option for a hierarchical tag set.
     */
    data class HierarchicalTagSetOption(
        val id: String,
        val name: String,
        /**
         * Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e.
         * for inline span labels
         */
        val shortName: String?,
        val children: List<HierarchicalTagSetOption>? = null
    )

    override fun validateAnnotation(
        annotations: AnnotationMap,
        target: Target,
        locale: Locale?
    ): ValidationError? {
        val checkOptions = (if(requireDeepestLevel) getOptionsDeepestLevel() else getAllOptions()).map { it.id }
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
                if(!applyConditionOnDocumentAnnotation(annotations) { it.values.all {
                            option -> option.value is String && option.value in checkOptions }}) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.notInOptions", locale))
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
                if(!applyConditionOnAllSpanAnnotations(annotations) {
                        it.values.all { option -> option.value is String && option.value in checkOptions }}) {
                    return ValidationError(id, target.type, getMessageString("validationError.tags.notInOptions", locale))
                }
            }
        }
        return null
    }

    override fun updateModel(newAnnotationDefinition: AnnotationDefinition) {
        super.updateModel(newAnnotationDefinition)
        if(newAnnotationDefinition is HierarchicalTagSetAnnotationDefinition) {
            this.maxNumberOfTags = newAnnotationDefinition.maxNumberOfTags
            this.minNumberOfTags = newAnnotationDefinition.minNumberOfTags
        }
    }
}

fun HierarchicalTagSetAnnotationDefinition.getAllOptions(): List<HierarchicalTagSetAnnotationDefinition.HierarchicalTagSetOption> {
    fun recursiveFlatten(options: List<HierarchicalTagSetAnnotationDefinition.HierarchicalTagSetOption>):
            List<HierarchicalTagSetAnnotationDefinition.HierarchicalTagSetOption> {
        return options + options.flatMap { it.children?.let { children -> recursiveFlatten(children) } ?: listOf() }
    }
    return recursiveFlatten(options)
}

fun HierarchicalTagSetAnnotationDefinition.getOptionsDeepestLevel(): List<HierarchicalTagSetAnnotationDefinition.HierarchicalTagSetOption> {
    fun recursiveFlatten(options: List<HierarchicalTagSetAnnotationDefinition.HierarchicalTagSetOption>):
            List<HierarchicalTagSetAnnotationDefinition.HierarchicalTagSetOption> {
        return options.flatMap {
            (if (it.children == null) listOf(it) else listOf()) +
                    (it.children?.let { children -> recursiveFlatten(children) } ?: listOf())
        }
    }
    return recursiveFlatten(options)
}