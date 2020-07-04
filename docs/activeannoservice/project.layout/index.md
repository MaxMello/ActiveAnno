[activeannoservice](../index.md) / [project.layout](./index.md)

## Package project.layout

### Types

| Name | Summary |
|---|---|
| [ButtonColor](-button-color/index.md) | `enum class ButtonColor` |
| [ButtonSize](-button-size/index.md) | `enum class ButtonSize` |
| [Column](-column/index.md) | A column is part of a row and has a width dependent of screen size. Every row should have at least one column.`data class Column` |
| [ColumnSizes](-column-sizes/index.md) | The UI defines 5 different screen size breakpoints, from smallest (xs) to largest (xl). The actual pixel breakpoints are defined by the UI. Column sizes should be in [1,12](#) range, 12 being the full width of the row, 1 being 1/12 width of the row. At least xs needs to be defined.`data class ColumnSizes` |
| [Layout](-layout/index.md) | Define the layout of how annotation interactions / inputs will be displayed in the UI.`data class Layout` |
| [LayoutArea](-layout-area/index.md) | Mapping of layout areas to list of rows containing UI elements`data class LayoutArea` |
| [LayoutAreaType](-layout-area-type/index.md) | There are 4 different UI areas which are defined by this enum. All four areas can contain read-only/display elements, but not all are allowed to have all types of interaction elements.`enum class LayoutAreaType` |
| [LayoutElement](-layout-element.md) | Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements.`interface LayoutElement` |
| [Row](-row/index.md) | Equivalent to a Row of UI layout systems like Bootstrap or Material UI`data class Row` |
