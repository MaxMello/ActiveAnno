package project.layout.elements.action

import annotationdefinition.AnnotationID
import annotationdefinition.BooleanAnnotationDefinition
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition
import project.layout.ButtonColor
import project.layout.ButtonSize

class BooleanButtonGroup(
    referenceAnnotationDefinitionID: AnnotationID,
    val buttonSize: ButtonSize? = null,
    val buttonColorTrue: ButtonColor? = null,
    val buttonColorFalse: ButtonColor? = null
) : ActionElement(referenceAnnotationDefinitionID) {

    override suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedBooleanButtonGroup {
        val element = denormalizedAnnotationSchema.elements
            .firstOrNull { it.annotationDefinition.id == referenceAnnotationDefinitionID }
        require(element != null) {
            "AnnotationDefinition not found for $this"
        }
        require(element.annotationDefinition is BooleanAnnotationDefinition) {
            "AnnotationDefinition not allowed for $this"
        }
        return DenormalizedBooleanButtonGroup(
            element.annotationDefinition,
            element.enableCondition,
            buttonSize, buttonColorTrue, buttonColorFalse
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is BooleanButtonGroup) return false
        if (!super.equals(other)) return false

        if (buttonSize != other.buttonSize) return false
        if (buttonColorTrue != other.buttonColorTrue) return false
        if (buttonColorFalse != other.buttonColorFalse) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + (buttonSize?.hashCode() ?: 0)
        result = 31 * result + (buttonColorTrue?.hashCode() ?: 0)
        result = 31 * result + (buttonColorFalse?.hashCode() ?: 0)
        return result
    }

}

class DenormalizedBooleanButtonGroup(
    annotationDefinition: BooleanAnnotationDefinition,
    enableCondition: EnableCondition?,
    val buttonSize: ButtonSize?,
    val buttonColorTrue: ButtonColor?,
    val buttonColorFalse: ButtonColor?
) : DenormalizedActionElement(annotationDefinition, enableCondition) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is DenormalizedBooleanButtonGroup) return false
        if (!super.equals(other)) return false

        if (buttonSize != other.buttonSize) return false
        if (buttonColorTrue != other.buttonColorTrue) return false
        if (buttonColorFalse != other.buttonColorFalse) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + (buttonSize?.hashCode() ?: 0)
        result = 31 * result + (buttonColorTrue?.hashCode() ?: 0)
        result = 31 * result + (buttonColorFalse?.hashCode() ?: 0)
        return result
    }
}