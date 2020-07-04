// @flow
/*
    This file contains all types as defined in the backend document/annotation/Annotation.kt
 */

export type Annotation = SpanTargetAnnotation | DocumentTargetAnnotation;

export type DocumentTargetAnnotation = {|
    target: "document",
    values: Array<ValueToProbability>
|}

export type SpanTargetAnnotation = {|
    target: "span",
    annotations: Array<SpanTargetSingleAnnotation>
|}

export type SpanTargetSingleAnnotation = {|
    spans: Array<Span>,
    values: Array<ValueToProbability>
|}

export type Span = {|
    begin: number,
    eng: number,
    text?: string
|}

export type ValueToProbability = {|
    value: any,
    probability?: number
|}