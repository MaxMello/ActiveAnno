package api.annotate.dto

import annotationdefinition.AnnotationID
import annotationdefinition.target.TargetType
import document.Document
import document.DocumentID
import project.Project
import project.ProjectID
import project.annotationschema.denormalize
import java.util.*


/**
 * Return model for storing endpoints, letting the frontend know the data was stored successfully. If not, will return
 * [validationErrors]
 */
data class AnnotationResultStoreResponse(
    val projectID: ProjectID,
    val documentID: DocumentID,
    val success: Boolean,
    val validationErrors: List<ValidationError>
)

/**
 * Single [ValidationError] w.r.t. an annotation definition + target
 */
data class ValidationError(
    val annotationDefinitionID: AnnotationID,
    val targetType: TargetType,
    val message: String)

/**
 * Validate a [PostAnnotationResult] by applying the enableConditions and validate the annotation if required
 */
suspend fun PostAnnotationResult.validate(document: Document, project: Project, locale: Locale?): List<ValidationError> {
    return project.annotationSchema.denormalize().elements.mapNotNull { element ->
        val requiredByEnableCondition = (element.enableCondition == null || element.enableCondition.execute(document, this.annotations))
        if(requiredByEnableCondition) {
            element.annotationDefinition.validateAnnotation(this.annotations, element.target, locale)
        } else {
            null
        }
    }
}
