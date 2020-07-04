package annotationdefinition.generator

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import document.annotation.Annotation
import document.annotation.DocumentTargetAnnotation
import document.annotation.SpanTargetAnnotation

/**
 * Condition system which decides if a generated annotation can be finalized automatically
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = FinalizeCondition.Always::class, name = "Always"),
        JsonSubTypes.Type(value = FinalizeCondition.ProbabilityGreaterThanEquals::class, name = "ProbabilityGreaterThanEquals"),
        JsonSubTypes.Type(value = FinalizeCondition.ValueIn::class, name = "ValueIn"),
        JsonSubTypes.Type(value = FinalizeCondition.SetEquals::class, name = "SetEquals"),
        JsonSubTypes.Type(value = FinalizeCondition.And::class, name = "And"),
        JsonSubTypes.Type(value = FinalizeCondition.Or::class, name = "Or"),
        JsonSubTypes.Type(value = FinalizeCondition.Not::class, name = "Not")
    ]
)
sealed class FinalizeCondition {

    abstract fun execute(annotation: Annotation<*>): Boolean

    /**
     * Always finalize / green light a generated annotation
     */
    object Always : FinalizeCondition() {

        override fun execute(annotation: Annotation<*>): Boolean {
            return true
        }
    }

    /**
     * Decision based on probability of prediction
     */
    data class ProbabilityGreaterThanEquals(val threshold: Double): FinalizeCondition() {

        override fun execute(annotation: Annotation<*>): Boolean {
            return when(annotation) {
                is DocumentTargetAnnotation -> {
                    annotation.values.isNotEmpty() && annotation.values.all { it.probability != null && it.probability >= threshold }
                }
                is SpanTargetAnnotation -> {
                    annotation.annotations.isNotEmpty() && annotation.annotations.all { spanTargetGeneratedAnnotation ->
                        spanTargetGeneratedAnnotation.values.isNotEmpty() &&
                                spanTargetGeneratedAnnotation.values.all { it.probability != null && it.probability >= threshold }
                    }
                }
            }
        }
    }

    data class ValueIn(val value: Any): FinalizeCondition() {
        override fun execute(annotation: Annotation<*>): Boolean {
            return when(annotation) {
                is DocumentTargetAnnotation -> {
                    annotation.values.any { it.value == value }
                }
                is SpanTargetAnnotation -> {
                    annotation.annotations.any { spanTargetGeneratedAnnotation ->
                        spanTargetGeneratedAnnotation.values.any { it.value == value }
                    }
                }
            }
        }
    }

    data class SetEquals(val set: Set<Any>): FinalizeCondition() {
        override fun execute(annotation: Annotation<*>): Boolean {
            return when(annotation) {
                is DocumentTargetAnnotation -> {
                    annotation.values.map { it.value }.toSet() == set
                }
                is SpanTargetAnnotation -> {
                    annotation.annotations.any { spanTargetGeneratedAnnotation ->
                        spanTargetGeneratedAnnotation.values.map { it.value }.toSet() == set
                    }
                }
            }
        }
    }

    data class And(val finalizeConditions: Set<FinalizeCondition>) : FinalizeCondition() {
        override fun execute(annotation: Annotation<*>): Boolean {
            return finalizeConditions.all { it.execute(annotation) }
        }
    }

    data class Or(val finalizeConditions: Set<FinalizeCondition>) : FinalizeCondition() {
        override fun execute(annotation: Annotation<*>): Boolean {
            return finalizeConditions.any { it.execute(annotation) }
        }
    }

    data class Not(val finalizeCondition: FinalizeCondition) : FinalizeCondition() {
        override fun execute(annotation: Annotation<*>): Boolean {
            return !finalizeCondition.execute(annotation)
        }
    }
}