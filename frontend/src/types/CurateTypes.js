import type {
    annotationID,
    configurationID,
    Dictionary, documentID,
} from "./Types";
import type {AnnotationConfigFull, AnnotationConfigMinimal, SpanAnnotation} from "./AnnotationTypes";

export type CurationConfigState = {
    configs: Dictionary<string, AnnotationConfigMinimal | AnnotationConfigFull>,
    listFetchStatus: number,
    configFetchStatus: number,
    activeConfigID: string
}

export type CurationRequest = {
    message: string
}

export type CurationDocument = {
    id: string,
    configurationID: string,
    documentData: Dictionary<string, any>,
    annotations: Array<AnnotationResult>
}

export type PostCurationResult = {
    configurationID: string,
    documentID: string,
    acceptedAnnotationResultID: string,
    annotatedDocument: AnnotationResult
}

export type AnnotationResult = {
    id: string,
    documentID: string,
    configurationID: string,
    annotator: string,
    documentData: Dictionary<string, any>,
    documentAnnotations: Dictionary<annotationID, any>,
    spanAnnotations: Dictionary<annotationID, SpanAnnotation>,
    usedConfig: AnnotationConfigFull,
    curationRequest?: CurationRequest
}

export type DocumentToCurate = {
    documentID: string,
    configurationID: string,
    documentData: Dictionary<string, any>,
    annotations: Array<AnnotationResult>,
    documentAnnotations: Dictionary<annotationID, any>,
    spanAnnotations: Dictionary<annotationID, SpanAnnotation>,
    finished: boolean,
    validationErrors: Dictionary<annotationID, string>,
}

export type CurationDataState = {
    documents: Dictionary<configurationID, Dictionary<documentID, DocumentToCurate>>,
    fetchStatus: number,
    activeDocumentID: string,
    currentTarget: string,
    autoValidate: boolean
}