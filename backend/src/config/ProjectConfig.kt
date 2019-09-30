package config

import application.documentDAO
import com.fasterxml.jackson.databind.node.ObjectNode
import config.annotations.Annotations
import config.annotations.OpenTagAnnotation
import config.export.Export
import config.filter.Equals
import config.filter.FilterCondition
import config.inputmapping.InputMapping
import config.layout.Layout
import config.policy.Policy
import config.sort.Sort
import config.userroles.UserIdentifier
import config.userroles.UserRoles
import document.KEY_RESTRICTED_CONFIG

/**
 * Complete model of a project configuration. This model represents the database structure / is stored in mongoDB
 */
data class ProjectConfig(
    /**
     * DB id (auto-generated after storing / will be not-null when retrieved from DB)
     */
    var _id: String,
    /**
     * Short, descriptive name of project
     */
    val name: String,
    /**
     * Longer description of the project, can be displayed in the UI and should be useful for annotators to read.
     */
    val description: String = "",
    /**
     * Initial creator of the project config
     */
    val creator: UserIdentifier,
    val creationTimestamp: Long = System.currentTimeMillis(),
    val updateTimestamp: Long = System.currentTimeMillis(),
    /**
     * An integer value indicating the priority of the project - will be used to sort project configurations (higher = more important)
     */
    val priority: Int,
    /**
     * Flag indicating if the config is active or not - only active configs will be used for annotation / curation.
     */
    val active: Boolean,
    val userRoles: UserRoles,
    val inputMapping: InputMapping,
    /**
     * If the filter is null, the Project is a one-off project and will use the config ID to filter
     * documents with a matching restrictedConfig
     */
    val filter: FilterCondition?,
    val sort: Sort,
    val annotations: Annotations,
    val layout: Layout,
    val policy: Policy,
    val export: Export
)

/**
 * View data class - all properties relevant to annotate / curate a config in the frontend
 */
data class AnnotateConfig(
    val id: String,
    val name: String,
    val description: String,
    val priority: Int,
    val annotations: Annotations,
    val layout: Layout,
    val allowManualEscalationToCurator: Boolean
)


/**
 * View data class - all properties necessary to display config in list in the frontend
 */
data class ListConfig(
    val id: String,
    val name: String,
    val description: String = "",
    val priority: Int
)

/**
 * View data class - all properties necessary to display and edit config from management perspective in frontend
 */
data class ManageConfig(
    val id: String,
    val name: String,
    val description: String = "",
    val priority: Int,
    val active: Boolean,
    val userRoles: UserRoles,
    val inputMapping: InputMapping,
    val filter: FilterCondition?,
    val sort: Sort,
    val annotations: Annotations,
    val layout: Layout,
    val policy: Policy,
    val export: Export
)

/**
 * Data class wrapping the map of [ConfigValidationError]s
 */
data class ConfigValidationResult(
    val errors: Map<String, ConfigValidationError>
)

/**
 * A single validation error for a specific key of the [ManageConfig]
 */
data class ConfigValidationError(
    val key: String,
    val missing: Boolean? = null,
    val invalidValue: Boolean? = null
)

/**
 * Validate a config, using a [ObjectNode] format to be able to check every necessary field even when a automatic
 * mapping to [ManageConfig] would fail.
 */
fun validateManageConfig(config: ObjectNode): ConfigValidationResult {
    val errors = mutableMapOf<String, ConfigValidationError>()
    if(!config.has("id")) {
        errors.put("id", ConfigValidationError("id", missing = true))
    } else if(!config.get("id").asText().matches("^[a-zA-Z0-9_]{6,}\$".toRegex())) {
        errors.put("id", ConfigValidationError("id", invalidValue = true))
    }
    if(!config.has("name")) {
        errors.put("name", ConfigValidationError("name", missing = true))
    } else if(config.get("name").asText().isBlank()) {
        errors.put("name", ConfigValidationError("name", invalidValue = true))
    }
    if(!config.has("priority")) {
        errors.put("priority", ConfigValidationError("priority", missing = true))
    }
    return ConfigValidationResult(errors)
}


fun ProjectConfig.toListConfig(): ListConfig {
    return ListConfig(_id, name, description, priority)
}

/**
 * Convert a [ProjectConfig] to an [AnnotateConfig], doing some operations to enrich the config data to be able to use it
 * for annotation. For example, if an [OpenTagAnnotation] is present, this method might aggregate the existing values
 * from all documents of the config and add it to the annotation config.
 */
suspend fun ProjectConfig.toAnnotateConfig(): AnnotateConfig {
    return AnnotateConfig(_id, name, description, priority, annotations.apply {
        annotationMap.values.map {
            if(it is OpenTagAnnotation && it.useExistingValuesAsPredefinedTags) {
                // Add existing tags from other annotations to list of predefined tags
                it.predefinedTags.apply {
                    addAll(documentDAO.aggregateValuesForConfigAndAnnotation(_id, it.id))
                }.toSet().toList().sorted()
            }
        }
    }, layout, policy.allowManualEscalationToCurator)
}

fun ProjectConfig.toManageConfig(): ManageConfig {
    return ManageConfig(_id, name, description, priority, active, userRoles, inputMapping, filter, sort, annotations, layout, policy, export)
}

fun ManageConfig.toProjectConfig(creator: UserIdentifier, creationTimestamp: Long = System.currentTimeMillis(), updateTimestamp: Long = System.currentTimeMillis()): ProjectConfig {
    return ProjectConfig(id, name, description, creator, creationTimestamp, updateTimestamp, priority, active, userRoles, inputMapping, filter, sort, annotations, layout, policy, export)
}

/**
 * Get the filterCondition to use for a [ProjectConfig]. If the config is null, it is treated as a restricted config
 * and the ID will be used to filter for restrictedConfig from documents. Else, the method will make sure that no
 * restricted document for another config will be accidentally included for this config.
 */
fun ProjectConfig.getFilterConditions(): Array<FilterCondition> {
    return if(filter == null) {
        arrayOf(Equals(KEY_RESTRICTED_CONFIG, _id))
    } else {
        arrayOf(Equals(KEY_RESTRICTED_CONFIG, null), filter)
    }
}

