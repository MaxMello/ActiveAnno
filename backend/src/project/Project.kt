package project

import document.Document
import org.bson.codecs.pojo.annotations.BsonId
import project.annotationschema.AnnotationSchema
import project.annotationschema.generator.HandlingPolicy
import project.export.Export
import project.filter.Equals
import project.filter.FilterCondition
import project.inputmapping.InputMapping
import project.layout.Layout
import project.policy.Policy
import project.selection.DocumentSelection
import project.sort.Sort
import project.userroles.UserIdentifier
import project.userroles.UserRoles


typealias ProjectID = String
/**
 * Complete model of a project. This model represents the database structure / is stored in mongoDB
 */
data class Project(
    /**
     * DB id (auto-generated after storing / will be not-null when retrieved from DB)
     */
    @BsonId val id: ProjectID,
    /**
     * Short, descriptive name of project
     */
    var name: String,
    /**
     * Longer description of the project, can be displayed in the UI and should be useful for annotators to read.
     */
    var description: String = "",
    /**
     * Initial creator of the project
     */
    val creator: UserIdentifier,
    val creationTimestamp: Long = System.currentTimeMillis(),
    val updateTimestamp: Long = System.currentTimeMillis(),
    /**
     * An integer value indicating the priority of the project - will be used to sort project (higher = more important)
     */
    var priority: Int,
    /**
     * Flag indicating if the project is active or not - only active projects will be used for annotation / curation.
     */
    var active: Boolean,
    val userRoles: UserRoles,
    val inputMapping: InputMapping,
    /**
     * If the filter is null, the Project is a one-off project and will use the project ID to filter
     * documents with a matching restricted project
     */
    val filter: FilterCondition?,
    val sort: Sort,
    val selection: DocumentSelection = DocumentSelection(),
    val annotationSchema: AnnotationSchema,
    val layout: Layout,
    val policy: Policy,
    val export: Export,
    /**
     * Should indexes be created for documents of this project. Should be set to true if you have lots of relevant documents (thousands+) for
     * better performance
     */
    val createProjectSpecificIndexes: Boolean = false
)

/**
 * Data class used to store the [AnnotateProject] used in the annotation process. For example, the selection is not part
 * of this, because it can be very big and is generally unnecessary to store.
 */
data class UsedAnnotateProject(
    val id: ProjectID,
    val name: String,
    val description: String,
    val priority: Int,
    val layout: Layout,
    val allowManualEscalationToCurator: Boolean,
    val generatedAnnotationResultHandlingPolicy: HandlingPolicy? = null
)

/**
 * A single validation error for a specific key of the [ManageProject]
 */
data class ProjectValidationError(
    val key: String,
    val message: String,
    /**
     * [criticalError] means, the project cannot be saved. Else, it just cannot be set active
     */
    val criticalError: Boolean = false
)


/**
 * Get the filterCondition to use for a [Project]. If the project is null, it is treated as a restricted project
 * and the ID will be used to filter for restrictedProject from documents. Else, the method will make sure that no
 * restricted document for another project will be accidentally included for this project.
 */
fun Project.getFilterConditions(): Array<FilterCondition> {
    return if (filter == null) {
        arrayOf(Equals(Document::restrictedProjectID.name, id))
    } else {
        arrayOf(Equals(Document::restrictedProjectID.name, null), filter)
    }
}

