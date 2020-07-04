package document.annotation

import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanTarget
import annotationdefinition.target.Target
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo


/**
 * Base class for any annotation. An [Annotation] is defined as the actual value associated with an AnnotationDefinition. For example,
 * a BooleanAnnotationDefinition will produce a single annotation of boolean type. This annotation might be created by a human annotator, or
 * automatically generated or imported.
 * Every [Annotation] needs to be associated with an annotation ID / key in a map or comparable structure
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "target"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = DocumentTargetAnnotation::class, name = "document"),
        JsonSubTypes.Type(value = SpanTargetAnnotation::class, name = "span")
    ]
)
sealed class Annotation<T : Target>

/**
 * An annotation which is targeted on the whole document, not a specific part of it. For example, a class label "SPAM"
 * or "NO SPAM" for the whole document.
 */
data class DocumentTargetAnnotation(
    /**
     * We always store a set of values, even though some annotations will be 1 length lists (like a single boolean value). This is to streamline
     * to API and data handling in all steps.
     */
    val values: List<ValueToProbability>) : Annotation<DocumentTarget>() {

    /**
     * For annotations that only store a single value, never a list, this property is a shortcut to accessing it
     */
    val singleValue: ValueToProbability?
        @JsonIgnore get() = if(values.size == 1) values[0] else null

    /**
     * We overwrite equals (and hashCode) because while the order of values should be preserved, for comparison it should not matter
     */
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is DocumentTargetAnnotation) return false

        if (values.toSet() != other.values.toSet()) return false

        return true
    }

    override fun hashCode(): Int {
        return values.toSet().hashCode()
    }
}

/**
 * All annotation values for a single AnnotationDefinition on a span target are represented by a [SpanTargetAnnotation].
 * For example, a document might have spans of positive and negative sentiment. All annotations regarding sentiment would be
 * stored in a single [SpanTargetAnnotation], holding a list of [annotations] of which each defines the spans concering the annotation
 * as well as the actual value, in this case POSITIVE or NEGATIVE sentiment.
 */
data class SpanTargetAnnotation(val annotations: Set<SpanTargetSingleAnnotation>) : Annotation<SpanTarget>()

/**
 * A [SpanTargetSingleAnnotation] maps a single annotation value to the [spans] (often only a single span) which the annotation value
 * is associated with.
 */
data class SpanTargetSingleAnnotation(
    /**
     * A single annotation value can be associated with multiple spans, a span being defined by two numbers indicating the begin and end
     * of the span. Usually it will only be one span, but multiple ones are possible.
     */
    val spans: Set<Span>,
    /**
     * We always store a set of values, even though some annotations will be 1 length lists (like a single boolean value) This is to streamline
     * to API and data handling in all steps.
     */
    val values: List<ValueToProbability>
) {


    /**
     * Property that will sort annotations by span begin and end
     */
    val spansSorted: List<Span>
        @JsonIgnore
        get() = spans.sortedWith(compareBy<Span>{ it.begin }.thenBy { it.end })

    /**
     * For annotations that only store a single value, never a list, this property is a shortcut to accessing it
     */
    val singleValue: ValueToProbability?
        @JsonIgnore
        get() = if(values.size == 1) values[0] else null

    /**
     * We overwrite equals (and hashCode) because while the order of values should be preserved, for comparison it should not matter
     */
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is SpanTargetSingleAnnotation) return false

        if (spans!= other.spans) return false

        if (values.toSet() != other.values.toSet()) return false

        return true
    }

    override fun hashCode(): Int {
        var result = spans.hashCode()
        result = 31 * result + values.toSet().hashCode()
        return result
    }
}

/**
 * A span is a single piece of a string, expressed by [begin] and [end].
 *
 * When reading annotations, you can either extract the referenced substring by using the [begin] and [end] values,
 * or use the copy of the substring [text] directly.
 */
data class Span(
    /**
     * Inclusive start of span
     */
    val begin: Int,
    /**
     * Exclusive end of span
     */
    val end: Int,
    val text: String? = null
) {
    init {
        require(begin <= end) {
            "Span begin ($begin) not less or equal end ($end)"
        }
        require(text == null || (text.length == end - begin)) {
            "Span length (${end - begin}) does not match text length (${text?.length})"
        }
    }
}

/**
 * In some contexts, a [value] might have an associated [probability]. This is the case when annotations are imported or generated with a
 * probability of how likely this annotation has the value.
 */
data class ValueToProbability(
    val value: Any,
    val probability: Double? = null
) {
    init {
        require(value is String || value is Number || value is Boolean) {
            "Invalid data type for $this, only String, Number or Boolean allowed"
        }
    }

    /**
     * For [ValueToProbability], only the [value] is relevant for equals comparisons, because the probability might be missing and is only in this
     * model for generated annotations anyway.
     */
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ValueToProbability) return false

        if (value != other.value) return false

        return true
    }

    /**
     * The hashCode of [ValueToProbability] is equal the hashCode of [value] as this is really only a wrapper class for it
     */
    override fun hashCode(): Int {
        return value.hashCode()
    }
}