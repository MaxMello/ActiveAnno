package api.annotate.dto

import annotationdefinition.OpenTagAnnotationDefinition
import annotationdefinition.target.DocumentTarget
import annotationdefinition.target.SpanTarget
import application.documentDAO
import org.slf4j.LoggerFactory
import project.Project
import project.annotationschema.denormalize
import project.annotationschema.generator.HandlingPolicy
import project.layout.Layout
import project.layout.LayoutAreaType
import project.layout.elements.action.ActionElement
import project.selection.DocumentSelectionWithOptions
import project.selection.SelectionType
import project.selection.SubFilterWithOptions
import project.userroles.UserIdentifier

private val logger = LoggerFactory.getLogger("AnnotateProject")

/**
 * View data class - all properties relevant to annotate / curate a project in the frontend
 */
data class AnnotateProject(
    val id: String,
    val name: String,
    val description: String,
    val priority: Int,
    val layout: Layout,
    val selection: DocumentSelectionWithOptions = DocumentSelectionWithOptions(),
    val allowManualEscalationToCurator: Boolean,
    val generatedAnnotationResultHandlingPolicy: HandlingPolicy
)

/**
 * Convert a [Project] to an [AnnotateProject], doing some operations to enrich the project data to be able to use it
 * for annotation. For example, if an OpenTagAnnotation is present, this method might aggregate the existing values
 * from all documents of the project and add it to the AnnotateProject.
 */
suspend fun Project.toAnnotateProject(
    userIdentifier: UserIdentifier,
    userIsCurator: Boolean = false
): AnnotateProject {
    val denormalizedAnnotationSchema = annotationSchema.denormalize().apply {
        elements.map { element ->
            if (element.annotationDefinition.let { it is OpenTagAnnotationDefinition && it.useExistingValuesAsPredefinedTags }) {
                // Add existing tags from other annotations to list of predefined tags
                (element.annotationDefinition as OpenTagAnnotationDefinition).predefinedTags.apply {
                    addAll(
                        documentDAO.aggregateValuesForProjectAndAnnotation(
                            id,
                            element.annotationDefinition.id
                        )
                    )
                }.toSet().toList().sorted()
                element
            } else {
                element
            }
        }
    }
    val denormalizedLayout = Layout(layout.run {
        this.layoutAreas.map {
            it.key to it.value.apply {
                this.rows.map { row ->
                    row.cols.map { col ->
                        col.children = col.children.map { layoutElement ->
                            when (layoutElement) {
                                is ActionElement -> {
                                    val annotationID = layoutElement.referenceAnnotationDefinitionID
                                    require(denormalizedAnnotationSchema.elements.firstOrNull {
                                        it.annotationDefinition.id == annotationID
                                    }?.let {
                                        when(it.target) {
                                            is DocumentTarget -> this.id in listOf(LayoutAreaType.DocumentTarget, LayoutAreaType.SharedTarget)
                                            is SpanTarget -> this.id in listOf(LayoutAreaType.SpanTarget, LayoutAreaType.SharedTarget)
                                        }
                                    } == true) {
                                        "AnnotationSchemaElement target does not match Layout Target for $layoutElement"
                                    }
                                    layoutElement.denormalize(denormalizedAnnotationSchema)
                                }
                                else -> layoutElement
                            }
                        }
                    }
                }
            }
        }.toMap()
    })
    // Only do aggregation if necessary
    val subFilterOptions = if(selection.subFilter.any { it.selectionType == SelectionType.AGGREGATE_ALL_VALUES }) {
        if (userIsCurator) {
            documentDAO.aggregateOptionsForSubFilterForCuration(this, userIdentifier)
        } else {
            documentDAO.aggregateOptionsForSubFilterForAnnotation(this, userIdentifier)
        }
    } else {
        mapOf()
    }
    return AnnotateProject(id, name, description, priority, denormalizedLayout, DocumentSelectionWithOptions(
        selection.subFilter.map {
            SubFilterWithOptions(
                "originalDocument.${it.key}",
                it.displayName,
                it.selectionType,
                subFilterOptions[it.key]?.sortedBy { it.value } ?: listOf())
        }, selection.dateRangeFilter), policy.allowManualEscalationToCurator, annotationSchema.generatedAnnotationResultHandling.handlingPolicy)
}