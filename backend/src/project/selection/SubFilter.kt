package project.selection

import com.fasterxml.jackson.databind.node.ObjectNode


/**
 * How to select a subfilter
 */
enum class SelectionType {
    /**
     * Aggregate all values and show as dropdown
     */
    AGGREGATE_ALL_VALUES,

    /**
     * Allow for open input field
     */
    INPUT_FIELD
}

/**
 * A [SubFilter] is one element by which a user can filter documents shown
 */
data class SubFilter(
    /**
     * originalDocument key
     */
    val key: String,
    /**
     * String to display above input
     */
    val displayName: String,
    /**
     * The kind of input
     */
    val selectionType: SelectionType
)

/**
 * Option aggregated with count
 */
data class SubFilterOption(
    val value: String,
    val count: Int
)

/**
 * A subfilter but with options aggregated
 */
data class SubFilterWithOptions(
    val key: String,
    val displayName: String,
    val selectionType: SelectionType,
    val options: List<SubFilterOption>
)

/**
 * For subfilter selection query to map the result
 */
data class SubFilterQueryResult(
    val originalDocument: ObjectNode
)

/**
 * How should the date range filter work
 */
data class DateRangeFilter(
    /**
     * can be customized by any key inside originalDocument
     */
    val dateKey: String = "storeTimestamp",
    /**
     * DateFormat to parse the date if it is not a timestamp already, null for timestamp parsing
     */
    val dateFormat: String? = null
)

/**
 * Given annotators and curators the ability to further specify which documents are shown to them
 */
data class DocumentSelection(
    val subFilter: List<SubFilter> = listOf(),
    val dateRangeFilter: DateRangeFilter? = null
)

/**
 * Equivalent to [DocumentSelection] but with aggregated options inside
 */
data class DocumentSelectionWithOptions(
    val subFilter: List<SubFilterWithOptions> = listOf(),
    val dateRangeFilter: DateRangeFilter? = null
)