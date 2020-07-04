package project.layout


/**
 * Define the layout of how annotation interactions / inputs will be displayed in the UI.
 */
data class Layout(
    val layoutAreas: Map<LayoutAreaType, LayoutArea>
)

/**
 * There are 4 different UI areas which are defined by this enum. All four areas can contain read-only/display elements,
 * but not all are allowed to have all types of interaction elements.
 */
enum class LayoutAreaType {
    /**
     * The common area only contains non-interactive elements. Normally, this would be the document text as well as
     * important metadata.
     */
    Common,
    /**
     * Annotations that are shared between document and span target are shows above other annotations, so that the
     * switching between the two targets is easier. Only annotations with target document and span are allowed to be here
     */
    SharedTarget,
    /**
     * Annotation interactions that are only target to the whole document are in this area.
     */
    DocumentTarget,
    /**
     * Annotation interactions that are only target to individual spans of the document are in this area.
     */
    SpanTarget
}

/**
 * Mapping of layout areas to list of rows containing UI elements
 */
data class LayoutArea(
    val id: LayoutAreaType,
    val rows: List<Row>
)

/**
 * Equivalent to a Row of UI layout systems like Bootstrap or Material UI
 */
data class Row(
    val cols: List<Column>
)

/**
 * The UI defines 5 different screen size breakpoints, from smallest (xs) to largest (xl). The actual pixel breakpoints
 * are defined by the UI. Column sizes should be in [1,12] range, 12 being the full width of the row, 1 being 1/12 width of the row.
 * At least xs needs to be defined.
 */
data class ColumnSizes(
    val xs: Int,
    val sm: Int? = null,
    val md: Int? = null,
    val lg: Int? = null,
    val xl: Int? = null
)

/**
 * A column is part of a row and has a width dependent of screen size. Every row should have at least one column.
 */
data class Column(
    val width: ColumnSizes,
    /**
     * The actual UI elements, elements in the list will just be parsed as html elements one after another in the column.
     */
    var children: List<LayoutElement>
)