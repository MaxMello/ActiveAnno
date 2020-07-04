package annotationdefinition.target

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

internal const val DOCUMENT_TARGET_STR = "DocumentTarget"
internal const val SPAN_TARGET_STR = "SpanTarget"
/**
 * The target of an annotation can be the whole document or a specific offset of characters, a span.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = DocumentTarget::class, name = DOCUMENT_TARGET_STR),
        JsonSubTypes.Type(value = SpanTarget::class, name = SPAN_TARGET_STR)
    ]
)
sealed class Target {
    abstract val type: TargetType
}


/**
 * Use this for annotations that should be created for the whole document.
 */
class DocumentTarget : Target() {

    @JsonIgnore
    override val type: TargetType = TargetType.DOCUMENT_TARGET

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
) : Target() {

    @JsonIgnore
    override val type: TargetType = TargetType.SPAN_TARGET
}

/**
 * What is the allowed cutoff point for a span, a single character or only whole tokens?
 */
enum class SpanGranularity {
    CHARACTER, TOKEN
}
