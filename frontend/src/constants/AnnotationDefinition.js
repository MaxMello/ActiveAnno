// @flow
import {CaseBehavior} from "./CaseBehavior";

export const AnnotationDefinition = {
    TagSetAnnotationDefinition: "TagSetAnnotationDefinition",
    BooleanAnnotationDefinition: "BooleanAnnotationDefinition",
    OpenTextAnnotationDefinition: "OpenTextAnnotationDefinition",
    OpenTagAnnotationDefinition: "OpenTagAnnotationDefinition",
    ClosedNumberAnnotationDefinition: "ClosedNumberAnnotationDefinition",
    OpenNumberAnnotationDefinition: "OpenNumberAnnotationDefinition",
    NumberRangeAnnotationDefinition: "NumberRangeAnnotationDefinition"
};

const defaultAnnotationDefinition = {
    id: "",
    name: "",
    shortName: ""
};

/**
 * Default values for new annotation definitions
 */
export const DefaultAnnotationDefinitions = {
    [AnnotationDefinition.TagSetAnnotationDefinition]: {
        ...defaultAnnotationDefinition,
        type: AnnotationDefinition.TagSetAnnotationDefinition,
        minNumberOfTags: 1,
        maxNumberOfTags: null,
        options: [

        ]
    },
    [AnnotationDefinition.BooleanAnnotationDefinition]: {
        ...defaultAnnotationDefinition,
        type: AnnotationDefinition.BooleanAnnotationDefinition,
        optional: false
    },
    [AnnotationDefinition.OpenTextAnnotationDefinition]: {
        ...defaultAnnotationDefinition,
        type: AnnotationDefinition.OpenTextAnnotationDefinition,
        minLength: 0,
        maxLength: null,
        optional: false,
        documentDataDefault: null
    },
    [AnnotationDefinition.OpenTagAnnotationDefinition]: {
        ...defaultAnnotationDefinition,
        type: AnnotationDefinition.OpenTagAnnotationDefinition,
        minNumberOfTags: 1,
        maxNumberOfTags: null,
        trimWhitespace: true,
        caseBehavior: CaseBehavior.KEEP_ORIGINAL,
        useExistingValuesAsPredefinedTags: false,
        predefinedTags: [

        ]
    },
    [AnnotationDefinition.ClosedNumberAnnotationDefinition]: {
        ...defaultAnnotationDefinition,
        type: AnnotationDefinition.ClosedNumberAnnotationDefinition,
        min: 1,
        max: 10,
        step: 1,
        optional: false
    },
    [AnnotationDefinition.OpenNumberAnnotationDefinition]: {
        ...defaultAnnotationDefinition,
        type: AnnotationDefinition.OpenNumberAnnotationDefinition,
        step: null,
        optional: false
    },
    [AnnotationDefinition.NumberRangeAnnotationDefinition]: {
        ...defaultAnnotationDefinition,
        type: AnnotationDefinition.NumberRangeAnnotationDefinition,
        min: 1,
        max: 10,
        step: 1,
        optional: false
    },
};