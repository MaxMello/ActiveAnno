// @flow
export type OriginalDocumentKey = {|
    type: "OriginalDocumentKey",
    key: string
|}

export type AnnotationsKey = {|
    type: "AnnotationsKey",
    key: string
|}

export type AnnotationStepKey = OriginalDocumentKey | AnnotationsKey;