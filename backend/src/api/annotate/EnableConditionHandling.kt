package api.annotate

import annotationdefinition.AnnotationID
import annotationdefinition.target.TargetType
import application.documentDAO
import application.projectDAO
import document.DocumentID
import document.annotation.AnnotationMap
import project.ProjectID
import project.UsedAnnotateProject
import project.annotationschema.denormalize
import project.layout.Layout
import project.layout.LayoutAreaType
import project.layout.elements.action.ActionElement
import project.layout.elements.action.DenormalizedActionElement


/**
 * Data class to receive a check enable condition request
 */
data class CheckEnableConditionRequestBody(
    val documentID: DocumentID,
    val usedProject: UsedAnnotateProject,
    val annotations: AnnotationMap
)

/**
 * Data class for the response body of the check enable condition request
 */
data class CheckEnableConditionResponse(
    val documentID: DocumentID,
    val projectID: ProjectID,
    val annotationConditions: List<AnnotationEnableConditionResult>
)

/**
 * A single EnableCondition applied result, indicating if an annotation is [required] or not.
 */
data class AnnotationEnableConditionResult(
    val annotationID: AnnotationID,
    val targetType: TargetType,
    val required: Boolean
)

/**
 * Top level function to apply the enableConditions for a given [AnnotationMap]
 */
suspend fun buildAnnotationConditions(documentID: DocumentID, projectID: ProjectID, layout: Layout, annotations: AnnotationMap):
        List<AnnotationEnableConditionResult> {
    val annotationConditions = mutableListOf<AnnotationEnableConditionResult>()
    val document = documentDAO.byId(documentID)
    val project = projectDAO.getProjectById(projectID)
    val denormalizedAnnotationSchema = project.annotationSchema.denormalize()
    layout.layoutAreas[LayoutAreaType.DocumentTarget]?.rows?.forEach { row ->
        row.cols.forEach { col ->
            col.children.forEach { child ->
                val denormalizedChild = if(child is DenormalizedActionElement) {
                    child
                } else if(child is ActionElement) {
                    child.denormalize(denormalizedAnnotationSchema)
                } else {
                    null
                }
                if(denormalizedChild != null) {
                    val requiredByEnableCondition = (denormalizedChild.enableCondition == null ||
                            denormalizedChild.enableCondition.execute(document, annotations))
                    annotationConditions.add(
                        AnnotationEnableConditionResult(
                            denormalizedChild.annotationDefinition.id,
                            TargetType.DOCUMENT_TARGET,
                            requiredByEnableCondition
                        )
                    )
                }
            }
        }
    }
    return annotationConditions
}