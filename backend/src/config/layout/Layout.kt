package config.layout

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import java.util.*


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
    val children: List<Element>
)

/**
 * Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = DocumentTextElement::class, name = "DocumentText"),
    JsonSubTypes.Type(value = Text::class, name = "Text"),
    JsonSubTypes.Type(value = Icon::class, name = "Icon"),
    JsonSubTypes.Type(value = Base64Image::class, name = "Base64Image"),
    JsonSubTypes.Type(value = UrlImage::class, name = "UrlImage"),
    JsonSubTypes.Type(value = TextMetaData::class, name = "TextMetaData"),
    JsonSubTypes.Type(value = Base64ImageMetaData::class, name = "Base64ImageMetaData"),
    JsonSubTypes.Type(value = UrlImageMetaData::class, name = "UrlImageMetaData"),
    JsonSubTypes.Type(value = DateMetaData::class, name = "DateMetaData"),
    JsonSubTypes.Type(value = Popover::class, name = "Popover"),
    JsonSubTypes.Type(value = Bold::class, name = "Bold"),
    JsonSubTypes.Type(value = Italic::class, name = "Italic"),
    JsonSubTypes.Type(value = MonospaceFont::class, name = "MonospaceFont"),
    JsonSubTypes.Type(value = ButtonGroup::class, name = "ButtonGroup"),
    JsonSubTypes.Type(value = Dropdown::class, name = "Dropdown"),
    JsonSubTypes.Type(value = Chips::class, name = "Chips"),
    JsonSubTypes.Type(value = Slider::class, name = "Slider"),
    JsonSubTypes.Type(value = TextField::class, name = "TextField"),
    JsonSubTypes.Type(value = NumberField::class, name = "NumberField")
])
interface Element

/**
 * Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive
 */
interface DisplayElement : Element

/**
 * Just display some static text
 */
data class Text(
    val text: String
) : DisplayElement

/**
 * Display the value of a meta data element based on the ID
 */
data class TextMetaData(
    val id: String
) : DisplayElement


/**
 * Element displaying the document text.
 */
data class DocumentTextElement(
    /**
     * Text displayed above the document text, e.g. "Document", "Text", "Comment", ...
     */
    val label: String
) : DisplayElement

/**
 * Element displaying a constant Base64 encoded image
 */
data class Base64Image(
    val base64: String
) : DisplayElement

/**
 * Element displaying an image provided by an URL
 */
data class UrlImage(
    val url: String
) : DisplayElement

/**
 * Display a meta data element that is a base64 encoded image
 */
data class Base64ImageMetaData(
    val id: String
) : DisplayElement

/**
 * Display a meta data element that is an URL of an image
 */
data class UrlImageMetaData(
    val id: String
)

/**
 * Convert some input date format (e.g. timestamp) to date format or do nothing if not a timestamp for a given meta data element
 */
data class DateMetaData(
    val formatString: String,
    val id: String
) : DisplayElement

/**
 * Display a material icon
 */
data class Icon(
    /**
     * Material Icon name
     */
    val name: String,
    /**
     * Should the icon be displayed as being interactive (with some interaction effect) or just a static icon?
     * Might be set to true for Popovers on icons
     */
    val interactive: Boolean = false
) : DisplayElement

/**
 * Two ways a popover can be triggered, by click or hover
 */
enum class PopoverTrigger {
    CLICK, HOVER
}

/**
 * A popover element, providing the ability to hide information (no interactions!) befind a popover
 */
data class Popover(
    val targets: PopoverTarget,
    val content: PopoverContent,
    val trigger: PopoverTrigger = PopoverTrigger.CLICK
) : DisplayElement

/**
 * The PopoverContent are display elements which will be shown when the popover is visible
 */
class PopoverContent(
    vararg val elements: DisplayElement
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PopoverContent

        if (!elements.contentEquals(other.elements)) return false

        return true
    }

    override fun hashCode(): Int {
        return elements.contentHashCode()
    }

    override fun toString(): String {
        return "PopoverContent(elements=${Arrays.toString(elements)})"
    }
}

/**
 * The PopoverTarget will be displayed into the parent context directly (for example some text, an icon or a combination)
 */
class PopoverTarget(
    vararg val elements: DisplayElement
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PopoverTarget

        if (!elements.contentEquals(other.elements)) return false

        return true
    }

    override fun hashCode(): Int {
        return elements.contentHashCode()
    }

    override fun toString(): String {
        return "PopoverTarget(elements=${Arrays.toString(elements)})"
    }
}

/**
 * Wrapper element, all children's text elements will be bold. Equivalent to an inline html element with fontWeight bold
 * which will be applied to the children.
 */
class Bold(
    vararg val children: DisplayElement
) : DisplayElement {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Bold

        if (!children.contentEquals(other.children)) return false

        return true
    }

    override fun hashCode(): Int {
        return children.contentHashCode()
    }

    override fun toString(): String {
        return "Bold(children=${Arrays.toString(children)})"
    }
}

/**
 * Wrapper element, all children's text elements will be italic. Equivalent to an inline html element with italic font style
 * which will be applied to the children.
 */
class Italic(
    vararg val children: DisplayElement
) : DisplayElement {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Italic

        if (!children.contentEquals(other.children)) return false

        return true
    }

    override fun hashCode(): Int {
        return children.contentHashCode()
    }

    override fun toString(): String {
        return "Italic(children=${Arrays.toString(children)})"
    }
}

/**
 * Wrapper element, all children's text elements will use a monospace font. Equivalent to an inline html element with a monospace font
 * which will be applied to the children.
 */
class MonospaceFont(
    vararg val children: DisplayElement
) : DisplayElement {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MonospaceFont

        if (!children.contentEquals(other.children)) return false

        return true
    }

    override fun hashCode(): Int {
        return children.contentHashCode()
    }

    override fun toString(): String {
        return "MonospaceFont(children=${Arrays.toString(children)})"
    }
}

/**
 * Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value
 */
interface ActionElement : Element

/**
 * A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select.
 */
data class ButtonGroup(
    val referenceAnnotation: String
) : ActionElement

/**
 *
 */
data class Dropdown(
    val referenceAnnotation: String
) : ActionElement

/**
 * Chips element is a variable list of text inputs (tags) which can be extended, including an auto-complete feature with predefined answers.
 */
data class Chips(
    val referenceAnnotation: String
) : ActionElement

/**
 * A number slider with n steps and possible one or two markers to either set a number of a number range.
 */
data class Slider(
    val referenceAnnotation: String
) : ActionElement

/**
 * A multi line text input field
 */
data class TextField(
    val referenceAnnotation: String,
    /**
     * Ability to apply auto correct in the frontend
     */
    val showApplyAutoCorrectButton: Boolean = false
) : ActionElement

/**
 * HTML Number input
 */
data class NumberField(
    val referenceAnnotation: String
) : ActionElement