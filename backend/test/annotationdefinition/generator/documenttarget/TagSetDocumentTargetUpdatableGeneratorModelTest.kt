package annotationdefinition.generator.documenttarget

import annotationdefinition.AnnotationID
import annotationdefinition.TagSetAnnotationDefinition
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import document.Document
import document.annotation.*
import document.annotation.Annotation
import org.junit.jupiter.api.Test
import project.annotationschema.OriginalDocumentKey
import kotlin.test.assertEquals

internal class TagSetDocumentTargetUpdatableGeneratorModelTest {

    @Test
    fun `converting trainingData with minNumberOfTags 1, correctly ignoring other annotation definition IDs and span annotation values `() {
        val tagSetAnnotationDefinition = TagSetAnnotationDefinition(
            "A1", "My tagset annotation", "A1", 0L, 1, 1,
            listOf(
                TagSetAnnotationDefinition.TagSetOption("O1", "Option 1", "O1"),
                TagSetAnnotationDefinition.TagSetOption("O2", "Option 2", "O2"),
                TagSetAnnotationDefinition.TagSetOption("O3", "Option 3", "O3")
            )
        )
        val originalDocumentKey = OriginalDocumentKey("text")

        val annotationResults = mutableMapOf<Document, List<AnnotationMap>>(
            Document("d1", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Hello")
            }, null) to listOf<AnnotationMap>(
                mutableMapOf(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O1"))),
                    "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("Random other annotation value")))
                ),
                mutableMapOf(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2"))),
                    "A3" to DocumentTargetAnnotation(listOf(ValueToProbability("O1")))
                ),
                mutableMapOf(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2"))),
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                ),
                mutableMapOf(
                    "A1" to SpanTargetAnnotation(
                        setOf(
                            SpanTargetSingleAnnotation(
                                setOf(Span(0, 1)),
                                listOf(ValueToProbability("O2"))
                            )
                        )
                    ),
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                ),
                mutableMapOf(
                    "A1" to SpanTargetAnnotation(
                        setOf(
                            SpanTargetSingleAnnotation(
                                setOf(Span(0, 1)),
                                listOf(ValueToProbability("O2"))
                            )
                        )
                    ),
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                )
            )
        )
        val expected = listOf(
            TrainingSampleWithLabels(
                "Hello", listOf("O2")
            )
        )
        val calculated = annotationResults.toTrainingData(tagSetAnnotationDefinition, originalDocumentKey)
        assertEquals(expected, calculated)
    }

    @Test
    fun `convert training data with minNumberOfTags 1 but actual most common option null`() {
        val tagSetAnnotationDefinition = TagSetAnnotationDefinition(
            "A1", "My tagset annotation", "A1", 0L, 1, 1,
            listOf(
                TagSetAnnotationDefinition.TagSetOption("O1", "Option 1", "O1"),
                TagSetAnnotationDefinition.TagSetOption("O2", "Option 2", "O2"),
                TagSetAnnotationDefinition.TagSetOption("O3", "Option 3", "O3")
            )
        )
        val originalDocumentKey = OriginalDocumentKey("text")

        val annotationResults: Map<Document, List<AnnotationMap>> = mapOf<Document, List<AnnotationMap>>(
            Document("d1", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Hello")
            }, null) to listOf(
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O1"))),
                    "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("Random other annotation value")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A3" to DocumentTargetAnnotation(listOf(ValueToProbability("O1")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to SpanTargetAnnotation(
                        setOf(
                            SpanTargetSingleAnnotation(
                                setOf(Span(0, 1)),
                                listOf(ValueToProbability("O2"))
                            )
                        )
                    ),
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to SpanTargetAnnotation(
                        setOf(
                            SpanTargetSingleAnnotation(
                                setOf(Span(0, 1)),
                                listOf(ValueToProbability("O2"))
                            )
                        )
                    ),
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                )
            )
        )
        val expected = listOf(
            TrainingSampleWithLabels(
                "Hello", listOf("O1")
            )
        )
        val calculated = annotationResults.toTrainingData(tagSetAnnotationDefinition, originalDocumentKey)
        assertEquals(expected, calculated)
    }

    @Test
    fun `converting training data with minNumberOfTags 0 and most common answer none`() {
        val tagSetAnnotationDefinition = TagSetAnnotationDefinition(
            "A1", "My tagset annotation", "A1", 0L, 0, 1,
            listOf(
                TagSetAnnotationDefinition.TagSetOption("O1", "Option 1", "O1"),
                TagSetAnnotationDefinition.TagSetOption("O2", "Option 2", "O2"),
                TagSetAnnotationDefinition.TagSetOption("O3", "Option 3", "O3")
            )
        )
        val originalDocumentKey = OriginalDocumentKey("text")

        val annotationResults = mapOf<Document, List<AnnotationMap>>(
            Document("d1", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Hello")
            }, null) to listOf(
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A2" to DocumentTargetAnnotation(listOf(ValueToProbability("Random other annotation value")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A3" to DocumentTargetAnnotation(listOf(ValueToProbability("O1")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to SpanTargetAnnotation(
                        setOf(
                            SpanTargetSingleAnnotation(
                                setOf(Span(0, 1)),
                                listOf(ValueToProbability("O2"))
                            )
                        )
                    ),
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to SpanTargetAnnotation(
                        setOf(
                            SpanTargetSingleAnnotation(
                                setOf(Span(0, 1)),
                                listOf(ValueToProbability("O2"))
                            )
                        )
                    ),
                    "A4" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                )
            )
        )
        val expected = listOf(
            TrainingSampleWithLabels(
                "Hello", listOf("not_selected_NULL")
            )
        )
        val calculated = annotationResults.toTrainingData(tagSetAnnotationDefinition, originalDocumentKey)
        assertEquals(expected, calculated)
    }

    @Test
    fun `converting trainingData with minNumberOfTags 1 and multiple documents`() {
        val tagSetAnnotationDefinition = TagSetAnnotationDefinition(
            "A1", "My tagset annotation", "A1", 0L, 1, 1,
            listOf(
                TagSetAnnotationDefinition.TagSetOption("O1", "Option 1", "O1"),
                TagSetAnnotationDefinition.TagSetOption("O2", "Option 2", "O2"),
                TagSetAnnotationDefinition.TagSetOption("O3", "Option 3", "O3")
            )
        )
        val originalDocumentKey = OriginalDocumentKey("text")

        val annotationResults = mapOf<Document, List<AnnotationMap>>(
            Document("d1", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Hello")
            }, null) to listOf(
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                )
            ),
            Document("d2", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Ola")
            }, null) to listOf(
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O1")))
                )
            ),
            Document("d3", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Moin")
            }, null) to listOf(
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                )
            ),Document("d4", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Hi")
            }, null) to listOf(
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O1")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O1")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                )
            ),Document("d5", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Ciao")
            }, null) to listOf(
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2")))
                )
            )
        )
        val expected = setOf(
            TrainingSampleWithLabels(
                "Hi", listOf("O1")
            ),
            TrainingSampleWithLabels(
                "Hello", listOf("O2")
            ),
            TrainingSampleWithLabels(
                "Ola", listOf("O2")
            ),
            TrainingSampleWithLabels(
                "Ciao", listOf("O2")
            ),
            TrainingSampleWithLabels(
                "Moin", listOf("O3")
            )
        )
        val calculated = annotationResults.toTrainingData(tagSetAnnotationDefinition, originalDocumentKey)
        assertEquals(expected, calculated.toSet())
    }

    @Test
    fun `converting trainingData with minNumberOfTags 1 and maxNumberOfTags 2`() {
        val tagSetAnnotationDefinition = TagSetAnnotationDefinition(
            "A1", "My tagset annotation", "A1", 0L, 1, 2,
            listOf(
                TagSetAnnotationDefinition.TagSetOption("O1", "Option 1", "O1"),
                TagSetAnnotationDefinition.TagSetOption("O2", "Option 2", "O2"),
                TagSetAnnotationDefinition.TagSetOption("O3", "Option 3", "O3")
            )
        )
        val originalDocumentKey = OriginalDocumentKey("text")

        val annotationResults = mapOf<Document, List<AnnotationMap>>(
            Document("d1", 0L, jacksonObjectMapper().createObjectNode().apply {
                put("text", "Hello")
            }, null) to listOf(
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O1"), ValueToProbability("O2")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O2"), ValueToProbability("O1")))
                ),
                mutableMapOf<AnnotationID, Annotation<*>>(
                    "A1" to DocumentTargetAnnotation(listOf(ValueToProbability("O3")))
                )
            )
        )
        val expected = setOf(
            TrainingSampleWithLabels(
                "Hello", listOf("O1", "O2")
            )
        )
        val calculated = annotationResults.toTrainingData(tagSetAnnotationDefinition, originalDocumentKey)
        assertEquals(expected, calculated.toSet())
    }

}