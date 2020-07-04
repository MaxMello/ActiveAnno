// @flow
import type {Dictionary} from "../types/Types";

export const LayoutElement: Dictionary<string, string> = {
    // DisplayElements
    DOCUMENT_TEXT: "DocumentText",
    TEXT: "Text",
    ICON: "Icon",
    BASE64_IMAGE: "Base64Image",
    URL_IMAGE: "UrlImage",
    TEXT_META_DATA: "TextMetaData",
    META_DATA_MAPPING: "MetaDataMapping",
    BASE64_IMAGE_META_DATA: "Base64ImageMetaData",
    URL_IMAGE_META_DATA: "UrlImageMetaData",
    DATE_META_DATA: "DateMetaData",
    POPOVER: "Popover",
    BOLD: "Bold",
    ITALIC: "Italic",
    MONOSPACE: "MonospaceFont",
    // ActionElements
    BOOLEAN_BUTTON_GROUP: "DenormalizedBooleanButtonGroup",
    CLOSED_NUMBER_SLIDER: "DenormalizedClosedNumberSlider",
    NUMBER_RANGE_SLIDER: "DenormalizedNumberRangeSlider",
    OPEN_NUMBER_INPUT: "DenormalizedOpenNumberInput",
    OPEN_TAG_CHIP_INPUT: "DenormalizedOpenTagChipInput",
    OPEN_TEXT_INPUT: "DenormalizedOpenTextInput",
    TAG_SET_BUTTON_GROUP: "DenormalizedTagSetButtonGroup",
    TAG_SET_DROPDOWN: "DenormalizedTagSetDropdown"
};

export const ActionElements = {
    BOOLEAN_BUTTON_GROUP: "DenormalizedBooleanButtonGroup",
    CLOSED_NUMBER_SLIDER: "DenormalizedClosedNumberSlider",
    NUMBER_RANGE_SLIDER: "DenormalizedNumberRangeSlider",
    OPEN_NUMBER_INPUT: "DenormalizedOpenNumberInput",
    OPEN_TAG_CHIP_INPUT: "DenormalizedOpenTagChipInput",
    OPEN_TEXT_INPUT: "DenormalizedOpenTextInput",
    TAG_SET_BUTTON_GROUP: "DenormalizedTagSetButtonGroup",
    TAG_SET_DROPDOWN: "DenormalizedTagSetDropdown"
}

export const NormalizedActionElements = {
    BOOLEAN_BUTTON_GROUP: "BooleanButtonGroup",
    CLOSED_NUMBER_SLIDER: "ClosedNumberSlider",
    NUMBER_RANGE_SLIDER: "NumberRangeSlider",
    OPEN_NUMBER_INPUT: "OpenNumberInput",
    OPEN_TAG_CHIP_INPUT: "OpenTagChipInput",
    OPEN_TEXT_INPUT: "OpenTextInput",
    TAG_SET_BUTTON_GROUP: "TagSetButtonGroup",
    TAG_SET_DROPDOWN: "TagSetDropdown"
};