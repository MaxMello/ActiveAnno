// @flow
import type {AnnotationMap, Dictionary, DocumentID, ProjectID} from "../Types";
import type {InteractionLog} from "../document/annotation/InteractionLog";
import type {UsedAnnotateProject} from "../project/UsedAnnotateProject";
import type {Layout} from "../project/layout/Layout";
import type {DocumentSelection} from "../project/ProjectTypes";
import type {HandlingPolicy} from "../manage/AnnotationSchema";

/*
    This file contains all Types of classes defined in the backend package api/annotate/dto
    See there for further documentation
 */

export type ListProject = {|
    id: ProjectID,
    name: string,
    description: string,
    priority: number
|}

export type AnnotateProject = {|
    ...ListProject,
    layout: Layout,
    selection: DocumentSelection,
    allowManualEscalationToCurator: Boolean,
    generatedAnnotationResultHandlingPolicy: HandlingPolicy
|}

export type PostAnnotationResult = {
    documentID: DocumentID,
    projectID: ProjectID,
    documentData: Dictionary<string, any>,
    annotations: AnnotationMap,
    usedProject: UsedAnnotateProject,
    interactionLog: InteractionLog,
    curationRequest?: string
}

export type GetDocumentsForAnnotationParameters = {|
    projectID: ProjectID,
    ignoreDocuments: Array<DocumentID>,
    subFilter: ?Dictionary<string, string>,
    dateRange: ?Array<?number>
|}