package project.annotationschema

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import common.getNestedKey
import document.Document
import document.annotation.AnnotationMap
import document.annotation.DocumentTargetAnnotation
import document.annotation.SpanTargetAnnotation

/**
 * [AnnotationSchemaElement]s can be conditional, defined by an [EnableCondition].
 * If an [EnableCondition] is null, that means it is always required. Else, the enable conditions [execute] method needs to return true
 * for the element to be prompted.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = ValuesIntersect::class, name = "ValuesIntersect"),
        JsonSubTypes.Type(value = ValuesEqual::class, name = "ValuesEqual"),
        JsonSubTypes.Type(value = ValuesExist::class, name = "ValuesExist"),
        JsonSubTypes.Type(value = And::class, name = "And"),
        JsonSubTypes.Type(value = Or::class, name = "Or"),
        JsonSubTypes.Type(value = Not::class, name = "Not")
    ]
)
abstract class EnableCondition {
    abstract fun execute(document: Document, annotations: AnnotationMap): Boolean
}

/**
 * [AtomicEnableCondition]s are defined in relation to a single [referenceKey] and do not include more complex conditions
 * such as [And] or [Or].
 */
abstract class AtomicEnableCondition(val referenceKey: AnnotationStepKey) : EnableCondition() {

    override fun execute(document: Document, annotations: AnnotationMap): Boolean {
        return when (referenceKey) {
            is OriginalDocumentKey -> {
                applyCondition(document.originalDocument.getNestedKey(referenceKey.key)?.asText()?.let {
                    setOf(it)
                } ?: setOf())
            }
            is AnnotationsKey -> {
                applyCondition(annotations[referenceKey.key]?.let {
                    when(it) {
                        is DocumentTargetAnnotation -> {
                            it.values.map { it.value.toString() }.toSet()
                        }
                        is SpanTargetAnnotation -> {
                            it.annotations.flatMap { it.values.map { it.value.toString() } }.toSet()
                        }
                    }
                } ?: setOf())
            }
        }
    }

    abstract fun applyCondition(values: Set<String>): Boolean

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is AtomicEnableCondition) return false

        if (referenceKey != other.referenceKey) return false

        return true
    }

    override fun hashCode(): Int {
        return referenceKey.hashCode()
    }

}

class ValuesIntersect(referenceKey: AnnotationStepKey, val comparisonValues: Set<String>) : AtomicEnableCondition(referenceKey) {
    override fun applyCondition(values: Set<String>): Boolean {
        return comparisonValues.intersect(values).isNotEmpty()
    }

    override fun toString(): String {
        return "ValuesIntersect(referenceKey=${referenceKey}, comparisonValues=$comparisonValues)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ValuesIntersect) return false
        if (!super.equals(other)) return false

        if (comparisonValues != other.comparisonValues) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + comparisonValues.hashCode()
        return result
    }

}

class ValuesEqual(referenceKey: AnnotationStepKey, val comparisonValues: Set<String>) : AtomicEnableCondition(referenceKey) {
    override fun applyCondition(values: Set<String>): Boolean {
        return comparisonValues.toSet() == values.toSet()
    }

    override fun toString(): String {
        return "ValuesEqual(referenceKey=${referenceKey}, comparisonValues=$comparisonValues)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ValuesEqual) return false

        if (comparisonValues != other.comparisonValues) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + comparisonValues.hashCode()
        return result
    }

}

class ValuesExist(referenceKey: AnnotationStepKey) : AtomicEnableCondition(referenceKey) {
    override fun applyCondition(values: Set<String>): Boolean {
        return values.isNotEmpty()
    }

    override fun toString(): String {
        return "ValuesNotEmpty(referenceKey=${referenceKey})"
    }
}

data class And(val children: Set<EnableCondition>) : EnableCondition() {
    override fun execute(document: Document, annotations: AnnotationMap): Boolean {
        return children.isNotEmpty() && children.all { it.execute(document, annotations) }
    }

    override fun toString(): String {
        return "And(children=$children)"
    }
}

data class Or(val children: Set<EnableCondition>) : EnableCondition() {
    override fun execute(document: Document, annotations: AnnotationMap): Boolean {
        return children.isNotEmpty() && children.any { it.execute(document, annotations) }
    }

    override fun toString(): String {
        return "Or(children=$children)"
    }
}

data class Not(val child: EnableCondition) : EnableCondition() {
    override fun execute(document: Document, annotations: AnnotationMap): Boolean {
        return !child.execute(document, annotations)
    }

    override fun toString(): String {
        return "Not(child=$child)"
    }
}