package project.layout.elements.action

import annotationdefinition.AnnotationID
import annotationdefinition.NumberRangeAnnotationDefinition
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition

class NumberRangeSlider(
    referenceAnnotationDefinitionID: AnnotationID
) : ActionElement(referenceAnnotationDefinitionID){
    override suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedNumberRangeSlider {
        val element = denormalizedAnnotationSchema.elements
            .firstOrNull { it.annotationDefinition.id == referenceAnnotationDefinitionID }
        require(element != null) {
            "AnnotationDefinition not found for $this"
        }
        require(element.annotationDefinition is NumberRangeAnnotationDefinition) {
            "AnnotationDefinition not allowed for $this"
        }
        return DenormalizedNumberRangeSlider(
            element.annotationDefinition,
            element.enableCondition
        )
    }
}

class DenormalizedNumberRangeSlider(
    annotationDefinition: NumberRangeAnnotationDefinition,
    enableCondition: EnableCondition?
) : DenormalizedActionElement(annotationDefinition, enableCondition)