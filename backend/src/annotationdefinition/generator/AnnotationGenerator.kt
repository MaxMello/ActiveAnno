package annotationdefinition.generator

import annotationdefinition.generator.documenttarget.DetectedLanguageGenerator
import annotationdefinition.generator.documenttarget.TagSetDocumentTargetGeneratorModel
import annotationdefinition.generator.documenttarget.TagSetDocumentTargetUpdatableGeneratorModel
import annotationdefinition.target.TargetType
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import document.Document
import document.annotation.Annotation
import document.annotation.GeneratedAnnotationData
import org.bson.codecs.pojo.annotations.BsonId
import project.annotationschema.AnnotationStepKey


/**
 * Base class for [AnnotationGenerator]s. An annotation generator is responsible for automatically generating an annotation value, optionally with
 * a probability attached, for a specific annotation definition. This can be used for statistical methods, simple if-else annotation
 * (for example: if value in list of values, annotate with X), or for machine learning integration.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = TagSetDocumentTargetGeneratorModel::class, name = "TagSetDocumentTargetPredictionModel"),
        JsonSubTypes.Type(value = TagSetDocumentTargetUpdatableGeneratorModel::class, name = "TagSetDocumentTargetUpdatableGeneratorModel"),
        JsonSubTypes.Type(value = DetectedLanguageGenerator::class, name = "DetectedLanguageGenerator")
    ]
)
abstract class AnnotationGenerator(
    @BsonId val id: String,
    val annotationDefinitionID: String,
    val targetType: TargetType,
    var name: String,
    var description: String,
    /**
     * We need to define the [input] to an [AnnotationGenerator] directly here, because a single [AnnotationGenerator] can be shared by multiple
     * projects. For prediction, a generator is always in context of a specific project, but for updating it, it is not.
     */
    var input: AnnotationStepKey,
    var finalizeCondition: FinalizeCondition = FinalizeCondition.Always,
    val createdTimestamp: Long = System.currentTimeMillis()
) {
    abstract suspend fun generateAnnotation(
        document: Document,
        generatedAnnotationData: GeneratedAnnotationData
    ): Annotation<*>

    /**
     * Open function to generate annotations in bulk, might be more efficient. By default, just iterates through
     * [documentsWithGeneratedAnnotationData] and calls [generateAnnotation] for each. Can be overwritten to implement true bulk behavior.
     */
    open suspend fun generateAnnotationBulk(
        documentsWithGeneratedAnnotationData: List<Pair<Document, GeneratedAnnotationData>>
    ): Map<Document, Annotation<*>> {
        return documentsWithGeneratedAnnotationData.map {
            it.first to generateAnnotation(it.first, it.second)
        }.toMap()
    }

    /**
     * Call this to update the mutable fields of an [AnnotationGenerator]
     */
    open fun updateModel(newAnnotationGenerator: AnnotationGenerator) {
        this.name = newAnnotationGenerator.name
        this.description = newAnnotationGenerator.description
        this.input = newAnnotationGenerator.input
        this.finalizeCondition = newAnnotationGenerator.finalizeCondition
    }
}

