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
    annotationDefinitionFetchStatus: ?number
|}

export type ManageProjectInState = {|
    ...ManageProject,
    fetchStatus: ?number,
    projectStoreResponse?: ProjectStoreResponseInState
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