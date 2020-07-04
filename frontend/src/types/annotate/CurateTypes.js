// @flow
import type {AnnotationMap, Dictionary, DocumentID, ProjectID,} from "../Types";
import type {InteractionLog} from "../document/annotation/InteractionLog";
import type {UsedAnnotateProject} from "../project/UsedAnnotateProject";
import type {AnnotationResultCreator} from "../document/annotation/AnnotationResultCreator";
import type {AnnotationEnableConditionResult} from "../redux/annotate/AnnotationDataState";

export type AcceptAnnotationResult = {|
    projectID: ProjectID,
    documentID: DocumentID,
    acceptedAnnotationResultID: string
|}

export type CurationDocument = {|
    documentID: DocumentID,
    projectID: ProjectID,
    documentData: Dictionary<string, any>,
    annotationResults: Array<AnnotationResultDTO>,
    annotationConditions: Array<AnnotationEnableConditionResult>
|}

export type AnnotationResultDTO = {|
    id: string,
    documentID: DocumentID,
    projectID: ProjectID,
    timestamp: number,
    annotations: AnnotationMap,
    creator: AnnotationResultCreator,
    interactionLog: ?InteractionLog,
    documentData: Dictionary<string, any>,
    usedProject: UsedAnnotateProject
|}