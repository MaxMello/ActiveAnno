package config.annotations

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import common.mapInPlace

typealias AnnotationID = String

data class Annotations(
    val annotationMap: Map<String, BaseAnnotation>
)

/**
 * The target of an annotation can be the whole document or a specific offset of characters, a span.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = DocumentTarget::class, name = "DocumentTarget"),
    JsonSubTypes.Type(value = SpanTarget::class, name = "SpanTarget")
])
interface Target

/**
 * Use this for annotations that should be created for the whole document.
 */
class DocumentTarget : Target {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        return true
    }

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }

    override fun toString(): String {
        return "DocumentTarget()"
    }
}

/**
 * Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set.
 */
data class SpanTarget(
    val granularity: SpanGranularity,
    /**
     * Allow multiple tokens in a single span. Example:
     *     "A great comment". Span: "great comment". If false, only "A", "great" or "comment" would be allowed.
     */
    val multiToken: Boolean = true,
    /**
     * Trim whitespaces from spans automatically
     */
    val trimWhitespace: Boolean = true,
    /**
     * Trim punctuation from spans automatically
     */
    val trimPunctuation: Boolean = true,
    /**
     * Allow other annotations on top of this one. For example, "A great comment" where "comment" is already labeled,
     * allow "great comment" to also be labeled with either another or the same
     */
    val allowStacking: Boolean = true,
    /**
     * Minimum number of spans for the annotation, default = null, meaning no limit.
     * Only relevant if annotation itself is required, else this value is not checked.
     */
    val minNumberOfSpans: Int? = null,
    /**
     * Maximum number of spans. Default = null, meaning no limit. For example, if value = 3, the annotation can have
     * 3 separate spans.
     */
    val maxNumberOfSpans: Int? = null
) : Target

/**
 * What is the allowed cutoff point for a span, a single character or only whole tokens?
 */
enum class SpanGranularity {
    CHARACTER, TOKEN
}

/**
 * Base class for all annotations.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = PredefinedTagSetAnnotation::class, name = "PredefinedTagSetAnnotation"),
    JsonSubTypes.Type(value = OpenTagAnnotation::class, name = "OpenTagAnnotation"),
    JsonSubTypes.Type(value = OpenTextAnnotation::class, name = "OpenTextAnnotation"),
    JsonSubTypes.Type(value = BooleanAnnotation::class, name = "BooleanAnnotation"),
    JsonSubTypes.Type(value = OpenNumberAnnotation::class, name = "OpenNumberAnnotation"),
    JsonSubTypes.Type(value = ClosedNumberAnnotation::class, name = "ClosedNumberAnnotation"),
    JsonSubTypes.Type(value = NumberRangeAnnotation::class, name = "NumberRangeAnnotation")
])
abstract class BaseAnnotation(
    /**
     * Every annotation needs a unique ID (inside the project scope). It is advisable to re-use the same ids for the same
     * annotations across projects to have easier integration when merging the data outside the service. For example,
     * a sentiment score annotation might always have the id "SENTIMENT_SCORE" across all projects.
     */
    val id: AnnotationID,
    /**
     * The primary, human readable name of the annotation. Should be clear, but not too long. Additional explanations might be given
     * via Layout elements, but in the best case, that would not be necessary. For example "Sentiment score" for sentiment, or
     * "Contains personal data" for a boolean annotation.
     */
    val name: String,
    /**
     * Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e.
     * for inline span labels
     */
    val shortName: String?,
    /**
     * The targets for the annotation, can be span, document or both. Should not be empty.
     */
    val targets: Set<Target>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is BaseAnnotation) return false

        if (id != other.id) return false
        if (name != other.name) return false
        if (shortName != other.shortName) return false
        if (targets != other.targets) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + (shortName?.hashCode() ?: 0)
        result = 31 * result + targets.hashCode()
        return result
    }

    override fun toString(): String {
        return "BaseAnnotation(id='$id', name='$name', shortName=$shortName, targets=$targets)"
    }
}

class PredefinedTagSetAnnotation(
    id: AnnotationID,
    name: String,
    shortName: String?,
    targets: Set<Target>,
    val minNumberOfTags: Int = 1,
    val maxNumberOfTags: Int = 1,
    val options: List<TagSetOption>
) : BaseAnnotation(id, name, shortName, targets) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is PredefinedTagSetAnnotation) return false
        if (!super.equals(other)) return false

        if (minNumberOfTags != other.minNumberOfTags) return false
        if (maxNumberOfTags != other.maxNumberOfTags) return false
        if (options != other.options) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + minNumberOfTags
        result = 31 * result + maxNumberOfTags
        result = 31 * result + options.hashCode()
        return result
    }

    override fun toString(): String {
        return "PredefinedTagSetAnnotation(id='$id', name='$name', shortName=$shortName, targets=$targets, minNumberOfTags=$minNumberOfTags, maxNumberOfTags=$maxNumberOfTags, options=$options)"
    }


}

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

/**
 * Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string
 */
class OpenTagAnnotation(
    id: AnnotationID,
    name: String,
    shortName: String?,
    targets: Set<Target>,
    val minNumberOfTags: Int = 1,
    val maxNumberOfTags: Int = 1,
    val trimWhitespace: Boolean = true,
    val caseBehavior: CaseBehavior = CaseBehavior.KEEP_ORIGINAL,
    val useExistingValuesAsPredefinedTags: Boolean = false,
    val predefinedTags: MutableList<String>
) : BaseAnnotation(id, name, shortName, targets) {

    init {
        predefinedTags.mapInPlace {
            when(caseBehavior) {
                CaseBehavior.KEEP_ORIGINAL -> it
                CaseBehavior.CAPITALIZE -> it.toLowerCase().capitalize()
                CaseBehavior.TO_LOWER -> it.toLowerCase()
                CaseBehavior.TO_UPPER -> it.toUpperCase()
            }.let { str ->
                if(trimWhitespace) {
                    str.trim()
                } else {
                    str
                }
            }
        }
    }

    override fun toString(): String {
        return "OpenTagAnnotation(id='$id', name='$name', targets=$targets, minNumberOfTags=$minNumberOfTags, maxNumberOfTags=$maxNumberOfTags, trimWhitespace=$trimWhitespace, caseBehavior=$caseBehavior, useExistingValuesAsPredefinedTags=$useExistingValuesAsPredefinedTags, predefinedTags=$predefinedTags)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is OpenTagAnnotation) return false
        if (!super.equals(other)) return false

        if (minNumberOfTags != other.minNumberOfTags) return false
        if (maxNumberOfTags != other.maxNumberOfTags) return false
        if (trimWhitespace != other.trimWhitespace) return false
        if (caseBehavior != other.caseBehavior) return false
        if (useExistingValuesAsPredefinedTags != other.useExistingValuesAsPredefinedTags) return false
        if (predefinedTags != other.predefinedTags) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + minNumberOfTags
        result = 31 * result + maxNumberOfTags
        result = 31 * result + trimWhitespace.hashCode()
        result = 31 * result + caseBehavior.hashCode()
        result = 31 * result + useExistingValuesAsPredefinedTags.hashCode()
        result = 31 * result + predefinedTags.hashCode()
        return result
    }
}

/**
 * Annotation for some open text input
 */
class OpenTextAnnotation(
    id: AnnotationID,
    name: String,
    shortName: String?,
    targets: Set<Target>,
    val minLength: Int = 1,
    val maxLength: Int? = null,
    /**
     * Use this option to copy target of annotation into input field automatically. Useful for orthographic corrections
     */
    val useDocumentTextAsDefault: Boolean = true,
    /**
     * Only applicable if useTargetAsDefault = true, will apply autocorrect on the target
     */
    val applyAutoCorrectOnTarget: Boolean = false,
    val optional: Boolean = false
) : BaseAnnotation(id, name, shortName, targets) {


    override fun toString(): String {
        return "OpenTextAnnotation(id='$id', name='$name', targets=$targets, minLength=$minLength, maxLength=$maxLength, useDocumentTextAsDefault=$useDocumentTextAsDefault, applyAutoCorrectOnTarget=$applyAutoCorrectOnTarget, optional=$optional)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is OpenTextAnnotation) return false
        if (!super.equals(other)) return false

        if (minLength != other.minLength) return false
        if (maxLength != other.maxLength) return false
        if (useDocumentTextAsDefault != other.useDocumentTextAsDefault) return false
        if (applyAutoCorrectOnTarget != other.applyAutoCorrectOnTarget) return false
        if (optional != other.optional) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + minLength
        result = 31 * result + (maxLength ?: 0)
        result = 31 * result + useDocumentTextAsDefault.hashCode()
        result = 31 * result + applyAutoCorrectOnTarget.hashCode()
        result = 31 * result + optional.hashCode()
        return result
    }


}

/**
 * Annotation for a boolean input.
 */
class BooleanAnnotation(
    id: AnnotationID,
    name: String,
    shortName: String?,
    targets: Set<Target>,
    val optional: Boolean = false
) : BaseAnnotation(id, name, shortName, targets) {

    override fun toString(): String {
        return "BooleanAnnotation(id='$id', name='$name', targets=$targets, optional=$optional)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is BooleanAnnotation) return false
        if (!super.equals(other)) return false

        if (optional != other.optional) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + optional.hashCode()
        return result
    }
}

/**
 * Annotation for an unrestricted number. Cannot be displayed as a slider, only number input.
 */
class OpenNumberAnnotation(
    id: AnnotationID,
    name: String,
    shortName: String?,
    targets: Set<Target>,
    val step: Double? = null,
    val optional: Boolean = false
) : BaseAnnotation(id, name, shortName, targets) {

    override fun toString(): String {
        return "OpenNumberAnnotation(id='$id', name='$name', targets=$targets, step=$step, optional=$optional)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is OpenNumberAnnotation) return false
        if (!super.equals(other)) return false

        if (step != other.step) return false
        if (optional != other.optional) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + (step?.hashCode() ?: 0)
        result = 31 * result + optional.hashCode()
        return result
    }
}

/**
 * Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider.
 */
class ClosedNumberAnnotation(
    id: AnnotationID,
    name: String,
    shortName: String?,
    targets: Set<Target>,
    val min: Double,
    val max: Double,
    val step: Double,
    val optional: Boolean = false
) : BaseAnnotation(id, name, shortName, targets) {

    override fun toString(): String {
        return "ClosedNumberAnnotation(id='$id', name='$name', targets=$targets, min=$min, max=$max, step=$step, optional=$optional)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ClosedNumberAnnotation) return false
        if (!super.equals(other)) return false

        if (min != other.min) return false
        if (max != other.max) return false
        if (step != other.step) return false
        if (optional != other.optional) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + min.hashCode()
        result = 31 * result + max.hashCode()
        result = 31 * result + step.hashCode()
        result = 31 * result + optional.hashCode()
        return result
    }
}

/**
 * A number range between [min] and [max] with [step] steps between. Results in two values, a lower and upper value.
 */
class NumberRangeAnnotation(
    id: AnnotationID,
    name: String,
    shortName: String?,
    targets: Set<Target>,
    val min: Double,
    val max: Double,
    val step: Double,
    val optional: Boolean = false
) : BaseAnnotation(id, name, shortName, targets) {

    override fun toString(): String {
        return "NumberRangeAnnotation(id='$id', name='$name', targets=$targets, min=$min, max=$max, step=$step, optional=$optional)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is NumberRangeAnnotation) return false
        if (!super.equals(other)) return false

        if (min != other.min) return false
        if (max != other.max) return false
        if (step != other.step) return false
        if (optional != other.optional) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + min.hashCode()
        result = 31 * result + max.hashCode()
        result = 31 * result + step.hashCode()
        result = 31 * result + optional.hashCode()
        return result
    }
}

/**
 * A set of predefined options nested in a hierarchical fashion, for example
 *     name = Location
 *     options = Germany(children = Berlin, Hamburg, Lower Saxony(children = Hannover, Oldenburg, Wolfsburg)))
 *
 * Similar to PredefinedTagSetAnnotation, except the support for hierarchical tags
 */
class HierarchicalTagSetAnnotation(
    id: AnnotationID,
    name: String,
    shortName: String?,
    targets: Set<Target>,
    val minNumberOfTags: Int = 1,
    val maxNumberOfTags: Int = 1,
    val options: List<HierarchicalTagSetOption>
) : BaseAnnotation(id, name, shortName, targets) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is HierarchicalTagSetAnnotation) return false
        if (!super.equals(other)) return false

        if (minNumberOfTags != other.minNumberOfTags) return false
        if (maxNumberOfTags != other.maxNumberOfTags) return false
        if (options != other.options) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + minNumberOfTags
        result = 31 * result + maxNumberOfTags
        result = 31 * result + options.hashCode()
        return result
    }

    override fun toString(): String {
        return "HierarchicalTagSetAnnotation(id='$id', name='$name', shortName=$shortName, targets=$targets, minNumberOfTags=$minNumberOfTags, maxNumberOfTags=$maxNumberOfTags, options=$options)"
    }
}

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