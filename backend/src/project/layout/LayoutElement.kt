package project.layout

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import project.layout.elements.action.*
import project.layout.elements.display.*

/**
 * Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        // DisplayElements
        JsonSubTypes.Type(value = DocumentTextElement::class, name = "DocumentText"),
        JsonSubTypes.Type(value = Text::class, name = "Text"),
        JsonSubTypes.Type(value = Icon::class, name = "Icon"),
        JsonSubTypes.Type(value = Base64Image::class, name = "Base64Image"),
        JsonSubTypes.Type(value = UrlImage::class, name = "UrlImage"),
        JsonSubTypes.Type(value = TextMetaData::class, name = "TextMetaData"),
        JsonSubTypes.Type(value = MetaDataMapping::class, name = "MetaDataMapping"),
        JsonSubTypes.Type(value = Base64ImageMetaData::class, name = "Base64ImageMetaData"),
        JsonSubTypes.Type(value = UrlImageMetaData::class, name = "UrlImageMetaData"),
        JsonSubTypes.Type(value = DateMetaData::class, name = "DateMetaData"),
        JsonSubTypes.Type(value = Popover::class, name = "Popover"),
        JsonSubTypes.Type(value = Bold::class, name = "Bold"),
        JsonSubTypes.Type(value = Italic::class, name = "Italic"),
        JsonSubTypes.Type(value = MonospaceFont::class, name = "MonospaceFont"),
        // ActionElements
        JsonSubTypes.Type(value = BooleanButtonGroup::class, name = "BooleanButtonGroup"),
        JsonSubTypes.Type(value = ClosedNumberSlider::class, name = "ClosedNumberSlider"),
        JsonSubTypes.Type(value = NumberRangeSlider::class, name = "NumberRangeSlider"),
        JsonSubTypes.Type(value = OpenNumberInput::class, name = "OpenNumberInput"),
        JsonSubTypes.Type(value = OpenTagChipInput::class, name = "OpenTagChipInput"),
        JsonSubTypes.Type(value = OpenTextInput::class, name = "OpenTextInput"),
        JsonSubTypes.Type(value = TagSetButtonGroup::class, name = "TagSetButtonGroup"),
        JsonSubTypes.Type(value = TagSetDropdown::class, name = "TagSetDropdown"),
        // Denormalized ActionElements
        JsonSubTypes.Type(value = DenormalizedBooleanButtonGroup::class, name = "DenormalizedBooleanButtonGroup"),
        JsonSubTypes.Type(value = DenormalizedClosedNumberSlider::class, name = "DenormalizedClosedNumberSlider"),
        JsonSubTypes.Type(value = DenormalizedNumberRangeSlider::class, name = "DenormalizedNumberRangeSlider"),
        JsonSubTypes.Type(value = DenormalizedOpenNumberInput::class, name = "DenormalizedOpenNumberInput"),
        JsonSubTypes.Type(value = DenormalizedOpenTagChipInput::class, name = "DenormalizedOpenTagChipInput"),
        JsonSubTypes.Type(value = DenormalizedOpenTextInput::class, name = "DenormalizedOpenTextInput"),
        JsonSubTypes.Type(value = DenormalizedTagSetButtonGroup::class, name = "DenormalizedTagSetButtonGroup"),
        JsonSubTypes.Type(value = DenormalizedTagSetDropdown::class, name = "DenormalizedTagSetDropdown")
    ]
)
interface LayoutElement