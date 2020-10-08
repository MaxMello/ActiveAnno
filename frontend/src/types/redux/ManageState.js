// @flow
import type {AnnotationID, Dictionary, ProjectID} from "../Types";
import type {
    ManageListProject,
    ManageProject,
    NewManageProject,
    ProjectStoreResponseInState
} from "../manage/ManageTypes";
import type {AnalyzeProjectRequest, AnalyzeProjectResponse} from "../manage/AnalyzeProjectResultsTypes";
import type {AnnotationDefinitionInStore} from "../annotationdefinition/AnnotationDefinition";
import type {AnnotationGeneratorInStore} from "../annotationdefinition/AnnotationGenerator";

export type ManageState = {|
    projects: Dictionary<ProjectID, ManageListProject | ManageProjectInState>,
    projectAnalysis: Dictionary<ProjectID, AnalyzeProjectResults>,
    uploadProjectStatus: Dictionary<ProjectID, ?number>,
    listFetchStatus: ?number,
    projectFetchStatus: ?number,
    projectAnalysisFetchStatus: ?number,
    newProject: NewManageProjectInState,
    annotationDefinitions: Dictionary<AnnotationID, AnnotationDefinitionInStore>,
    newAnnotationDefinition: AnnotationDefinitionInStore,
    annotationDefinitionFetchStatus: ?number,
    annotationGenerators: Dictionary<string, AnnotationGeneratorInStore>,
    annotationGeneratorsFetchStatus: ?number
|}

export type ManageProjectInState = {|
    ...ManageProject,
    fetchStatus: ?number,
    generateAnnotationsFetchStatus?: number,
    projectStoreResponse?: ProjectStoreResponseInState,
    numberUpdatedDocuments?: number
|}

export type NewManageProjectInState = {|
    ...NewManageProject,
    fetchStatus: ?number,
    projectStoreResponse?: ProjectStoreResponseInState
|}

export type AnalyzeProjectResults = {|
    analyzeProjectRequest: ?AnalyzeProjectRequest,
    analyzeProjectResponse: ?AnalyzeProjectResponse
|};