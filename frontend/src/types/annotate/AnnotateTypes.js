// @flow
import type {AnnotationMap, Dictionary, DocumentID, ProjectID} from "../Types";
import type {ValidationError} from "./ValidationError";
import type {AnnotationEnableConditionResult} from "../redux/annotate/AnnotationDataState";

/**
 * AnnotationDocument as received from backend
 */
export type AnnotationDocument = {|
    documentID: DocumentID,
    projectID: ProjectID,
    documentData: Dictionary<string, any>,
    annotations: AnnotationMap,
    annotationConditions: Array<AnnotationEnableConditionResult>
|}

export type AnnotationResultStoreResponse = {|
    projectID: ProjectID,
    documentID: DocumentID,
    success: Boolean,
    validationErrors: Array<ValidationError>
|}