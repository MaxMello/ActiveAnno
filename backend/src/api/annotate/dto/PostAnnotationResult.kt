package api.annotate.dto

import document.DocumentID
import document.annotation.*
import project.ProjectID
import project.UsedAnnotateProject

/**
 * Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into
 * other data structures for storing.
 */
data class PostAnnotationResult(
    val documentID: DocumentID,
    val projectID: ProjectID,
    val documentData: Map<String, Any>,
    val annotations: AnnotationMap,
    val usedProject: UsedAnnotateProject,
    val interactionLog: InteractionLog,
    val curationRequest: String? = null
)

/**
 * Remove the probabilities from an [AnnotationMap]. Used to prevent preselected annotations from adding probabilities to
 * annotations from humans
 */
fun AnnotationMap.removeProbabilities(): AnnotationMap {
    return this.map { it.key to when(val mapValue = it.value) {
        is DocumentTargetAnnotation -> {
            DocumentTargetAnnotation(mapValue.values.map { value -> ValueToProbability(value.value) })
        }
        is SpanTargetAnnotation -> {
            SpanTargetAnnotation(mapValue.annotations.map { singleValue -> SpanTargetSingleAnnotation(singleValue.spans, singleValue
                .values.map { value ->
                    ValueToProbability(value.value) })
            }.toSet())
        }
    }}.toMap().toMutableMap()
}