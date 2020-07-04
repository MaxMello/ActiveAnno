package project.layout.elements.action

import annotationdefinition.AnnotationID
import annotationdefinition.OpenNumberAnnotationDefinition
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition

/**
 * HTML Number input
 */
class OpenNumberInput(
    referenceAnnotationDefinitionID: AnnotationID
) : ActionElement(referenceAnnotationDefinitionID){

    override suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedOpenNumberInput {
        val element = denormalizedAnnotationSchema.elements
            .firstOrNull { it.annotationDefinition.id == referenceAnnotationDefinitionID }
        require(element != null) {
            "AnnotationDefinition not found for $this"
        }
        require(element.annotationDefinition is OpenNumberAnnotationDefinition) {
            "AnnotationDefinition not allowed for $this"
        }
        return DenormalizedOpenNumberInput(
            element.annotationDefinition,
            element.enableCondition
        )
    }

}

class DenormalizedOpenNumberInput(
    annotationDefinition: OpenNumberAnnotationDefinition,
    enableCondition: EnableCondition?
) : DenormalizedActionElement(annotationDefinition, enableCondition)