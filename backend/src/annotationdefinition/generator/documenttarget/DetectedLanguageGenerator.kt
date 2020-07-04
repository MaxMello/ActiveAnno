package annotationdefinition.generator.documenttarget

import annotationdefinition.generator.AnnotationGenerator
import annotationdefinition.generator.FinalizeCondition
import annotationdefinition.target.TargetType
import com.github.pemistahl.lingua.api.IsoCode639_1
import com.github.pemistahl.lingua.api.LanguageDetector
import com.github.pemistahl.lingua.api.LanguageDetectorBuilder
import common.putIfAbsentAndGet
import document.Document
import document.annotation.Annotation
import document.annotation.DocumentTargetAnnotation
import document.annotation.GeneratedAnnotationData
import document.annotation.ValueToProbability
import project.annotationschema.AnnotationStepKey


private typealias LanguagesIso639_1 = Set<String>

/**
 * Because creating of [LanguageDetector] is costly (a few seconds), we cache them is a private top level map
 * A [LanguageDetector] is defined by its possible languages, thus the key for the map is the set of possible languages
 */
private val detectorMap = mutableMapOf<LanguagesIso639_1, LanguageDetector>()

/**
 * [AnnotationGenerator] which detects the language using the "Lingua" library, storing the annotation under the
 * defined key as the ISO 639-1 Code (in upper case). The "unknown" key from Lingua is defined as the string "UNKNOWN"
 */
class DetectedLanguageGenerator(
    id: String,
    annotationDefinitionID: String,
    name: String,
    description: String,
    input: AnnotationStepKey,
    var possibleLanguagesIso6391: LanguagesIso639_1,
    createdTimestamp: Long = System.currentTimeMillis()
) : AnnotationGenerator(id, annotationDefinitionID, TargetType.DOCUMENT_TARGET, name, description, input, FinalizeCondition.Always,
    createdTimestamp) {

    override suspend fun generateAnnotation(
        document: Document,
        generatedAnnotationData: GeneratedAnnotationData
    ): Annotation<*> {
        val languagesKey = possibleLanguagesIso6391.map { it.toUpperCase() }.toSet()
        return DocumentTargetAnnotation(
            values = listOf(
                ValueToProbability(
                    detectorMap.putIfAbsentAndGet(
                        languagesKey, if (languagesKey.isEmpty()) {
                            LanguageDetectorBuilder.fromAllLanguages().build()
                        } else {
                            LanguageDetectorBuilder.fromIsoCodes639_1(
                                *(languagesKey
                                    .map { IsoCode639_1.valueOf(it) }.toTypedArray())
                            )
                                .build()
                        }
                    ).detectLanguageOf(
                        input.getValue(document, generatedAnnotationData.annotations)?.toString()
                            ?: throw IllegalArgumentException("Input for $this is missing")
                    ).isoCode639_1.toString().toUpperCase()
                )
            )
        )
    }

    override fun updateModel(newAnnotationGenerator: AnnotationGenerator) {
        super.updateModel(newAnnotationGenerator)
        newAnnotationGenerator as DetectedLanguageGenerator
        this.possibleLanguagesIso6391 = newAnnotationGenerator.possibleLanguagesIso6391
    }
}