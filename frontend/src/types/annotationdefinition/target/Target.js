// @flow
export type TypeDocumentTarget = 'DocumentTarget';
export type TypeSpanTarget = 'SpanTarget';

export type TargetType = TypeDocumentTarget | TypeSpanTarget;

export type DocumentTarget = {|
    type: TypeDocumentTarget
|};

export type SpanTarget = {|
    type: TypeSpanTarget,
    granularity: SpanGranularity,
    multiToken: boolean,
    trimWhitespace: boolean,
    trimPunctuation: boolean,
    allowStacking: boolean,
    minNumberOfSpans?: number,
    maxNumberOfSpans?: number
|}

export type SpanGranularity = 'CHARACTER' | 'TOKEN';


export type Target = DocumentTarget | SpanTarget;