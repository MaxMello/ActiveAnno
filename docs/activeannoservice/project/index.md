[activeannoservice](../index.md) / [project](./index.md)

## Package project

### Types

| Name | Summary |
|---|---|
| [Project](-project/index.md) | Complete model of a project. This model represents the database structure / is stored in mongoDB`data class Project` |
| [ProjectDAO](-project-d-a-o/index.md) | DAO for the [Project](-project/index.md) regulating access to the project collection`class ProjectDAO` |
| [ProjectID](-project-i-d.md) | `typealias ProjectID = `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [ProjectValidationError](-project-validation-error/index.md) | A single validation error for a specific key of the [ManageProject](#)`data class ProjectValidationError` |
| [UsedAnnotateProject](-used-annotate-project/index.md) | Data class used to store the [AnnotateProject](#) used in the annotation process. For example, the selection is not part of this, because it can be very big and is generally unnecessary to store.`data class UsedAnnotateProject` |

### Functions

| Name | Summary |
|---|---|
| [getFilterConditions](get-filter-conditions.md) | Get the filterCondition to use for a [Project](-project/index.md). If the project is null, it is treated as a restricted project and the ID will be used to filter for restrictedProject from documents. Else, the method will make sure that no restricted document for another project will be accidentally included for this project.`fun `[`Project`](-project/index.md)`.getFilterConditions(): `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`FilterCondition`](../project.filter/-filter-condition/index.md)`>` |
