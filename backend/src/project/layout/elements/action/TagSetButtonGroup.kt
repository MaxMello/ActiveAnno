package project.layout.elements.action

import annotationdefinition.AnnotationID
import annotationdefinition.TagSetAnnotationDefinition
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition
import project.layout.ButtonColor
import project.layout.ButtonSize

/**
 * A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select.
 */
class TagSetButtonGroup(
    referenceAnnotationDefinitionID: AnnotationID,
    /**
     * Optionally specify buttonSize, will use default value if missing
     */
    val buttonSize: ButtonSize? = null,
    /**
     * Map of option ID to coloring, will use default color if missing. For BooleanButtonGroup, the keys are "true" and "false"
     */
    val buttonColors: Map<String, ButtonColor> = mapOf()
) : ActionElement(referenceAnnotationDefinitionID) {

    override suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedTagSetButtonGroup {
        val element = denormalizedAnnotationSchema.elements
            .firstOrNull { it.annotationDefinition.id == referenceAnnotationDefinitionID }
        require(element != null) {
            "AnnotationDefinition not found for $this"
        }
        require(element.annotationDefinition is TagSetAnnotationDefinition) {
            "AnnotationDefinition not allowed for $this: ${element.annotationDefinition}"
        }
        return DenormalizedTagSetButtonGroup(
            element.annotationDefinition,
            element.enableCondition,
            buttonSize, buttonColors
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is TagSetButtonGroup) return false
        if (!super.equals(other)) return false

        if (buttonSize != other.buttonSize) return false
        if (buttonColors != other.buttonColors) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + (buttonSize?.hashCode() ?: 0)
        result = 31 * result + buttonColors.hashCode()
        return result
    }


}

class DenormalizedTagSetButtonGroup(
    annotationDefinition: TagSetAnnotationDefinition,
    enableCondition: EnableCondition?,
    val buttonSize: ButtonSize?,
    val buttonColors: Map<String, ButtonColor>
) : DenormalizedActionElement(annotationDefinition, enableCondition) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is DenormalizedTagSetButtonGroup) return false
        if (!super.equals(other)) return false

        if (buttonSize != other.buttonSize) return false
        if (buttonColors != other.buttonColors) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + (buttonSize?.hashCode() ?: 0)
        result = 31 * result + buttonColors.hashCode()
        return result
    }
}