// @flow
import type {AnnotationStepKey} from "./AnnotationStepKey";

type AtomicEnableCondition = {|
    referenceKey: AnnotationStepKey
|}

export type ValuesIntersect = {|
    ...AtomicEnableCondition,
    type: "ValuesIntersect",
    comparisonValues: Array<string>
|}

export type ValuesEqual = {|
    ...AtomicEnableCondition,
    type: "ValuesEqual",
    comparisonValues: Array<string>
|}

export type And = {|
    type: "And",
    children: Array<EnableCondition>
|}

export type Or = {|
    type: "Or",
    children: Array<EnableCondition>
|}

export type Not = {|
    type: "Not",
    child: EnableCondition
|}

export type EnableCondition = ValuesIntersect | ValuesEqual | And | Or | Not;