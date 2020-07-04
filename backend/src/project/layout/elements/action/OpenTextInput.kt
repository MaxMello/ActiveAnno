package project.layout.elements.action

import annotationdefinition.AnnotationID
import annotationdefinition.OpenTextAnnotationDefinition
import project.annotationschema.DenormalizedAnnotationSchema
import project.annotationschema.EnableCondition

/**
 * A multi line text input field
 */
class OpenTextInput(
    referenceAnnotationDefinitionID: AnnotationID,
    /**
     * Ability to apply auto correct in the frontend
     */
    val showApplyAutoCorrectButton: Boolean = false,
    /**
     * Reference document data by key
     */
    val highlightDifferencesToDocumentData: String? = null
) : ActionElement(referenceAnnotationDefinitionID){

    override suspend fun denormalize(denormalizedAnnotationSchema: DenormalizedAnnotationSchema): DenormalizedOpenTextInput {
        val element = denormalizedAnnotationSchema.elements
            .firstOrNull { it.annotationDefinition.id == referenceAnnotationDefinitionID }
        require(element != null) {
            "AnnotationDefinition not found for $this"
        }
        require(element.annotationDefinition is OpenTextAnnotationDefinition) {
            "AnnotationDefinition not allowed for $this"
        }
        return DenormalizedOpenTextInput(
            element.annotationDefinition,
            element.enableCondition,
            showApplyAutoCorrectButton, highlightDifferencesToDocumentData
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is OpenTextInput) return false
        if (!super.equals(other)) return false

        if (showApplyAutoCorrectButton != other.showApplyAutoCorrectButton) return false
        if (highlightDifferencesToDocumentData != other.highlightDifferencesToDocumentData) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + showApplyAutoCorrectButton.hashCode()
        result = 31 * result + (highlightDifferencesToDocumentData?.hashCode() ?: 0)
        return result
    }


}

class DenormalizedOpenTextInput(annotationDefinition: OpenTextAnnotationDefinition,
                                enableCondition: EnableCondition?,
                                val showApplyAutoCorrectButton: Boolean,
                                val highlightDifferencesToDocumentData: String?) : DenormalizedActionElement(annotationDefinition,
        enableCondition) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is DenormalizedOpenTextInput) return false
        if (!super.equals(other)) return false

        if (showApplyAutoCorrectButton != other.showApplyAutoCorrectButton) return false
        if (highlightDifferencesToDocumentData != other.highlightDifferencesToDocumentData) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + showApplyAutoCorrectButton.hashCode()
        result = 31 * result + (highlightDifferencesToDocumentData?.hashCode() ?: 0)
        return result
    }
}