package project.annotationschema.generator

import annotationdefinition.TagSetAnnotationDefinition
import annotationdefinition.generator.FinalizeCondition
import annotationdefinition.generator.documenttarget.TagSetDocumentTargetGeneratorModel
import annotationdefinition.target.DocumentTarget
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import common.HttpAuthentication
import document.Document
import document.annotation.AnnotationMap
import document.annotation.DocumentTargetAnnotation
import document.annotation.ValueToProbability
import io.mockk.coEvery
import io.mockk.spyk
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import project.annotationschema.*

internal class GeneratorExtensionsTest {

    private val document = Document(
        "D1", 0L, jacksonObjectMapper().createObjectNode().apply {
            put("comment", "This is the comment")
        }
    )

    private val annotation1 = TagSetAnnotationDefinition(
        "A1", "A 1", "A 1", 0L, 1, 1, listOf(
            TagSetAnnotationDefinition.TagSetOption("O1", "O 1", "O 1"),
            TagSetAnnotationDefinition.TagSetOption("O2", "O 2", "O 2"),
            TagSetAnnotationDefinition.TagSetOption("O3", "O 3", "O 3")
        )
    )
    private val generator1 = spyk(TagSetDocumentTargetGeneratorModel(
        "G1", "A1", "G 1", "G 1", OriginalDocumentKey("comment"),
        "", HttpAuthentication.None, FinalizeCondition.Always, 0L
    ))
    private val annotation2 = TagSetAnnotationDefinition(
        "A2", "A 2", "A 2", 0L, 1, 1, listOf(
            TagSetAnnotationDefinition.TagSetOption("X1", "X 1", "X 1"),
            TagSetAnnotationDefinition.TagSetOption("X2", "X 2", "X 2"),
            TagSetAnnotationDefinition.TagSetOption("X3", "X 3", "X 3")
        )
    )
    private val generator2 = spyk(TagSetDocumentTargetGeneratorModel(
        "G2", "A2", "G 2", "G 2", OriginalDocumentKey("comment"),
        "", HttpAuthentication.None, FinalizeCondition.Always, 0L
    ))
    private val annotation3 = TagSetAnnotationDefinition(
        "A3", "A 3", "A 3", 0L, 1, 1, listOf(
            TagSetAnnotationDefinition.TagSetOption("Y1", "Y 1", "Y 1"),
            TagSetAnnotationDefinition.TagSetOption("Y2", "Y 2", "Y 2"),
            TagSetAnnotationDefinition.TagSetOption("Y3", "Y 3", "Y 3")
        )
    )
    private val generator3 = spyk(TagSetDocumentTargetGeneratorModel(
        "G3", "A3","G 3", "G 3", AnnotationsKey("A1"),
        "", HttpAuthentication.None, FinalizeCondition.Always, 0L
    ))

    @Test
    fun `annotationSchema of 3 elements will true enableConditions results in GeneratedAnnotationData with 3 annotations`(): Unit = runBlocking {
        coEvery { generator1.generateAnnotation(any(), any()) } returns DocumentTargetAnnotation(listOf(ValueToProbability("O1", 0.8)))
        coEvery { generator2.generateAnnotation(any(), any()) } returns DocumentTargetAnnotation(listOf(ValueToProbability("X2", 0.6)))
        coEvery { generator3.generateAnnotation(any(), any()) } returns DocumentTargetAnnotation(listOf(ValueToProbability("Y2")))
        val annotationSchema = DenormalizedAnnotationSchema(
            listOf(
                DenormalizedAnnotationSchemaElement(
                    annotation1,
                    DocumentTarget(),
                    null,
                    generator1
                ),
                DenormalizedAnnotationSchemaElement(
                    annotation2,
                    DocumentTarget(),
                    ValuesEqual(AnnotationsKey("A1"), setOf("O1")),
                    generator2
                ),
                DenormalizedAnnotationSchemaElement(
                    annotation3,
                    DocumentTarget(),
                    ValuesEqual(AnnotationsKey("A2"), setOf("X2")),
                    generator3
                )
            ),
            GeneratedAnnotationResultHandling(HandlingPolicy.GeneratorAsAnnotator)
        )

        val expectedAnnotations: AnnotationMap = mutableMapOf("A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O1", 0.8))),
        "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("X2", 0.6))),
        "A3" to DocumentTargetAnnotation(listOf(ValueToProbability("Y2", 1.0)))) // This still works, because we ignore probability
        // for equals
        val result = annotationSchema.generateAnnotationData(document)
        assertEquals(expectedAnnotations, result.annotations)
        Unit
    }

    @Test
    fun `annotationSchema of 3 elements where first enableConditions fails throws exception`(): Unit = runBlocking {
        coEvery { generator1.generateAnnotation(any(), any()) } returns DocumentTargetAnnotation(listOf(ValueToProbability("O1", 0.8)))
        coEvery { generator2.generateAnnotation(any(), any()) } returns DocumentTargetAnnotation(listOf(ValueToProbability("X2", 0.6)))
        coEvery { generator3.generateAnnotation(any(), any()) } returns DocumentTargetAnnotation(listOf(ValueToProbability("Y2")))
        val annotationSchema = DenormalizedAnnotationSchema(
            listOf(
                DenormalizedAnnotationSchemaElement(
                    annotation1,
                    DocumentTarget(),
                    ValuesEqual(OriginalDocumentKey("id"), setOf("1")), // fails
                    generator1
                ),
                DenormalizedAnnotationSchemaElement(
                    annotation2,
                    DocumentTarget(),
                    ValuesEqual(AnnotationsKey("A1"), setOf("O1")), // fails
                    generator2
                ),
                DenormalizedAnnotationSchemaElement(
                    annotation3,
                    DocumentTarget(),
                    ValuesEqual(AnnotationsKey("A2"), setOf("X2")), // fails
                    generator3
                )
            ),
            GeneratedAnnotationResultHandling(HandlingPolicy.GeneratorAsAnnotator)
        )
        assertThrows(IllegalStateException::class.java) { runBlocking { annotationSchema.generateAnnotationData(document) } }
        Unit
    }
}