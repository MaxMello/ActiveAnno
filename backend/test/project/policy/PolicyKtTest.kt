package project.policy

import document.annotation.*
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class PolicyKtTest {

    // This list of AnnotationResult has 2 equal annotations, building the majority
    private val annotationResults1 = listOf(
        AnnotationResult(
            "", "", "", 0L, mutableMapOf(
                "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("a"))),
                "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("b"))),
                "A3" to SpanTargetAnnotation(
                    setOf(
                        SpanTargetSingleAnnotation(setOf(Span(0, 10)), listOf(ValueToProbability("x"))),
                        SpanTargetSingleAnnotation(setOf(Span(11, 20), Span(12, 30)), listOf(ValueToProbability("y")))
                    )
                )
            ), AnnotationResultCreator.Annotator("test")
        ),
        AnnotationResult(
            "", "", "", 0L, mutableMapOf(
                "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("a"))),
                "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("b"))),
                "A3" to SpanTargetAnnotation(
                    setOf(
                        SpanTargetSingleAnnotation(setOf(Span(12, 30), Span(11, 20)), listOf(ValueToProbability("y"))),
                        SpanTargetSingleAnnotation(setOf(Span(0, 10)), listOf(ValueToProbability("x")))
                    )
                )
            ), AnnotationResultCreator.Annotator("test")
        ),AnnotationResult(
            "", "", "", 0L, mutableMapOf(
                "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("x"))),
                "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("y"))),
                "A3" to SpanTargetAnnotation(
                    setOf(
                        SpanTargetSingleAnnotation(setOf(Span(11, 20), Span(12, 30)), listOf(ValueToProbability("z"))),
                        SpanTargetSingleAnnotation(setOf(Span(0, 10)), listOf(ValueToProbability("U")))
                    )
                )
            ), AnnotationResultCreator.Annotator("test")
        )
    )

    @Test
    fun `Building majority per document successfully for 1 to 3 number of annotators`() = runBlocking {
        val expectedResult: AnnotationMap = mutableMapOf(
            "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("a"))),
            "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("b"))),
            "A3" to SpanTargetAnnotation(
                setOf(
                    SpanTargetSingleAnnotation(setOf(Span(0, 10)), listOf(ValueToProbability("x"))),
                    SpanTargetSingleAnnotation(setOf(Span(11, 20), Span(12, 30)), listOf(ValueToProbability("y")))
                )
            ))
        assertEquals(expectedResult, buildMajorityPerDocument(annotationResults1, 1))
        assertEquals(expectedResult, buildMajorityPerDocument(annotationResults1, 2))
        assertEquals(expectedResult, buildMajorityPerDocument(annotationResults1, 3))
    }

    @Test
    fun `Building majority per document fails because number of annotators in agreement is too small`() = runBlocking {
        assertEquals(null, buildMajorityPerDocument(annotationResults1, 4))
    }

    private val annotationResults2 = listOf(
        AnnotationResult(
            "", "", "", 0L, mutableMapOf(
                "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("a"))),
                "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("b"))),
                "A3" to SpanTargetAnnotation(
                    setOf(
                        SpanTargetSingleAnnotation(setOf(Span(0, 10)), listOf(ValueToProbability("x"))),
                        SpanTargetSingleAnnotation(setOf(Span(11, 20), Span(12, 30)), listOf(ValueToProbability("y")))
                    )
                )
            ), AnnotationResultCreator.Annotator("test")
        ),
        AnnotationResult(
            "", "", "", 0L, mutableMapOf(
                "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("x"))),
                "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("b"))),
                "A3" to SpanTargetAnnotation(
                    setOf(
                        SpanTargetSingleAnnotation(setOf(Span(12, 30), Span(11, 20)), listOf(ValueToProbability("y"))),
                        SpanTargetSingleAnnotation(setOf(Span(0, 10)), listOf(ValueToProbability("x")))
                    )
                )
            ), AnnotationResultCreator.Annotator("test")
        ),AnnotationResult(
            "", "", "", 0L, mutableMapOf(
                "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("a"))),
                "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("y"))),
                "A3" to SpanTargetAnnotation(
                    setOf(
                        SpanTargetSingleAnnotation(setOf(Span(11, 20), Span(12, 30)), listOf(ValueToProbability("y"))),
                        SpanTargetSingleAnnotation(setOf(Span(0, 10)), listOf(ValueToProbability("U")))
                    )
                )
            ), AnnotationResultCreator.Annotator("test")
        )
    )

    @Test
    fun `Building majority per annotation successfully`() = runBlocking {
        val expectedResult = mutableMapOf(
            "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("a"))),
            "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("b"))),
            "A3" to SpanTargetAnnotation(
                setOf(
                    SpanTargetSingleAnnotation(setOf(Span(12, 30), Span(11, 20)), listOf(ValueToProbability("y"))),
                    SpanTargetSingleAnnotation(setOf(Span(0, 10)), listOf(ValueToProbability("x")))
                )
            )
        )
        assertEquals(expectedResult, buildMajorityPerAnnotation(annotationResults2, 1))
        assertEquals(expectedResult, buildMajorityPerAnnotation(annotationResults2, 2))
        assertEquals(expectedResult, buildMajorityPerAnnotation(annotationResults2, 3))
    }

    @Test
    fun `Building majority per annotation failure because number of annotators in agreement too small`() = runBlocking {
        assertEquals(null, buildMajorityPerAnnotation(annotationResults2, 4))
    }

}
