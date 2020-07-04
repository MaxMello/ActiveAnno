// @flow
import type {Annotation} from "./document/annotation/Annotation";

/******************************************************************
 * General purpose
 ******************************************************************/

export type Dictionary<A, B> = {
    [A]: B
};

export type AnyObject = {
   [key: string]: any
}

/******************************************************************
 * Type aliases
 ******************************************************************/

export type ProjectID = string;
export type DocumentID = string;
export type AnnotationID = string;
export type UserIdentifier = string;
export type AnnotationMap = Dictionary<AnnotationID, Annotation>;

/******************************************************************
 * Redux
 ******************************************************************/

export type Action = {|
    +type: string,
|}

export type ActionWithPayload = {|
    ...Action,
    payload: any
|}

/******************************************************************
 * API usage
 ******************************************************************/

export type HttpError = {|
    statusCode: number,
    statusText: string
|}

/******************************************************************
 * React component props
 ******************************************************************/

export type WithStylesComponentProps = {
    classes: any 
}

export type WithRouterComponentProps = {
    history: ReactRouterHistory,
    location: ReactRouterHistoryLocation,
    match: Function
}

export type WithLocalizationComponentProps = {
    localize: Function
}

export type ReactRouterHistory = {
    action: string,
    length: number,
    location: ReactRouterHistoryLocation,
    block: Function,
    createHref: Function,
    go: Function,
    goBack: Function,
    goForward: Function,
    listen: Function,
    push: Function,
    replace: Function
}

export type ReactRouterHistoryLocation = {
    pathname: string,
    search: string,
    hash: string
}