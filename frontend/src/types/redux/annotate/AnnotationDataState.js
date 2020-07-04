// @flow
import type {Action, AnnotationID, AnnotationMap, Dictionary, DocumentID, ProjectID} from "../../Types";
import type {AnnotationDocument} from "../../annotate/AnnotateTypes";
import type {Annotation} from "../../document/annotation/Annotation";
import type {InteractionLog} from "../../document/annotation/InteractionLog";
import type {ValidationError} from "../../annotate/ValidationError";
import type {UsedAnnotateProject} from "../../project/UsedAnnotateProject";
import type {TargetType} from "../../annotationdefinition/target/Target";


export type AnnotationDataState = {|
    documents: Dictionary<ProjectID, Dictionary<DocumentID, AnnotationDocumentInState>>,
    documentOrder: Dictionary<ProjectID, Array<DocumentID>>,
    fetchStatus: ?number,
    activeDocumentID: DocumentID
|}

/**
 * AnnotationDocumentInState with additional properties needed in the frontend
 */
export type AnnotationDocumentInState = {|
    ...AnnotationDocument,
    validationErrors?: Array<ValidationError>,
    interactionLog?: InteractionLog,
    isSending: ?boolean,
    skipped: boolean
|}

export type AnnotationDocumentsReceivedAction = {|
    ...Action,
    payload: Array<AnnotationDocument>
|};

export type SetAnnotationValueAction = {|
    ...Action,
    payload: {
        projectID: ProjectID,
        documentID: DocumentID,
        annotationID: AnnotationID,
        annotation: Annotation
    }
|};

export type CheckEnableConditionRequest = {|
    documentID: DocumentID,
    usedProject: UsedAnnotateProject,
    annotations: AnnotationMap
|};

export type AnnotationEnableConditionResult = {|
    annotationID: AnnotationID,
    targetType: TargetType,
    required: boolean
|};

export type CheckEnableConditionResponse = {|
    documentID: DocumentID,
    projectID: ProjectID,
    annotationConditions: Array<AnnotationEnableConditionResult>
|};