// @flow

import type {AnnotationID, ProjectID} from "../Types";
import type {TargetType, TypeDocumentTarget} from "./target/Target";

type BaseAnnotationGenerator = {
    id: string,
    annotationDefinitionID: AnnotationID,
    targetType: TargetType,
    name: string,
    description: string,
    createdTimestamp?: number
}

export type UpdatableAnnotationGenerator = {
    ...BaseAnnotationGenerator,
    startThreshold: number,
    updateThreshold: number,
    versions: Array<UpdatableAnnotationGeneratorVersion>
}

export type UpdatableAnnotationGeneratorVersion = {
    createdTimestamp: number,
    updateState: "NOT_UPDATED" | "UPDATING" | "UPDATED",
    updateResponse?: UpdateResponse
}

export type UpdateResponse = {
    score: ?number,
    numberOfExamples: number,
    version: number,
    timestamp: number
}

export type TagSetDocumentTargetUpdatableGeneratorModel = {
    ...UpdatableAnnotationGenerator,
    type: "TagSetDocumentTargetUpdatableGeneratorModel",
    predictUrl: string,
    updateUrl: string,
    targetType: TypeDocumentTarget
}

export type TagSetDocumentTargetGeneratorModel = {
    ...BaseAnnotationGenerator,
    type: "TagSetDocumentTargetPredictionModel",
    predictUrl: string,
    targetType: TypeDocumentTarget
}

export type AnnotationGenerator = TagSetDocumentTargetUpdatableGeneratorModel | TagSetDocumentTargetGeneratorModel;

export type AnnotationGeneratorInStore = {
    ...AnnotationGenerator,
    fetchStatus?: ?number,
    updateFetchStatus?: ?number
}


export type GenerateAnnotationsResponse = {
    projectID: ProjectID,
    numberUpdatedDocuments: number
}