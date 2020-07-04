package api.annotate.dto

import project.Project
import project.ProjectID

/**
 * View data class - all properties necessary to display project in list in the frontend
 */
data class ListProject(
    val id: ProjectID,
    val name: String,
    val description: String = "",
    val priority: Int
)

/**
 * Convert a [Project] to a [ListProject]
 */
fun Project.toListProject(): ListProject {
    return ListProject(id, name, description, priority)
}

