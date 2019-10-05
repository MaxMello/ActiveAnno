import {CaseBehavior} from "./CaseBehavior";

export const AnnotationType = {
    PredefinedTagSetAnnotation: "PredefinedTagSetAnnotation",
    BooleanAnnotation: "BooleanAnnotation",
    OpenTextAnnotation: "OpenTextAnnotation",
    OpenTagAnnotation: "OpenTagAnnotation",
    ClosedNumberAnnotation: "ClosedNumberAnnotation",
    OpenNumberAnnotation: "OpenNumberAnnotation",
    NumberRangeAnnotation: "NumberRangeAnnotation"
};

export const DefaultAnnotations = {
    [AnnotationType.PredefinedTagSetAnnotation]: {
        type: AnnotationType.PredefinedTagSetAnnotation,
        id: "",
        name: "",
        shortName: "",
        targets: [
            {
                type: "DocumentTarget"
            }
        ],
        minNumberOfTags: 1,
        maxNumberOfTags: null,
        options: [

        ]
    },
    [AnnotationType.BooleanAnnotation]: {
        type: AnnotationType.BooleanAnnotation,
        id: "",
        name: "",
        shortName: "",
        targets: [
            {
                type: "DocumentTarget"
            }
        ],
        optional: false
    },
    [AnnotationType.OpenTextAnnotation]: {
        type: AnnotationType.OpenTextAnnotation,
        id: "",
        name: "",
        shortName: "",
        targets: [
            {
                type: "DocumentTarget"
            }
        ],
        minLength: 0,
        maxLength: null,
        optional: false,
        useDocumentTextAsDefault: false
    },
    [AnnotationType.OpenTagAnnotation]: {
        type: AnnotationType.OpenTagAnnotation,
        id: "",
        name: "",
        shortName: "",
        targets: [
            {
                type: "DocumentTarget"
            }
        ],
        minNumberOfTags: 1,
        maxNumberOfTags: null,
        trimWhitespace: true,
        caseBehavior: CaseBehavior.KEEP_ORIGINAL,
        useExistingValuesAsPredefinedTags: true,
        predefinedTags: [

        ]
    },
    [AnnotationType.ClosedNumberAnnotation]: {
        type: AnnotationType.ClosedNumberAnnotation,
        id: "",
        name: "",
        shortName: "",
        targets: [
            {
                type: "DocumentTarget"
            }
        ],
        min: 1,
        max: 10,
        step: 1,
        optional: false
    },
    [AnnotationType.OpenNumberAnnotation]: {
        type: AnnotationType.OpenNumberAnnotation,
        id: "",
        name: "",
        shortName: "",
        targets: [
            {
                type: "DocumentTarget"
            }
        ],
        step: null,
        optional: false
    },
    [AnnotationType.NumberRangeAnnotation]: {
        type: AnnotationType.NumberRangeAnnotation,
        id: "",
        name: "",
        shortName: "",
        targets: [
            {
                type: "DocumentTarget"
            }
        ],
        min: 1,
        max: 10,
        step: 1,
        optional: false
    },
};