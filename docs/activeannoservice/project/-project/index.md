[activeannoservice](../../index.md) / [project](../index.md) / [Project](./index.md)

# Project

`data class Project`

Complete model of a project. This model represents the database structure / is stored in mongoDB

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Complete model of a project. This model represents the database structure / is stored in mongoDB`Project(id: `[`ProjectID`](../-project-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "", creator: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, userRoles: `[`UserRoles`](../../project.userroles/-user-roles/index.md)`, inputMapping: `[`InputMapping`](../../project.inputmapping/-input-mapping/index.md)`, filter: `[`FilterCondition`](../../project.filter/-filter-condition/index.md)`?, sort: `[`Sort`](../../project.sort/-sort/index.md)`, selection: `[`DocumentSelection`](../../project.selection/-document-selection/index.md)` = DocumentSelection(), annotationSchema: `[`AnnotationSchema`](../../project.annotationschema/-annotation-schema/index.md)`, layout: `[`Layout`](../../project.layout/-layout/index.md)`, policy: `[`Policy`](../../project.policy/-policy/index.md)`, export: `[`Export`](../../project.export/-export/index.md)`, createProjectSpecificIndexes: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false)` |

### Properties

| Name | Summary |
|---|---|
| [active](active.md) | Flag indicating if the project is active or not - only active projects will be used for annotation / curation.`var active: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [annotationSchema](annotation-schema.md) | `val annotationSchema: `[`AnnotationSchema`](../../project.annotationschema/-annotation-schema/index.md) |
| [createProjectSpecificIndexes](create-project-specific-indexes.md) | Should indexes be created for documents of this project. Should be set to true if you have lots of relevant documents (thousands+) for better performance`val createProjectSpecificIndexes: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [creationTimestamp](creation-timestamp.md) | `val creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [creator](creator.md) | Initial creator of the project`val creator: `[`UserIdentifier`](../../project.userroles/-user-identifier.md) |
| [description](description.md) | Longer description of the project, can be displayed in the UI and should be useful for annotators to read.`var description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [export](export.md) | `val export: `[`Export`](../../project.export/-export/index.md) |
| [filter](filter.md) | If the filter is null, the Project is a one-off project and will use the project ID to filter documents with a matching restricted project`val filter: `[`FilterCondition`](../../project.filter/-filter-condition/index.md)`?` |
| [id](id.md) | DB id (auto-generated after storing / will be not-null when retrieved from DB)`val id: `[`ProjectID`](../-project-i-d.md) |
| [inputMapping](input-mapping.md) | `val inputMapping: `[`InputMapping`](../../project.inputmapping/-input-mapping/index.md) |
| [layout](layout.md) | `val layout: `[`Layout`](../../project.layout/-layout/index.md) |
| [name](name.md) | Short, descriptive name of project`var name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [policy](policy.md) | `val policy: `[`Policy`](../../project.policy/-policy/index.md) |
| [priority](priority.md) | An integer value indicating the priority of the project - will be used to sort project (higher = more important)`var priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [selection](selection.md) | `val selection: `[`DocumentSelection`](../../project.selection/-document-selection/index.md) |
| [sort](sort.md) | `val sort: `[`Sort`](../../project.sort/-sort/index.md) |
| [updateTimestamp](update-timestamp.md) | `val updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [userRoles](user-roles.md) | `val userRoles: `[`UserRoles`](../../project.userroles/-user-roles/index.md) |

### Extension Functions

| Name | Summary |
|---|---|
| [generateMissingAnnotationsForAllDocumentsBulk](../../project.annotationschema.generator/generate-missing-annotations-for-all-documents-bulk.md) | Given a [Project](./index.md), generate missing annotations for all documents for the project and update the documents. This method does it multiple chunks, given a size parameter`suspend fun `[`Project`](./index.md)`.generateMissingAnnotationsForAllDocumentsBulk(chuckSize: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 100, limit: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = Int.MAX_VALUE): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [getFilterConditions](../get-filter-conditions.md) | Get the filterCondition to use for a [Project](./index.md). If the project is null, it is treated as a restricted project and the ID will be used to filter for restrictedProject from documents. Else, the method will make sure that no restricted document for another project will be accidentally included for this project.`fun `[`Project`](./index.md)`.getFilterConditions(): `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`FilterCondition`](../../project.filter/-filter-condition/index.md)`>` |
| [toAnnotateProject](../../api.annotate.dto/to-annotate-project.md) | Convert a [Project](./index.md) to an [AnnotateProject](../../api.annotate.dto/-annotate-project/index.md), doing some operations to enrich the project data to be able to use it for annotation. For example, if an OpenTagAnnotation is present, this method might aggregate the existing values from all documents of the project and add it to the AnnotateProject.`suspend fun `[`Project`](./index.md)`.toAnnotateProject(userIdentifier: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, userIsCurator: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false): `[`AnnotateProject`](../../api.annotate.dto/-annotate-project/index.md) |
| [toListProject](../../api.annotate.dto/to-list-project.md) | Convert a [Project](./index.md) to a [ListProject](../../api.annotate.dto/-list-project/index.md)`fun `[`Project`](./index.md)`.toListProject(): `[`ListProject`](../../api.annotate.dto/-list-project/index.md) |
| [toManageListProject](../../api.manage.dto/to-manage-list-project.md) | Convert a [Project](./index.md) to a [ManageListProject](../../api.manage.dto/-manage-list-project/index.md)`fun `[`Project`](./index.md)`.toManageListProject(): `[`ManageListProject`](../../api.manage.dto/-manage-list-project/index.md) |
| [toManageProject](../../api.manage.dto/to-manage-project.md) | Convert a [Project](./index.md) to a [ManageProject](../../api.manage.dto/-manage-project/index.md)`fun `[`Project`](./index.md)`.toManageProject(): `[`ManageProject`](../../api.manage.dto/-manage-project/index.md) |
