package project.layout.elements.action

import annotationdefinition.AnnotationID
import annotationdefinition.OpenTagAnnotationDefinition
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition

/**
 * Chips element is a variable list of text inputs (tags) which can be extended, including an auto-complete feature with predefined answers.
 */
class OpenTagChipInput(
    referenceAnnotationDefinitionID: AnnotationID
) : ActionElement(referenceAnnotationDefinitionID){

    override suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedOpenTagChipInput {
        val element = denormalizedAnnotationSchema.elements
            .firstOrNull { it.annotationDefinition.id == referenceAnnotationDefinitionID }
        require(element != null) {
            "AnnotationDefinition not found for $this"
        }
        require(element.annotationDefinition is OpenTagAnnotationDefinition) {
            "AnnotationDefinition not allowed for $this"
        }
        return DenormalizedOpenTagChipInput(
            element.annotationDefinition,
            element.enableCondition
        )
    }
}

class DenormalizedOpenTagChipInput(
    annotationDefinition: OpenTagAnnotationDefinition,
    enableCondition: EnableCondition?
) : DenormalizedActionElement(annotationDefinition, enableCondition)