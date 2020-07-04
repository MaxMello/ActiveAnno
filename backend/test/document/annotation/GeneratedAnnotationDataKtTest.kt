package document.annotation

import annotationdefinition.BooleanAnnotationDefinition
import annotationdefinition.OpenNumberAnnotationDefinition
import annotationdefinition.OpenTextAnnotationDefinition
import annotationdefinition.generator.FinalizeCondition
import annotationdefinition.generator.documenttarget.TagSetDocumentTargetUpdatableGeneratorModel
import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanGranularity
import annotationdefinition.target.SpanTarget
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import common.HttpAuthentication
import document.Document
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.DenormalizedAnnotationSchemaElement
import project.annotationschema.OriginalDocumentKey
import project.annotationschema.generator.GeneratedAnnotationResultHandling
import project.annotationschema.generator.HandlingPolicy
import project.filter.Equals

internal class GeneratedAnnotationDataTest {

    @Test
    fun `build AnnotationResult from GeneratedAnnotationData`() {
        val denormalizedAnnotationSchema = DenormalizedAnnotationSchema(
            listOf(
                DenormalizedAnnotationSchemaElement(
                    OpenTextAnnotationDefinition(
                        "A1", "A1", null, 0L
                    ), DocumentTarget(),
                    null,
                    TagSetDocumentTargetUpdatableGeneratorModel(
                        "GEN1", "A1", "GEN1", "Gen 1", "",
                        "", "", HttpAuthentication.None, 0.0, 100, 100, Equals("a", "b"),
                        mutableListOf(), OriginalDocumentKey(""), FinalizeCondition.Always, System.currentTimeMillis()
                    )
                ),
                DenormalizedAnnotationSchemaElement(
                    BooleanAnnotationDefinition(
                        "A2", "A2", null, 0L
                    ), DocumentTarget(),
                    null,
                    TagSetDocumentTargetUpdatableGeneratorModel(
                        "GEN2", "A2", "GEN2", "Gen 2", "", "", "",
                        HttpAuthentication.None, 0.0, 100, 100, Equals("a", "b"),
                        mutableListOf(), OriginalDocumentKey(""), FinalizeCondition.Always, System.currentTimeMillis()
                    )
                ),
                DenormalizedAnnotationSchemaElement(
                    OpenNumberAnnotationDefinition(
                        "A3", "A3", null, 0L
                    ), SpanTarget(SpanGranularity.CHARACTER),
                    null,
                    TagSetDocumentTargetUpdatableGeneratorModel(
                        "GEN3", "A3", "GEN3", "Gen 3", "", "", "",
                        HttpAuthentication.None, 0.0, 100, 100, Equals("a", "b"),
                        mutableListOf(), OriginalDocumentKey(""), FinalizeCondition.Always, System.currentTimeMillis()
                    )
                )
            ),
            GeneratedAnnotationResultHandling(
                HandlingPolicy.GeneratorAsAnnotator
            )
        )

        val annotationResult = AnnotationResult(
            "abc",
            "document1",
            "project1",
            1234567890L,
            mutableMapOf(
                "A1" to DocumentTargetAnnotation(
                    listOf(ValueToProbability("Hallo", 0.777))
                ),
                "A2" to DocumentTargetAnnotation(
                    listOf(ValueToProbability(true))
                ),
                "A3" to SpanTargetAnnotation(
                    setOf(
                        SpanTargetSingleAnnotation(
                            setOf(Span(0, "Tolles Team".length, "Tolles Team")),
                            listOf(ValueToProbability(5.0, 0.9))
                        )
                    )
                )
            ),
            AnnotationResultCreator.Generators(listOf(
                "GEN1", "GEN2", "GEN3"
            )),
            null,
            null,
            null,
            "generated1"
        )

        val generatedAnnotationData = GeneratedAnnotationData(
            1234567890L,
            mutableMapOf(
                "A1" to DocumentTargetAnnotation(
                    listOf(ValueToProbability("Hallo", 0.777))
                ),
                "A2" to DocumentTargetAnnotation(
                    listOf(ValueToProbability(true))
                ),
                "A3" to SpanTargetAnnotation(
                    setOf(
                        SpanTargetSingleAnnotation(
                            setOf(Span(0, "Tolles Team".length, "Tolles Team")),
                            listOf(ValueToProbability(5.0, 0.9))
                        )
                    )
                )
            ),
            "generated1"
        )

        val generatedAnnotationResult = generatedAnnotationData.buildAnnotationResult(
            Document(
                "document1", 12345L, jacksonObjectMapper().createObjectNode()
            ),
            "project1",
            denormalizedAnnotationSchema
        )

        assertThat(generatedAnnotationResult).isEqualToIgnoringGivenFields(annotationResult, "id", "timestamp")

    }

}