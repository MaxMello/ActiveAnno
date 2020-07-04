package project.layout.elements.action

import annotationdefinition.AnnotationID
import annotationdefinition.ClosedNumberAnnotationDefinition
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition

class ClosedNumberSlider(
    referenceAnnotationDefinitionID: AnnotationID
) : ActionElement(referenceAnnotationDefinitionID){
    override suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedClosedNumberSlider {
        val element = denormalizedAnnotationSchema.elements
            .firstOrNull { it.annotationDefinition.id == referenceAnnotationDefinitionID }
        require(element != null) {
            "AnnotationDefinition not found for $this"
        }
        require(element.annotationDefinition is ClosedNumberAnnotationDefinition) {
            "AnnotationDefinition not allowed for $this"
        }
        return DenormalizedClosedNumberSlider(
            element.annotationDefinition,
            element.enableCondition
        )
    }
}

class DenormalizedClosedNumberSlider(
    annotationDefinition: ClosedNumberAnnotationDefinition,
    enableCondition: EnableCondition?
) : DenormalizedActionElement(annotationDefinition, enableCondition)