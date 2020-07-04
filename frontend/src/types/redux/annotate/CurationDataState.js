// @flow
import type {AnnotationMap, Dictionary, DocumentID, ProjectID} from "../../Types";
import type {CurationDocument} from "../../annotate/CurateTypes";
import type {InteractionLog} from "../../document/annotation/InteractionLog";
import type {ValidationError} from "../../annotate/ValidationError";

export type CurationDataState = {|
    documents: Dictionary<ProjectID, Dictionary<DocumentID, CurationDocumentInState>>,
    documentOrder: Dictionary<ProjectID, Array<DocumentID>>,
    fetchStatus: ?number,
    activeDocumentID: string
|}

export type CurationDocumentInState = {|
    ...CurationDocument,
    annotations: AnnotationMap,
    isSending: ?boolean,
    skipped: boolean,
    validationErrors?: Array<ValidationError>,
    interactionLog?: InteractionLog
|}