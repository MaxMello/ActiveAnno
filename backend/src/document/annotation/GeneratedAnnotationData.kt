package document.annotation

import document.Document
import project.annotationschema.DenormalizedAnnotationSchema
import java.util.*


/**
 * When a Project has any AnnotationGenerator defined through the AnnotationSchema, they will store their results here.
 * Every time annotation generation is triggered, every generator will be executed again and a new instance of this class
 * will be added to the ProjectAnnotationData
 */
data class GeneratedAnnotationData(
    val timestamp: Long,
    /**
     * GeneratedAnnotations can either be targeted on a document or span level. In hybrid scenarios, where both
     * are supported, span will always overwrite document, as it is more specific.
     */
    val annotations: AnnotationMap,
    val id: String = UUID.randomUUID().toString()
)

/**
 * Build an [AnnotationResult] from an [GeneratedAnnotationData], transforming the annotations based on the AnnotationDefinitions
 * transformGeneratedAnnotation method
 */
fun GeneratedAnnotationData.buildAnnotationResult(document: Document, projectID: String, annotationSchema: DenormalizedAnnotationSchema):
        AnnotationResult {
    val annotationMap = annotationSchema.elements.mapNotNull {
        if(annotations[it.annotationDefinition.id] != null) {
            it.annotationDefinition.id to it.annotationDefinition.transformGeneratedAnnotation(annotations[it.annotationDefinition.id]!!)
        } else {
            null
        }
    }.toMap().toMutableMap()

    return AnnotationResult(
        UUID.randomUUID().toString(),
        document.id,
        projectID,
        System.currentTimeMillis(),
        annotationMap,
        AnnotationResultCreator.Generators(annotationSchema.elements.mapNotNull { it.annotationGenerator }.filter {
            it.annotationDefinitionID in annotationMap
        }.map { it.id }),
        null, null, null,
        this.id
    )
}