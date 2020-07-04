package api.manage.dto

import project.Project
import project.ProjectID
import project.annotationschema.AnnotationSchema
import project.export.Export
import project.filter.FilterCondition
import project.inputmapping.InputMapping
import project.layout.Layout
import project.policy.Policy
import project.selection.DocumentSelection
import project.sort.Sort
import project.userroles.UserIdentifier
import project.userroles.UserRoles

/**
 * View data class - all properties necessary to display and edit project from management perspective in frontend
 */
data class ManageProject(
    val id: ProjectID,
    val name: String,
    val description: String = "",
    val priority: Int,
    val active: Boolean,
    val userRoles: UserRoles,
    val inputMapping: InputMapping,
    val filter: FilterCondition?,
    val sort: Sort,
    val selection: DocumentSelection,
    val annotationSchema: AnnotationSchema,
    val layout: Layout,
    val policy: Policy,
    val export: Export,
    val createProjectSpecificIndexes: Boolean
)

/**
 * Convert a [Project] to a [ManageProject]
 */
fun Project.toManageProject(): ManageProject {
    return ManageProject(
        id,
        name,
        description,
        priority,
        active,
        userRoles,
        inputMapping,
        filter,
        sort,
        selection,
        annotationSchema,
        layout,
        policy,
        export,
        createProjectSpecificIndexes
    )
}

/**
 * Convert a [ManageProject] to a [Project]
 */
fun ManageProject.toProject(
    creator: UserIdentifier,
    creationTimestamp: Long = System.currentTimeMillis(),
    updateTimestamp: Long = System.currentTimeMillis()
): Project {
    return Project(
        id,
        name,
        description,
        creator,
        creationTimestamp,
        updateTimestamp,
        priority,
        active,
        userRoles,
        inputMapping,
        filter,
        sort,
        selection,
        annotationSchema,
        layout,
        policy,
        export,
        createProjectSpecificIndexes
    )
}