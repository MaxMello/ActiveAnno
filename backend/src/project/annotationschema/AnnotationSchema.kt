package project.annotationschema

import annotationdefinition.AnnotationDefinition
import annotationdefinition.AnnotationID
import annotationdefinition.generator.AnnotationGenerator
import annotationdefinition.target.Target
import application.annotationDefinitionDAO
import application.annotationGeneratorDAO
import project.annotationschema.generator.GeneratedAnnotationResultHandling

/**
 * Annotation schema as defined in the database (with ID references to [AnnotationDefinition]s
 * and [AnnotationGenerator]s.
 */
data class AnnotationSchema(
    val elements: List<AnnotationSchemaElement>,
    val generatedAnnotationResultHandling: GeneratedAnnotationResultHandling = GeneratedAnnotationResultHandling()
) {
    init {
        require(
            elements.map { it.annotationDefinitionID }.toSet().size == elements.size
        ) {
            "AnnotationSchema cannot have multiple elements with the same AnnotationDefinition"
        }
    }
}

/**
 * Single element of the schema, mapping the ID of an [AnnotationDefinition] to data specific to this project
 * and the [Target] of the annotation.
 * different target definition for the same annotation
 */
data class AnnotationSchemaElement(
    val annotationDefinitionID: AnnotationID,
    val target: Target,
    /**
     * Under which condition will this annotation step be executed / enabled for the project
     * Null means unconditionally
     */
    val enableCondition: EnableCondition? = null,
    val annotationGeneratorID: String? = null
)

/**
 * Annotation schema as sent to the frontend / client, contains the actual models of [AnnotationDefinition],
 * [AnnotationGenerator] etc.
 */
data class DenormalizedAnnotationSchema(
    val elements: List<DenormalizedAnnotationSchemaElement>,
    val generatedAnnotationResultHandling: GeneratedAnnotationResultHandling
)

/**
 * Equivalent to [AnnotationSchemaElement] but denormalized, meaning all ID references are replaced
 * by the actual objects
 */
data class DenormalizedAnnotationSchemaElement(
    val annotationDefinition: AnnotationDefinition,
    val target: Target,
    /**
     * Under which condition will this annotation step be executed / enabled for the project
     * Null means unconditionally
     */
    val enableCondition: EnableCondition? = null,
    val annotationGenerator: AnnotationGenerator? = null
)

suspend fun AnnotationSchema.denormalize(): DenormalizedAnnotationSchema {
    return DenormalizedAnnotationSchema(
        elements.map {
            it.denormalize()
        },
        generatedAnnotationResultHandling
    )
}

suspend fun AnnotationSchemaElement.denormalize(): DenormalizedAnnotationSchemaElement {
    return DenormalizedAnnotationSchemaElement(
        annotationDefinitionDAO.byIdOrNull(this.annotationDefinitionID)
            ?: throw IllegalStateException("AnnotationDefinition for id ${this.annotationDefinitionID} not found in database"),
        this.target, this.enableCondition, this.annotationGeneratorID?.let {
            annotationGeneratorDAO.byIdOrNull(it) ?: throw IllegalStateException("Generator for " + "id $it does not exist")
        })
}