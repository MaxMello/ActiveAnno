export type TypeDocumentTarget = 'DocumentTarget';
export type DocumentTarget = {
    type: TypeDocumentTarget
};

export type SpanGranularity = 'CHARACTER' | 'TOKEN';
export type TypeSpanTarget = 'SpanTarget';
export type SpanTarget = {
    type: TypeSpanTarget,
    granularity: SpanGranularity,
    multiToken: boolean,
    trimWhitespace: boolean,
    trimPunctuation: boolean,
    allowStacking: boolean
}

export type TagSetOption = {
    id: string,
    name: string,
}

export type TypePredefinedTagSetAnnotation = "PredefinedTagSetAnnotation";
export type PredefinedTagSetAnnotation = {
    type: TypePredefinedTagSetAnnotation,
    id: string,
    name: string,
    targets: Array<DocumentTarget | SpanTarget>,
    minNumberOfTags: number,
    maxNumberOfTags: number,
    options: Array<TagSetOption>
}

export type CaseBehavior = 'KEEP_ORIGINAL' | 'TO_LOWER' | 'TO_UPPER' | 'CAPITALIZE';
export type TypeOpenTagAnnotation = "OpenTagAnnotation";
export type OpenTagAnnotation = {
    type: TypeOpenTagAnnotation,
    id: string,
    name: string,
    targets: Array<DocumentTarget | SpanTarget>,
    minNumberOfTags: number,
    maxNumberOfTags: number,
    trimWhitespace: boolean,
    caseBehavior: CaseBehavior,
    predefinedTags: Array<string>
}

export type TypeOpenTextAnnotation = "OpenTextAnnotation";
export type OpenTextAnnotation = {
    type: TypeOpenTextAnnotation,
    id: string,
    name: string,
    targets: Array<DocumentTarget | SpanTarget>,
    minLength: number,
    maxLength?: number,
    optional: boolean,
    useDocumentTextAsDefault: boolean,
    applyAutoCorrectOnTarget?: boolean
}

export type TypeBooleanAnnotation = "BooleanAnnotation";
export type BooleanAnnotation = {
    type: TypeBooleanAnnotation,
    id: string,
    name: string,
    targets: Array<DocumentTarget | SpanTarget>,
    optional: boolean
}

export type TypeOpenNumberAnnotation = "OpenNumberAnnotation";
export type OpenNumberAnnotation = {
    type: TypeOpenNumberAnnotation,
    id: string,
    name: string,
    targets: Array<DocumentTarget | SpanTarget>,
    step?: number,
    optional: boolean
}

export type TypeClosedNumberAnnotation = "ClosedNumberAnnotation";
export type ClosedNumberAnnotation = {
    type: TypeClosedNumberAnnotation,
    id: string,
    name: string,
    targets: Array<DocumentTarget | SpanTarget>,
    min: number,
    max: number,
    step: number,
    optional: boolean
}

export type TypeNumberRangeAnnotation = "NumberRangeAnnotation";
export type NumberRangeAnnotation = {
    type: TypeNumberRangeAnnotation,
    id: string,
    name: string,
    targets: Array<DocumentTarget | SpanTarget>,
    min: number,
    max: number,
    step: number,
    optional: boolean
}

export type Annotations = {
    annotationMap: Map<string, PredefinedTagSetAnnotation | OpenTagAnnotation | OpenTextAnnotation | BooleanAnnotation | ClosedNumberAnnotation | NumberRangeAnnotation | OpenNumberAnnotation>
}