import type {annotationID, configurationID, Dictionary, documentID} from "./Types";
import type {Annotations} from "./AnnotationConfigTypes";
import type {Layout} from "./LayoutConfigTypes";

export type AnnotationConfigMinimal = {
    id: string,
    name: string,
    description: string,
    priority: number
}

export type AnnotationConfigFull = {
    id: string,
    name: string,
    description: string,
    priority: number,
    annotations: Annotations,
    layout: Layout
}


export type AnnotationDocument = {
    id: string,
    configurationID: string,
    documentData: Dictionary<string, any>
}

export type Span = {
    begin: number,
    eng: number,
    text: string
}

export type SpanAnnotation = {
    spans: Array<Span>,
    value: any,
}

export type DocumentAnnotation = {
    value: any
}

export type AnnotationConfigState = {
    configs: AnnotationConfigMinimal | AnnotationConfigFull,
    listFetchStatus: number,
    configFetchStatus: number,
    activeConfigID: string
}

export type DocumentToAnnotate = {
    id: string,
    configurationID: string,
    documentData: Dictionary<string, any>,
    documentAnnotations: Dictionary<annotationID, DocumentAnnotation>,
    spanAnnotations: Dictionary<annotationID, SpanAnnotation>,
    finished: boolean,
    validationErrors: Dictionary<annotationID, string>
}

export type AnnotationDataState = {
    documents: Dictionary<configurationID, Dictionary<documentID, DocumentToAnnotate>>,
    fetchStatus: number,
    activeDocumentID: string,
    currentTarget: string,
    autoValidate: boolean
}