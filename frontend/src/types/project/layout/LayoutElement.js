// @flow
import type {
    BooleanAnnotationDefinition,
    ClosedNumberAnnotationDefinition,
    NumberRangeAnnotationDefinition,
    OpenNumberAnnotationDefinition,
    OpenTagAnnotationDefinition,
    OpenTextAnnotationDefinition,
    TagSetAnnotationDefinition
} from "../../annotationdefinition/AnnotationDefinition";
import type {EnableCondition} from "../annotationschema/EnableCondition";
import type {Dictionary} from "../../Types";
import type {ButtonSize} from "../../../constants/ButtonSizes";
import type {ButtonColor} from "../../../constants/ButtonColors";

// ActionElements

type BaseDenormalizedActionElement = {
    enableCondition?: EnableCondition
};

export type DenormalizedBooleanButtonGroup = {
    ...BaseDenormalizedActionElement,
    type: "DenormalizedBooleanButtonGroup",
    annotationDefinition: BooleanAnnotationDefinition,
    buttonSize?: ButtonSize,
    buttonColorTrue?: ButtonColor,
    buttonColorFalse?: ButtonColor
}

export type DenormalizedClosedNumberSlider = {
    ...BaseDenormalizedActionElement,
    type: "DenormalizedClosedNumberSlider",
    annotationDefinition: ClosedNumberAnnotationDefinition
}

export type DenormalizedNumberRangeSlider = {
    ...BaseDenormalizedActionElement,
    type: "DenormalizedNumberRangeSlider",
    annotationDefinition: NumberRangeAnnotationDefinition
}

export type DenormalizedOpenNumberInput = {
    ...BaseDenormalizedActionElement,
    type: "DenormalizedOpenNumberInput",
    annotationDefinition: OpenNumberAnnotationDefinition
}

export type DenormalizedOpenTagChipInput = {
    ...BaseDenormalizedActionElement,
    type: "DenormalizedOpenTagChipInput",
    annotationDefinition: OpenTagAnnotationDefinition
}

export type DenormalizedOpenTextInput = {
    ...BaseDenormalizedActionElement,
    type: "DenormalizedOpenTextInput",
    annotationDefinition: OpenTextAnnotationDefinition,
    showApplyAutoCorrectButton: boolean,
    highlightDifferencesToDocumentData?: string
}

export type DenormalizedTagSetButtonGroup = {
    ...BaseDenormalizedActionElement,
    type: "DenormalizedTagSetButtonGroup",
    annotationDefinition: TagSetAnnotationDefinition,
    buttonSize?: ButtonSize,
    buttonColors: Dictionary<string, ButtonColor>
}

export type DenormalizedTagSetDropdown = {
    ...BaseDenormalizedActionElement,
    type: "DenormalizedTagSetDropdown",
    annotationDefinition: TagSetAnnotationDefinition
}


// DisplayElements
export type Text = {
    type: "Text",
    text: string
}

export type TextMetaData = {
    type: "TextMetaData",
    id: string
}

export type MetaDataMapping = {
    type: "MetaDataMapping",
    id: string,
    mapping: Dictionary<string, Array<DisplayElement>>,
    fallback: Array<DisplayElement>
}

export type DocumentTextElement = {
    type: "DocumentText",
    label: string
}

export type Base64Image = {
    type: "Base64Image",
    base64: string
}

export type UrlImage = {
    type: "UrlImage",
    url: string
}

export type Base64ImageMetaData = {
    type: "Base64ImageMetaData",
    id: string
}

export type UrlImageMetaData = {
    type: "UrlImageMetaData",
    id: string
}

export type DateMetaData = {
    type: "DateMetaData",
    formatString: string,
    id: string
}

export type Icon = {
    type: "Icon",
    name: string,
    interactive: boolean
}

export type PopoverTrigger = "CLICK" | "HOVER";

export type Popover = {
    type: "Popover",
    targets: PopoverTarget,
    content: PopoverContent,
    trigger: PopoverTrigger
}

export type PopoverContent = {
    elements: Array<DisplayElement>
}

export type PopoverTarget = {
    elements: Array<DisplayElement>
}

export type Bold = {
    type: "Bold",
    elements: Array<DisplayElement>
}

export type Italic = {
    type: "Italic",
    elements: Array<DisplayElement>
}

export type MonospaceFont = {
    type: "MonospaceFont",
    elements: Array<DisplayElement>
}

export type DisplayElement = Text | TextMetaData | DocumentTextElement | Base64Image | UrlImage | Base64ImageMetaData |
    UrlImageMetaData | DateMetaData | Icon | Popover | Bold | Italic | MonospaceFont | MetaDataMapping;

export type DenormalizedActionElement = DenormalizedBooleanButtonGroup | DenormalizedClosedNumberSlider |
    DenormalizedNumberRangeSlider | DenormalizedOpenNumberInput | DenormalizedOpenTagChipInput |
    DenormalizedOpenTextInput | DenormalizedTagSetButtonGroup | DenormalizedTagSetDropdown;

export type LayoutElement = DisplayElement | DenormalizedActionElement;