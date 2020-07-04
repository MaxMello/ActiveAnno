package project.layout.elements.action

import annotationdefinition.AnnotationID
import annotationdefinition.TagSetAnnotationDefinition
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition

class TagSetDropdown(
    referenceAnnotationDefinitionID: AnnotationID
) : ActionElement(referenceAnnotationDefinitionID) {

    override suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedTagSetDropdown {
        val element = denormalizedAnnotationSchema.elements
            .firstOrNull { it.annotationDefinition.id == referenceAnnotationDefinitionID }
        require(element != null) {
            "AnnotationDefinition not found for $this"
        }
        require(element.annotationDefinition is TagSetAnnotationDefinition) {
            "AnnotationDefinition not allowed for $this"
        }
        return DenormalizedTagSetDropdown(
            element.annotationDefinition,
            element.enableCondition
        )
    }
}

class DenormalizedTagSetDropdown(
    annotationDefinition: TagSetAnnotationDefinition,
    enableCondition: EnableCondition?
) : DenormalizedActionElement(annotationDefinition, enableCondition)