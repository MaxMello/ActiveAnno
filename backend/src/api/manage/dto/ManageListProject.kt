package api.manage.dto

import project.Project
import project.ProjectID

/**
 * View data class - all properties necessary to display project in list in the frontend for managers
 */
data class ManageListProject(
    val id: ProjectID,
    val name: String,
    val description: String = ""
)

/**
 * Convert a [Project] to a [ManageListProject]
 */
fun Project.toManageListProject(): ManageListProject {
    return ManageListProject(id, name, description)
}

