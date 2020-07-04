package annotationdefinition.generator

import document.annotation.*
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class FinalizeConditionTest {

    private val annotationMap: AnnotationMap = mutableMapOf(
        "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("x", 0.8))),
        "A2" to DocumentTargetAnnotation(listOf(
            ValueToProbability("a", 0.7),
            ValueToProbability("b", 0.8),
            ValueToProbability("c", 0.9))),
        "A3" to DocumentTargetAnnotation(listOf(ValueToProbability("z"))),
        "A4" to SpanTargetAnnotation(setOf(
            SpanTargetSingleAnnotation(setOf(Span(1, 10)), listOf(ValueToProbability(1, 0.7),
                ValueToProbability(5, 1.0))),
            SpanTargetSingleAnnotation(setOf(Span(2, 10)), listOf(ValueToProbability(2, 0.6))),
            SpanTargetSingleAnnotation(setOf(Span(3, 10)), listOf(ValueToProbability(3, 0.9)))
        )
        ),
        "A5" to SpanTargetAnnotation(setOf(SpanTargetSingleAnnotation(setOf(Span(2, 10)), listOf(ValueToProbability(true))))),
        "A6" to SpanTargetAnnotation(setOf(SpanTargetSingleAnnotation(setOf(Span(3, 10)), listOf(ValueToProbability("Hello")))))
    )

    @Test
    fun `FinalizeCondition Always returns true`() {
        assertTrue(FinalizeCondition.Always.execute(annotationMap["A1"]!!))
    }

    @Test
    fun `FinalizeCondition ProbabilityGreaterThanEquals DocumentTarget success`() {
        assertTrue(FinalizeCondition.ProbabilityGreaterThanEquals(0.6).execute(annotationMap["A1"]!!))
    }

    @Test
    fun `FinalizeCondition ProbabilityGreaterThanEquals DocumentTarget failure`() {
        assertFalse(FinalizeCondition.ProbabilityGreaterThanEquals(0.91).execute(annotationMap["A2"]!!))
    }

    @Test
    fun `FinalizeCondition ProbabilityGreaterThanEquals SpanTarget success`() {
        assertTrue(FinalizeCondition.ProbabilityGreaterThanEquals(0.6).execute(annotationMap["A4"]!!))
    }

    @Test
    fun `FinalizeCondition ProbabilityGreaterThanEquals SpanTarget failure`() {
        assertFalse(FinalizeCondition.ProbabilityGreaterThanEquals(0.75).execute(annotationMap["A4"]!!))
    }

    @Test
    fun `FinalizeCondition ValueIn DocumentTarget success`() {
        assertTrue(FinalizeCondition.ValueIn("b").execute(annotationMap["A2"]!!))
    }

    @Test
    fun `FinalizeCondition ValueIn DocumentTarget failure`() {
        assertFalse(FinalizeCondition.ValueIn("failure").execute(annotationMap["A2"]!!))
    }

    @Test
    fun `FinalizeCondition ValueIn SpanTarget success`() {
        assertTrue(FinalizeCondition.ValueIn(true).execute(annotationMap["A5"]!!))
    }

    @Test
    fun `FinalizeCondition ValueIn SpanTarget failure`() {
        assertFalse(FinalizeCondition.ValueIn(false).execute(annotationMap["A5"]!!))
    }

    @Test
    fun `FinalizeCondition SetEquals DocumentTarget success`() {
        assertTrue(FinalizeCondition.SetEquals(setOf("a", "c", "b")).execute(annotationMap["A2"]!!))
    }

    @Test
    fun `FinalizeCondition SetEquals DocumentTarget failure`() {
        assertFalse(FinalizeCondition.SetEquals(setOf("a", "b")).execute(annotationMap["A2"]!!))
    }

    @Test
    fun `FinalizeCondition SetEquals SpanTarget success`() {
        assertTrue(FinalizeCondition.SetEquals(setOf(1, 5)).execute(annotationMap["A4"]!!))
    }

    @Test
    fun `FinalizeCondition SetEquals SpanTarget failure`() {
        assertFalse(FinalizeCondition.SetEquals(setOf("Ola")).execute(annotationMap["A6"]!!))
    }

    @Test
    fun `Not of successful And is failure`() {
        assertFalse(FinalizeCondition.Not(
            FinalizeCondition.And(setOf(
                FinalizeCondition.ValueIn("b"),
                FinalizeCondition.ProbabilityGreaterThanEquals(0.7)
            ))
        ).execute(annotationMap["A2"]!!))
    }

    @Test
    fun `Not of successful Or is failure`() {
        assertFalse(FinalizeCondition.Not(
            FinalizeCondition.Or(setOf(
                FinalizeCondition.ValueIn("b"),
                FinalizeCondition.ProbabilityGreaterThanEquals(0.9)
            ))
        ).execute(annotationMap["A2"]!!))
    }
}