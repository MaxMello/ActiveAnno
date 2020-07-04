// @flow
import type {AnnotationID} from "../Types";

type BaseAnnotationDefinition = {
    id: AnnotationID,
    name: string,
    shortName: ?string,
    createdTimestamp?: number
}

export type BooleanAnnotationDefinition = {
    ...BaseAnnotationDefinition,
    type: "BooleanAnnotationDefinition",
    optional: boolean
}

export type ClosedNumberAnnotationDefinition = {
    ...BaseAnnotationDefinition,
    type: "ClosedNumberAnnotationDefinition",
    min: number,
    max: number,
    step: number,
    optional: boolean
}

export type HierarchicalTagSetAnnotationDefinition = {
    ...BaseAnnotationDefinition,
    type: "HierarchicalTagSetAnnotationDefinition",
    minNumberOfTags: number,
    maxNumberOfTags: ?number,
    requireDeepestLevel: boolean,
    options: Array<HierarchicalTagSetOption>
}

export type HierarchicalTagSetOption = {
    id: string,
    name: string,
    shortName: ?string,
    children?: Array<HierarchicalTagSetOption>
}

export type NumberRangeAnnotationDefinition = {
    ...BaseAnnotationDefinition,
    type: "NumberRangeAnnotationDefinition",
    min: number,
    max: number,
    step: number,
    optional: boolean
}

export type OpenNumberAnnotationDefinition = {
    ...BaseAnnotationDefinition,
    type: "OpenNumberAnnotationDefinition",
    step: ?number,
    optional: boolean
}

export type OpenTagAnnotationDefinition = {
    ...BaseAnnotationDefinition,
    type: "OpenTagAnnotationDefinition",
    minNumberOfTags: number,
    maxNumberOfTags?: number,
    trimWhitespace: boolean,
    caseBehavior: CaseBehavior,
    useExistingValuesAsPredefinedTags: boolean,
    predefinedTags: Array<string>
}

export type CaseBehavior = 'KEEP_ORIGINAL' | 'TO_LOWER' | 'TO_UPPER' | 'CAPITALIZE';

export type OpenTextAnnotationDefinition = {
    ...BaseAnnotationDefinition,
    type: "OpenTextAnnotationDefinition",
    minLength: number,
    maxLength: ?number,
    documentDataDefault?: string,
    optional: boolean
}

export type TagSetAnnotationDefinition = {
    ...BaseAnnotationDefinition,
    type: "TagSetAnnotationDefinition",
    minNumberOfTags: number,
    maxNumberOfTags: ?number,
    options: Array<TagSetOption>
}

export type TagSetOption = {
    id: string,
    name: string,
    shortName: ?string
}

export type AnnotationDefinition = BooleanAnnotationDefinition | ClosedNumberAnnotationDefinition |
    HierarchicalTagSetAnnotationDefinition | NumberRangeAnnotationDefinition | OpenNumberAnnotationDefinition |
    OpenTagAnnotationDefinition | OpenTextAnnotationDefinition | TagSetAnnotationDefinition;

export type AnnotationDefinitionInStore = {
    ...AnnotationDefinition,
    changed?: boolean,
    fetchStatus?: ?number
}