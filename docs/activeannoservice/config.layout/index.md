[activeannoservice](../index.md) / [config.layout](./index.md)

## Package config.layout

### Types

| Name | Summary |
|---|---|
| [ActionElement](-action-element.md) | `interface ActionElement : `[`Element`](-element.md)<br>Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value |
| [Base64Image](-base64-image/index.md) | `data class Base64Image : `[`DisplayElement`](-display-element.md)<br>Element displaying a constant Base64 encoded image |
| [Base64ImageMetaData](-base64-image-meta-data/index.md) | `data class Base64ImageMetaData : `[`DisplayElement`](-display-element.md)<br>Display a meta data element that is a base64 encoded image |
| [Bold](-bold/index.md) | `class Bold : `[`DisplayElement`](-display-element.md)<br>Wrapper element, all children's text elements will be bold. Equivalent to an inline html element with fontWeight bold which will be applied to the children. |
| [ButtonGroup](-button-group/index.md) | `data class ButtonGroup : `[`ActionElement`](-action-element.md)<br>A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select. |
| [Chips](-chips/index.md) | `data class Chips : `[`ActionElement`](-action-element.md)<br>Chips element is a variable list of text inputs (tags) which can be extended, including an auto-complete feature with predefined answers. |
| [Column](-column/index.md) | `data class Column`<br>A column is part of a row and has a width dependent of screen size. Every row should have at least one column. |
| [ColumnSizes](-column-sizes/index.md) | `data class ColumnSizes`<br>The UI defines 5 different screen size breakpoints, from smallest (xs) to largest (xl). The actual pixel breakpoints are defined by the UI. Column sizes should be in [1,12](#) range, 12 being the full width of the row, 1 being 1/12 width of the row. At least xs needs to be defined. |
| [DateMetaData](-date-meta-data/index.md) | `data class DateMetaData : `[`DisplayElement`](-display-element.md)<br>Convert some input date format (e.g. timestamp) to date format or do nothing if not a timestamp for a given meta data element |
| [DisplayElement](-display-element.md) | `interface DisplayElement : `[`Element`](-element.md)<br>Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive |
| [DocumentTextElement](-document-text-element/index.md) | `data class DocumentTextElement : `[`DisplayElement`](-display-element.md)<br>Element displaying the document text. |
| [Dropdown](-dropdown/index.md) | `data class Dropdown : `[`ActionElement`](-action-element.md) |
| [Element](-element.md) | `interface Element`<br>Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements. |
| [Icon](-icon/index.md) | `data class Icon : `[`DisplayElement`](-display-element.md)<br>Display a material icon |
| [Italic](-italic/index.md) | `class Italic : `[`DisplayElement`](-display-element.md)<br>Wrapper element, all children's text elements will be italic. Equivalent to an inline html element with italic font style which will be applied to the children. |
| [Layout](-layout/index.md) | `data class Layout`<br>Define the layout of how annotation interactions / inputs will be displayed in the UI. |
| [LayoutArea](-layout-area/index.md) | `data class LayoutArea`<br>Mapping of layout areas to list of rows containing UI elements |
| [LayoutAreaType](-layout-area-type/index.md) | `enum class LayoutAreaType`<br>There are 4 different UI areas which are defined by this enum. All four areas can contain read-only/display elements, but not all are allowed to have all types of interaction elements. |
| [MonospaceFont](-monospace-font/index.md) | `class MonospaceFont : `[`DisplayElement`](-display-element.md)<br>Wrapper element, all children's text elements will use a monospace font. Equivalent to an inline html element with a monospace font which will be applied to the children. |
| [NumberField](-number-field/index.md) | `data class NumberField : `[`ActionElement`](-action-element.md)<br>HTML Number input |
| [Popover](-popover/index.md) | `data class Popover : `[`DisplayElement`](-display-element.md)<br>A popover element, providing the ability to hide information (no interactions!) befind a popover |
| [PopoverContent](-popover-content/index.md) | `class PopoverContent`<br>The PopoverContent are display elements which will be shown when the popover is visible |
| [PopoverTarget](-popover-target/index.md) | `class PopoverTarget`<br>The PopoverTarget will be displayed into the parent context directly (for example some text, an icon or a combination) |
| [PopoverTrigger](-popover-trigger/index.md) | `enum class PopoverTrigger`<br>Two ways a popover can be triggered, by click or hover |
| [Row](-row/index.md) | `data class Row`<br>Equivalent to a Row of UI layout systems like Bootstrap or Material UI |
| [Slider](-slider/index.md) | `data class Slider : `[`ActionElement`](-action-element.md)<br>A number slider with n steps and possible one or two markers to either set a number of a number range. |
| [Text](-text/index.md) | `data class Text : `[`DisplayElement`](-display-element.md)<br>Just display some static text |
| [TextField](-text-field/index.md) | `data class TextField : `[`ActionElement`](-action-element.md)<br>A multi line text input field |
| [TextMetaData](-text-meta-data/index.md) | `data class TextMetaData : `[`DisplayElement`](-display-element.md)<br>Display the value of a meta data element based on the ID |
| [UrlImage](-url-image/index.md) | `data class UrlImage : `[`DisplayElement`](-display-element.md)<br>Element displaying an image provided by an URL |
| [UrlImageMetaData](-url-image-meta-data/index.md) | `data class UrlImageMetaData`<br>Display a meta data element that is an URL of an image |
