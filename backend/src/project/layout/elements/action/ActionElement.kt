package project.layout.elements.action

import annotationdefinition.AnnotationDefinition
import annotationdefinition.AnnotationID
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition
import project.layout.LayoutElement

/**
 * Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value
 */
abstract class ActionElement(val referenceAnnotationDefinitionID: AnnotationID) : LayoutElement {
    abstract suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedActionElement

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ActionElement) return false

        if (referenceAnnotationDefinitionID != other.referenceAnnotationDefinitionID) return false

        return true
    }

    override fun hashCode(): Int {
        return referenceAnnotationDefinitionID.hashCode()
    }

    override fun toString(): String {
        return "${this::class.simpleName}(referenceAnnotationDefinitionID='$referenceAnnotationDefinitionID')"
    }

}

abstract class DenormalizedActionElement(val annotationDefinition: AnnotationDefinition,
                                         val enableCondition: EnableCondition?) : LayoutElement {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is DenormalizedActionElement) return false

        if (annotationDefinition != other.annotationDefinition) return false
        if (enableCondition != other.enableCondition) return false

        return true
    }

    override fun hashCode(): Int {
        var result = annotationDefinition.hashCode()
        result = 31 * result + (enableCondition?.hashCode() ?: 0)
        return result
    }

    override fun toString(): String {
        return "${this::class.simpleName}(annotationDefinition=$annotationDefinition, enableCondition=$enableCondition)"
    }


}