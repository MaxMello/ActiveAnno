package project.layout.elements.display

import project.layout.LayoutElement
import java.util.*

/**
 * Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive
 */
interface DisplayElement : LayoutElement

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
 * For a meta data element, use the value as a key to the [mapping] map and display a list of
 * [DisplayElement]s or the fallback if no value is found for the key
 */
data class MetaDataMapping(
    val id: String,
    val mapping: Map<String, List<DisplayElement>>,
    val fallback: List<DisplayElement>
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
) : DisplayElement

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