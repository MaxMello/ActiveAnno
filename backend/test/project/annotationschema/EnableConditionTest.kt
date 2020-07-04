package project.annotationschema

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import document.Document
import document.annotation.*
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class EnableConditionTest {

    private val document = Document(
        "D1", 0L, jacksonObjectMapper().createObjectNode().apply {
            put("comment", "hi")
            put("id", 10)
            put("flag", true)
            put("metaData", "A")
        }
    )

    private val annotationMap: AnnotationMap = mutableMapOf(
        "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("x"))),
        "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("a"), ValueToProbability("b"), ValueToProbability("c"))),
        "A3" to DocumentTargetAnnotation(listOf(ValueToProbability("z"))),
        "A4" to SpanTargetAnnotation(setOf(SpanTargetSingleAnnotation(setOf(Span(1, 10)), listOf(ValueToProbability(1))))),
        "A5" to SpanTargetAnnotation(setOf(SpanTargetSingleAnnotation(setOf(Span(2, 10)), listOf(ValueToProbability(true))))),
        "A6" to SpanTargetAnnotation(setOf(SpanTargetSingleAnnotation(setOf(Span(3, 10)), listOf(ValueToProbability("Hello")))))
    )

    @Test
    fun `valuesEqual from OriginalDocument success`() {
        val enableCondition = ValuesEqual(OriginalDocumentKey("id"), setOf("10"))
        assertTrue(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `valuesEqual from OriginalDocument failure`() {
        val enableCondition = ValuesEqual(OriginalDocumentKey("id"), setOf("11"))
        assertFalse(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `values intersect from OriginalDocument success`() {
        val enableCondition = ValuesIntersect(OriginalDocumentKey("id"), setOf("10"))
        assertTrue(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `values intersect from OriginalDocument failure`() {
        val enableCondition = ValuesIntersect(OriginalDocumentKey("id"), setOf("11"))
        assertFalse(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `valuesEqual from annotations success`() {
        val enableCondition = ValuesEqual(AnnotationsKey("A2"), setOf("b", "a", "c"))
        assertTrue(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `valuesEqual from annotations failure`() {
        val enableCondition = ValuesEqual(AnnotationsKey("A2"), setOf("b", "a"))
        assertFalse(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `values intersect from annotations success`() {
        val enableCondition = ValuesIntersect(AnnotationsKey("A2"), setOf("a"))
        assertTrue(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `values intersect from annotations failure`() {
        val enableCondition = ValuesIntersect(AnnotationsKey("A2"), setOf("x", "y", "z"))
        assertFalse(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `And success`() {
        val enableCondition = And(setOf(ValuesIntersect(AnnotationsKey("A2"), setOf("a")),
            ValuesIntersect(OriginalDocumentKey("flag"), setOf("true"))))
        assertTrue(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `And failure for empty children`() {
        val enableCondition = And(setOf())
        assertFalse(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `And failure for false ValuesEquals`() {
        val enableCondition = And(setOf(ValuesEqual(OriginalDocumentKey("id"), setOf("11")),
            ValuesEqual(OriginalDocumentKey("id"), setOf("12"))))
        assertFalse(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `Not And failure for false ValuesEquals is true`() {
        val enableCondition = Not(And(setOf(ValuesEqual(OriginalDocumentKey("id"), setOf("11")),
            ValuesEqual(OriginalDocumentKey("id"), setOf("12")))))
        assertTrue(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `Or success`() {
        val enableCondition = Or(setOf(ValuesIntersect(AnnotationsKey("A2"), setOf("a")),
            ValuesIntersect(OriginalDocumentKey("flag"), setOf("false"))))
        assertTrue(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `Or failure for empty children`() {
        val enableCondition = And(setOf())
        assertFalse(enableCondition.execute(document, annotationMap))
    }

    @Test
    fun `Or failure for false ValuesEquals`() {
        val enableCondition = And(setOf(ValuesEqual(OriginalDocumentKey("id"), setOf("11")),
            ValuesEqual(OriginalDocumentKey("id"), setOf("12"))))
        assertFalse(enableCondition.execute(document, annotationMap))
    }
}
