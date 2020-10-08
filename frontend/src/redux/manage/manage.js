// @flow
import type {ManageListProject, ManageProject, ProjectStoreResponse} from "../../types/manage/ManageTypes";
import {createAction, handleActions} from "redux-actions";
import FetchStatus from "../../api/helper/FetchStatus";
import type {Action, Dictionary, ProjectID} from "../../types/Types";
import {normalize, normalizeObject} from "../../helper/Helper";
import {GlobalActionKey} from "../GlobalActions";
import {jwtNetworkRequestSaga} from "../../api/helper/NetworkRequestSaga";
import {buildDeepObject} from "../../components/helper/HelperFunctions";
import {LayoutAreaTypes} from "../../constants/LayoutAreaTypes";
import type {ManageState, NewManageProjectInState} from "../../types/redux/ManageState";
import type {AnalyzeProjectRequest, AnalyzeProjectResponse} from "../../types/manage/AnalyzeProjectResultsTypes";
import {
    generateAnnotationsForProject,
    getManageProject,
    getManageProjectList,
    postAnalyzeProjectRequest,
    postDocumentsForProject,
    postManageProject,
    putManageProject
} from "../../api/ManageRoutes";
import {manageAnnotationDefinitionReducerActions, newAnnotationDefinition} from "./manageAnnotationDefinitions";
import type {GenerateAnnotationsResponse} from "../../types/annotationdefinition/AnnotationGenerator";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const ManageProjectListActionKey = {
    START: "MANAGE_PROJECT_LIST/START",
    RECEIVED: "MANAGE_PROJECT_LIST/RECEIVED",
    ERROR: "MANAGE_PROJECT_LIST/ERROR",
};

export const ManageProjectActionKey = {
    START: "MANAGE_PROJECT/START",
    RECEIVED: "MANAGE_PROJECT/RECEIVED",
    ERROR: "MANAGE_PROJECT/ERROR"
};

export const CreateProjectActionKey = {
    START: "CREATE_PROJECT/START",
    RECEIVED: "CREATE_PROJECT/RECEIVED",
    ERROR: "CREATE_PROJECT/ERROR"
};

export const SaveProjectActionKey = {
    START: "SAVE_PROJECT/START",
    RECEIVED: "SAVE_PROJECT/RECEIVED",
    ERROR: "SAVE_PROJECT/ERROR"
};

export const EditProjectActionKey = {
    UPDATE_PROJECT_VALUE: "EDIT_PROJECT/UPDATE_PROJECT_VALUE"
};

export const UploadDocumentsActionKey = {
    START_UPLOAD: "UPLOAD_DOCUMENTS/START_UPLOAD",
    RECEIVED: "UPLOAD_DOCUMENTS/RECEIVED",
    ERROR: "UPLOAD_DOCUMENTS/ERROR"
}

export const AnalyzeProjectResultsActionKey = {
    UPDATE_REQUEST: "ANALYZE_PROJECT_RESULTS/UPDATE_REQUEST",
    START_REQUEST: "ANALYZE_PROJECT_RESULTS/START_REQUEST",
    RECEIVE_RESPONSE: "ANALYZE_PROJECT_RESULTS/RECEIVE_RESPONSE",
    REQUEST_ERROR: "ANALYZE_PROJECT_RESULTS/REQUEST_ERROR",
};

export const GenerateAnnotationsActionKey = {
    START: "GENERATE_ANNOTATIONS_FOR_PROJECT/START",
    RECEIVED: "GENERATE_ANNOTATIONS_FOR_PROJECT/RECEIVED",
    ERROR: "GENERATE_ANNOTATIONS_FOR_PROJECT/ERROR"
};

export const ManageProjectListActions = {
    start: createAction(ManageProjectListActionKey.START),
    received: createAction(ManageProjectListActionKey.RECEIVED, (projectList) => projectList),
    error: createAction(ManageProjectListActionKey.ERROR),
};

export const ManageProjectActions = {
    start: createAction(ManageProjectActionKey.START, (projectID: ProjectID) => projectID),
    received: createAction(ManageProjectActionKey.RECEIVED, (projects: Array<ManageProject>) => projects),
    error: createAction(ManageProjectActionKey.ERROR)
};

export const CreateProjectActions = {
    start: createAction(CreateProjectActionKey.START, (project: ManageProject) => project),
    received: createAction(CreateProjectActionKey.RECEIVED, (project: ManageProject) => project),
    error: createAction(CreateProjectActionKey.ERROR)
};

export const SaveProjectActions = {
    start: createAction(SaveProjectActionKey.START, (project: ManageProject) => project),
    received: createAction(SaveProjectActionKey.RECEIVED, (project: ManageProject) => project),
    error: createAction(SaveProjectActionKey.ERROR)
};

export const UploadDocumentsActions = {
    start: createAction(UploadDocumentsActionKey.START_UPLOAD, (projectID: ProjectID, json: any) => {
        return { projectID, json }
    }),
    received: createAction(UploadDocumentsActionKey.RECEIVED, (response: { projectID: ProjectID }) => response),
    error: createAction(UploadDocumentsActionKey.ERROR)
}

export const EditProjectActions = {
    updateProjectValue: createAction(EditProjectActionKey.UPDATE_PROJECT_VALUE,
        (projectID: string, keys: Array<string>, value: any) => {
        return {
            projectID, keys, value
        }
    }),
};

export const AnalyzeProjectResultsActions = {
    updateRequest: createAction(AnalyzeProjectResultsActionKey.UPDATE_REQUEST,
        (analyzeProjectRequest: AnalyzeProjectRequest) => analyzeProjectRequest),
    startRequest: createAction(AnalyzeProjectResultsActionKey.START_REQUEST,
        (analyzeProjectRequest: AnalyzeProjectRequest) => analyzeProjectRequest),
    receiveResponse: createAction(AnalyzeProjectResultsActionKey.RECEIVE_RESPONSE,
        (analyzeProjectResponse: AnalyzeProjectResponse) => analyzeProjectResponse),
    error: createAction(AnalyzeProjectResultsActionKey.REQUEST_ERROR)
}

export const GenerateAnnotationsActions = {
    start: createAction(GenerateAnnotationsActionKey.START, (project: ManageProject) => project),
    received: createAction(GenerateAnnotationsActionKey.RECEIVED, (response: GenerateAnnotationsResponse) => response),
    error: createAction(GenerateAnnotationsActionKey.ERROR, (project: ManageProject) => project)
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   V A L U E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const OnOverwrittenFinalizedAnnotationBehavior = {
    DO_NOTHING: "DO_NOTHING",
    TRIGGER_EXPORT_AGAIN: "TRIGGER_EXPORT_AGAIN"
};

export const RestAuthentication: Dictionary<string, {
    type: string
}> = {
    NONE: {
        type: "None"
    },
    HTTP_BASIC_AUTH: {
        type: "HttpBasicAuth",
        username: "",
        password: ""
    },
    JWT_ROLE: {
        type: "JwtRole"
    }
};

export const WebHookAuthentication: Dictionary<string, {
    type: string
}> = {
    NONE: {
        type: "None"
    },
    HTTP_BASIC_AUTH: {
        type: "HttpBasicAuth",
        username: "",
        password: ""
    }
};

export const OnWebHookFailureBehavior = {
    IGNORE: "IGNORE",
    RESEND_ON_NEXT_TRIGGER: "RESEND_ON_NEXT_TRIGGER"
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const newProject: NewManageProjectInState = {
    id: "",
    name: "",
    description: "",
    priority: 0,
    active: false,
    userRoles: {
        annotators: [],
        curators: [],
        managers: []
    },
    inputMapping: {
        documentText: {
            key: ""
        },
        metaData: []
    },
    filter: null,
    sort: {
        sorts: [{
            key: 'storeTimestamp',
            order: 'DESC'
        }]
    },
    selection: {
        subFilter: [],
        dateRangeFilter: null
    },
    annotationSchema: {
        elements: [],
        generatedAnnotationResultHandling: {
            handlingPolicy: {
                type: "Ignore"
            }
        }
    },
    layout: {
        exampleDocument: {
            documentID: "EXAMPLE_DOCUMENT",
            annotations: {},
            documentData: {
                "DOCUMENT_TEXT": ""
            }
        },
        layoutAreas: {
            [LayoutAreaTypes.COMMON]: {
                id: LayoutAreaTypes.COMMON,
                rows: [

                ]
            },
            [LayoutAreaTypes.DOCUMENT_TARGET]: {
                id: LayoutAreaTypes.DOCUMENT_TARGET,
                rows: [

                ]
            }
        }
    },
    policy: {
        numberOfAnnotatorsPerDocument: 1,
        allowManualEscalationToCurator: false,
        finalizeAnnotationPolicy: "MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR"
    },
    export: {
        webHooks: [

        ],
        rest: null,
        onOverwrittenFinalizedAnnotationBehavior: OnOverwrittenFinalizedAnnotationBehavior.DO_NOTHING
    },
    createProjectSpecificIndexes: false,
    fetchStatus: null
};

const initialState: ManageState = {
    projects: {},
    projectAnalysis: {},
    uploadProjectStatus: {},
    listFetchStatus: null,
    projectFetchStatus: null,
    projectAnalysisFetchStatus: null,
    newProject: newProject,
    annotationDefinitions: {},
    annotationDefinitionFetchStatus: null,
    newAnnotationDefinition: newAnnotationDefinition,
    annotationGenerators: {},
    annotationGeneratorsFetchStatus: null
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const manageReducer = handleActions({
    [ManageProjectListActionKey.START]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                listFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [ManageProjectListActionKey.RECEIVED]: (state: ManageState, action: {|
        ...Action,
        payload: Array<ManageListProject>
    |}): Function => {
        return {
            ...state,
            ...{
                projects: {
                    ...normalize(action.payload),  /* here, we merge the payload first as the list request
                        has less data than the full requests */
                    ...state.projects
                },
                listFetchStatus: FetchStatus.SUCCESS
            }
        };
    },
    [ManageProjectListActionKey.ERROR]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                listFetchStatus: FetchStatus.ERROR
            }
        };
    },
    [ManageProjectActionKey.START]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                projectFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [ManageProjectActionKey.RECEIVED]: (state: ManageState, action: {|
        ...Action,
        payload: ManageProject
    |}): Function => {
        return {
            ...state,
            ...{
                projects: {
                    ...state.projects,
                    ...normalizeObject(action.payload)
                },
                projectFetchStatus: FetchStatus.SUCCESS
            }
        };
    },
    [ManageProjectActionKey.ERROR]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                projectFetchStatus: FetchStatus.ERROR
            }
        };
    },
    [EditProjectActionKey.UPDATE_PROJECT_VALUE]: (state: ManageState, action: {|
        ...Action,
        payload: {|
            projectID: string,
            keys: Array<string>,
            value: any
        |}
    |}): Function => {
        return {
            ...state,
            ...(action.payload.projectID ? {
                projects: {
                    ...state.projects,
                    [action.payload.projectID]: {
                        ...buildDeepObject(action.payload.keys, state.projects[action.payload.projectID],
                            action.payload.value, 0),
                        needsSyncing: true
                    }
                }
            } : {
                newProject: buildDeepObject(action.payload.keys, state.newProject, action.payload.value, 0)
            })
        };
    },
    [CreateProjectActionKey.START]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                newProject: {
                    ...state.newProject,
                    ...{
                        fetchStatus: FetchStatus.ACTIVE
                    }
                }
            }
        };
    },
    [CreateProjectActionKey.RECEIVED]: (state: ManageState, action: {|
        ...Action,
        payload: ProjectStoreResponse
    |}): Function => {
        if(action.payload.success && action.payload.projectID != null && action.payload.project != null) {
            return {
                ...state,
                ...{
                    projects: {
                        ...state.projects,
                        [action.payload.projectID]: {
                            ...action.payload.project,
                            ...{
                                fetchStatus: FetchStatus.SUCCESS,
                                projectStoreResponse: {
                                    errors: action.payload.errors,
                                    success: action.payload.success,
                                    message: action.payload.message
                                }
                            }
                        }
                    },
                    newProject: newProject
                }
            };
        } else {
            return {
                ...state,
                ...{
                    newProject: {
                        ...action.payload.project ?? state.newProject,
                        ...{
                            fetchStatus: FetchStatus.ERROR,
                            projectStoreResponse: {
                                errors: action.payload.errors,
                                success: action.payload.success,
                                message: action.payload.message
                            }
                        }
                    }
                }
            };
        }
    },
    [CreateProjectActionKey.ERROR]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                newProject: {
                    ...state.newProject,
                    ...{
                        fetchStatus: FetchStatus.ERROR
                    }
                }
            }
        };
    },
    [SaveProjectActionKey.START]: (state: ManageState, action: {|
        ...Action,
        payload: ManageProject
    |}): Function => {
        return {
            ...state,
            ...{
                projects: {
                    ...state.projects,
                    [action.payload.id]: {
                        ...state.projects[action.payload.id],
                        ...{
                            fetchStatus: FetchStatus.ACTIVE
                        }
                    }
                }
            }
        };
    },
    [SaveProjectActionKey.RECEIVED]: (state: ManageState, action: {
        ...Action,
        payload: ProjectStoreResponse
    }): Function => {
        if(action.payload.success && action.payload.projectID != null && action.payload.project != null) {
            return {
                ...state,
                ...{
                    projects: {
                        ...state.projects,
                        [action.payload.projectID]: {
                            ...action.payload.project,
                            ...{
                                fetchStatus: FetchStatus.SUCCESS,
                                projectStoreResponse: {
                                    errors: action.payload.errors,
                                    success: action.payload.success,
                                    message: action.payload.message
                                }
                            }

                        }
                    },
                }
            };
        } else if(action.payload.projectID != null) {
            return {
                ...state,
                ...{
                    projects: {
                        ...state.projects,
                        fetchStatus: FetchStatus.SUCCESS,
                        [action.payload.projectID]: {
                            ...(action.payload.project ?? state.projects[action.payload.projectID]),
                            ...{
                                projectStoreResponse: {
                                    errors: action.payload.errors,
                                    success: action.payload.success,
                                    message: action.payload.message
                                }
                            }
                        }
                    },
                }
            };
        } else {
            return state;
        }
    },
    [SaveProjectActionKey.ERROR]: (state: ManageState): Function => {
        return state;
    },
    [UploadDocumentsActionKey.START_UPLOAD]: (state: ManageState, action: {|
        ...Action,
        payload: {
            projectID: ProjectID
        }
    |}): Function => {
        return {
            ...state,
            ...{
                uploadProjectStatus: {
                    ...state.uploadProjectStatus,
                    [action.payload.projectID]: FetchStatus.ACTIVE
                }
            }
        }
    },
    [UploadDocumentsActionKey.RECEIVED]: (state: ManageState, action: {|
        ...Action,
        payload: {
            projectID: ProjectID
        }
    |}): Function => {
        return {
            ...state,
            ...{
                uploadProjectStatus: {
                    ...state.uploadProjectStatus,
                    [action.payload.projectID]: FetchStatus.SUCCESS
                }
            }
        }
    },
    [UploadDocumentsActionKey.ERROR]: (state: ManageState): Function => {
        const allUploadStatus = Object.entries(state.uploadProjectStatus);
        const newState = {
            ...state
        }
        for(let [projectID, fetchStatus] of allUploadStatus) {
            if(fetchStatus === FetchStatus.ACTIVE) {
                newState.uploadProjectStatus[projectID] = FetchStatus.ERROR
            }
        }
        return newState;
    },
    [AnalyzeProjectResultsActionKey.UPDATE_REQUEST]: (state: ManageState, action: {|
        ...Action,
        payload: AnalyzeProjectRequest
    |}): Function => {
        return {
            ...state,
            ...{
                projectAnalysis: {
                    ...state.projectAnalysis,
                    [action.payload.projectID]: {
                        ...state.projectAnalysis[action.payload.projectID],
                        analyzeProjectRequest: action.payload,
                    }
                },
            }
        }
    },
    [AnalyzeProjectResultsActionKey.START_REQUEST]: (state: ManageState, action: {|
        ...Action,
        payload: AnalyzeProjectRequest
    |}): Function => {
        return {
            ...state,
            projectAnalysisFetchStatus: FetchStatus.ACTIVE
        }
    },
    [AnalyzeProjectResultsActionKey.RECEIVE_RESPONSE]: (state: ManageState, action: {|
        ...Action,
        payload: AnalyzeProjectResponse
    |}): Function => {
        return {
            ...state,
            projectAnalysisFetchStatus: FetchStatus.SUCCESS,
            ...{
                projectAnalysis: {
                    ...state.projectAnalysis,
                    [action.payload.projectID]: {
                        ...state.projectAnalysis[action.payload.projectID],
                        analyzeProjectResponse: action.payload,
                    }
                },
            }
        }
    },
    [AnalyzeProjectResultsActionKey.REQUEST_ERROR]: (state: ManageState): Function => {
        return {
            ...state,
            projectAnalysisFetchStatus: FetchStatus.ERROR
        }
    },
    [GenerateAnnotationsActionKey.START]: (state: ManageState, action: {|
        ...Action,
        payload: ManageProject
            |}): Function => {
        return {
            ...state,
            ...{
                projects: {
                    ...state.projects,
                    [action.payload.id]: {
                        ...state.projects[action.payload.id],
                        ...{
                            generateAnnotationsFetchStatus: FetchStatus.ACTIVE
                        }
                    }
                }
            }
        };
    },
    [GenerateAnnotationsActionKey.RECEIVED]: (state: ManageState, action: {
        ...Action,
        payload: GenerateAnnotationsResponse
    }): Function => {
        return {
            ...state,
            ...{
                projects: {
                    ...state.projects,
                    [action.payload.projectID]: {
                        ...state.projects[action.payload.projectID],
                        ...{
                            generateAnnotationsFetchStatus: FetchStatus.SUCCESS,
                            numberUpdatedDocuments: action.payload.numberUpdatedDocuments
                        }
                    }
                }
            }
        };
    },
    [GenerateAnnotationsActionKey.ERROR]: (state: ManageState, action: {
        ...Action,
        payload: ManageProject
    }): Function => {
        return {
            ...state,
            ...{
                projects: {
                    ...state.projects,
                    [action.payload.id]: {
                        ...state.projects[action.payload.id],
                        ...{
                            generateAnnotationsFetchStatus: FetchStatus.ERROR
                        }
                    }
                }
            }
        };
    },
    [GlobalActionKey.LOGOUT]: (): Function => {
        return {
            ...initialState
        };
    },
    ...manageAnnotationDefinitionReducerActions
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onLoadManageProjectList: Function = function*() {
    yield jwtNetworkRequestSaga(ManageProjectListActionKey.START, getManageProjectList,
        ManageProjectListActions.received, ManageProjectListActions.error);
};

export const onLoadManageProject: Function = function*() {
    yield jwtNetworkRequestSaga(ManageProjectActionKey.START, getManageProject,
        ManageProjectActions.received, ManageProjectActions.error);
};

export const onCreateProject: Function = function*() {
    yield jwtNetworkRequestSaga(CreateProjectActionKey.START, postManageProject,
        CreateProjectActions.received, CreateProjectActions.error);
};

export const onSaveProject: Function = function*() {
    yield jwtNetworkRequestSaga(SaveProjectActionKey.START, putManageProject,
        SaveProjectActions.received, SaveProjectActions.error);
};

export const onRequestProjectResultAnalysis: Function = function*() {
    yield jwtNetworkRequestSaga(AnalyzeProjectResultsActionKey.START_REQUEST, postAnalyzeProjectRequest,
        AnalyzeProjectResultsActions.receiveResponse, AnalyzeProjectResultsActions.error);
};

export const uploadDocumentsForProject: Function = function*() {
    yield jwtNetworkRequestSaga(UploadDocumentsActionKey.START_UPLOAD, postDocumentsForProject,
        UploadDocumentsActions.received, UploadDocumentsActions.error);
};

export const onGenerateAnnotations: Function = function*() {
    yield jwtNetworkRequestSaga(GenerateAnnotationsActionKey.START, generateAnnotationsForProject,
        GenerateAnnotationsActions.received, GenerateAnnotationsActions.error);
};
