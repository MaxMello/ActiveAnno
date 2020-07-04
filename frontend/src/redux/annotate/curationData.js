// @flow
import {createAction, handleActions} from 'redux-actions';
import type {Action, AnnotationID, Dictionary, DocumentID, ProjectID,} from '../../types/Types';
import FetchStatus from "../../api/helper/FetchStatus";
import {jwtNetworkRequestSaga} from "../../api/helper/NetworkRequestSaga";
import {GlobalActionKey} from "../GlobalActions";
import type {AcceptAnnotationResult, AnnotationResultDTO, CurationDocument} from "../../types/annotate/CurateTypes";
import type {CurationDataState, CurationDocumentInState} from "../../types/redux/annotate/CurationDataState";
import type {Annotation} from "../../types/document/annotation/Annotation";
import {
    getDataForCurateProject,
    postAcceptedAnnotationResult,
    postAnnotationResultAsCurator
} from "../../api/CurateRoutes";
import type {AnnotationResultStoreResponse} from "../../types/annotate/AnnotateTypes";
import {CurationProjectActionKey} from "./curationProject";
import {
    deleteDocumentsForProject,
    mapDataToState,
    receiveAnnotationResultStored,
    resetActiveDocument,
    resetAnnotations,
    setAnnotationValue,
    setDocumentActive,
    skipDocument,
    startAnnotationResultStore,
    updateEnableConditions
} from "./sharedDataBehavior";
import type {UsedAnnotateProject} from "../../types/project/UsedAnnotateProject";
import type {AnnotateProject, PostAnnotationResult} from "../../types/annotate/DTOTypes";
import type {
    CheckEnableConditionRequest,
    CheckEnableConditionResponse,
    SetAnnotationValueAction
} from "../../types/redux/annotate/AnnotationDataState";
import {postCheckEnableConditions} from "../../api/AnnotateRoutes";
import type {AppState} from "../../types/redux/AppState";
import {select, takeLatest} from "redux-saga/effects";
import {put} from "@redux-saga/core/effects";
import type {CurationProjectState} from "../../types/redux/CurationConfigState";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const RequestCurationDataKey = {
    START: "CURATION_DATA/START",
    RECEIVED: "CURATION_DATA/RECEIVED",
    ERROR: "CURATION_DATA/ERROR",
};

const CurationDataActionKey = {
    // Same as annotate
    SET_ACTIVE: "CURATION_DATA/SET_ACTIVE",
    DELETE_DOCUMENTS_FOR_PROJECT: "CURATION_DATA/DELETE_DOCUMENTS_FOR_PROJECT",
    RESET_ANNOTATIONS: "CURATION_DATA/RESET_ANNOTATIONS",
    SKIP_DOCUMENT: "CURATION_DATA/SKIP_DOCUMENT",
    SET_VALUE: "CURATION_DATA_DOCUMENT/SET_VALUE",
    // Curate specific
    COPY_EXISTING_ANNOTATION: "CURATION_DATA/COPY_EXISTING_ANNOTATION"
};

const CheckEnableConditionActionKey = {
    START: "CURATE_ENABLE_CONDITION/START",
    RECEIVED: "CURATE_ENABLE_CONDITION/RECEIVED",
    ERROR: "CURATE_ENABLE_CONDITION/ERROR",
};

export const StoreCurationDataKey = {
    START: "CURATION_STORE/START",
    RECEIVED: "CURATION_STORE/RECEIVED",
    ERROR: "CURATION_STORE/ERROR",
};

export const AcceptAnnotationResultKey = {
    START: "ACCEPT_EXISTING_ANNOTATION/START",
    RECEIVED: "ACCEPT_EXISTING_ANNOTATION/RECEIVED",
    ERROR: "ACCEPT_EXISTING_ANNOTATION/ERROR",
};

export const RequestCurationDataActions = {
    start: createAction(RequestCurationDataKey.START, (projectID: ProjectID,
                                                       ignoreDocuments: Array<DocumentID>,
                                                       subFilter: Dictionary<string, string>,
                                                       dateRange: Array<number>) => {
        return {projectID, ignoreDocuments, subFilter, dateRange}
    }),
    received: createAction(RequestCurationDataKey.RECEIVED, (data: Array<CurationDocument>) => data),
    error: createAction(RequestCurationDataKey.ERROR),
};

export const CurationDataActions = {
    setActive: createAction(CurationDataActionKey.SET_ACTIVE, (projectID: string,
                                                                documentID: string) => {
        return {projectID, documentID};
    }),
    setAnnotationValue: createAction(CurationDataActionKey.SET_VALUE,
        (projectID: ProjectID, documentID: DocumentID, annotationID:
            AnnotationID, annotation: Annotation) => {
            return {projectID, documentID, annotationID, annotation};
        }),
    copyExistingAnnotation: createAction(CurationDataActionKey.COPY_EXISTING_ANNOTATION,
        (annotatedDocument: AnnotationResultDTO) => {
        return annotatedDocument
    }),
    removeDocumentsFromStoreForProject: createAction(CurationDataActionKey.DELETE_DOCUMENTS_FOR_PROJECT,
        (projectID: ProjectID) => {
        return {projectID}
    }),
    resetAnnotations: createAction(CurationDataActionKey.RESET_ANNOTATIONS,
        (projectID: ProjectID, documentID: DocumentID) => {
            return {projectID, documentID}
    }),
    skipDocument: createAction(CurationDataActionKey.SKIP_DOCUMENT,
        (projectID: ProjectID, documentID: DocumentID) => {
            return {projectID, documentID}
    }),
};

const CheckEnableConditionActions = {
    start: createAction(CheckEnableConditionActionKey.START,
        (annotationDocument: CurationDocumentInState, usedProject: UsedAnnotateProject):
        CheckEnableConditionRequest => {
            return {
                usedProject: usedProject,
                annotations: annotationDocument.annotations,
                documentID: annotationDocument.documentID
            }
        }),
    received: createAction(CheckEnableConditionActionKey.RECEIVED,
        (response: CheckEnableConditionResponse) => response),
    error: createAction(CheckEnableConditionActionKey.ERROR),
};

export const StoreCurationDataActions = {
    start: createAction(StoreCurationDataKey.START,
        (curationDocument: CurationDocumentInState, usedProject: UsedAnnotateProject):
        PostAnnotationResult => {
        return {
                documentID: curationDocument.documentID,
                projectID: curationDocument.projectID,
                documentData: curationDocument.documentData,
                annotations: curationDocument.annotations,
                interactionLog: {
                    firstShownTimestamp: ((curationDocument.interactionLog?.firstShownTimestamp ?? null): any),
                    firstInteractionTimestamp: curationDocument.interactionLog?.firstInteractionTimestamp ?? Date.now(),
                    lastInteractionTimestamp: Date.now()
                },
                usedProject: usedProject
        }
    }),
    received: createAction(StoreCurationDataKey.RECEIVED,
        (storeResponse: AnnotationResultStoreResponse) => storeResponse),
    error: createAction(StoreCurationDataKey.ERROR),
};

export const AcceptAnnotationResultActions = {
    start: createAction(AcceptAnnotationResultKey.START,
        (projectID: ProjectID, documentID: DocumentID, annotationResultID: string):
        AcceptAnnotationResult => {
            return {
                documentID: documentID,
                projectID: projectID,
                acceptedAnnotationResultID: annotationResultID
            }
        }),
    received: createAction(AcceptAnnotationResultKey.RECEIVED,
        (storeResponse: AnnotationResultStoreResponse) => storeResponse),
    error: createAction(AcceptAnnotationResultKey.ERROR),
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: CurationDataState = {
    documents: {},
    documentOrder: {},
    fetchStatus: null,
    activeDocumentID: ""
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const curationDataReducer = handleActions({
    [RequestCurationDataKey.START]: (state: CurationDataState): Function => {
        return {
            ...state,
            ...{
                fetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [RequestCurationDataKey.RECEIVED]: (state: CurationDataState, action: {|
        ...Action,
        payload: Array<CurationDocument>
    |}): Function => {
        return {
            ...state,
            ...mapDataToState(state, action.payload),
            fetchStatus: action.payload.length > 0 ? FetchStatus.SUCCESS : FetchStatus.ERROR
        };
    },
    [RequestCurationDataKey.ERROR]: (state: CurationDataState): Function => {
        return {
            ...state,
            ...{
                fetchStatus: FetchStatus.ERROR
            }
        };
    },
    [GlobalActionKey.LOGOUT]: (): Function => {
        return {
            ...initialState
        };
    },
    [CurationProjectActionKey.SET_ACTIVE]: resetActiveDocument,
    [CurationDataActionKey.SET_ACTIVE]: setDocumentActive,
    [CurationDataActionKey.SET_VALUE]: setAnnotationValue,
    [CurationDataActionKey.DELETE_DOCUMENTS_FOR_PROJECT]: deleteDocumentsForProject,
    [CurationDataActionKey.RESET_ANNOTATIONS]: resetAnnotations,
    [CurationDataActionKey.SKIP_DOCUMENT]: skipDocument,
    [AcceptAnnotationResultKey.START]: (state: CurationDataState, action: {|
        ...Action,
        payload: AcceptAnnotationResult
    |}) => {
        return {
            ...state,
            documents: {
                ...state.documents,
                [action.payload.projectID]: {
                    ...state.documents[action.payload.projectID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.projectID][action.payload.documentID],
                        isSending: true
                    },
                },
            }
        }
    },
    [CurationDataActionKey.COPY_EXISTING_ANNOTATION]: (state: CurationDataState, action: {
        ...Action,
        payload: AnnotationResultDTO
    }) => {
        return {
            ...state,
            documents: {
                ...state.documents,
                [action.payload.projectID]: {
                    ...state.documents[action.payload.projectID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.projectID][action.payload.documentID],
                        annotations: action.payload.annotations
                    },
                },
            }
        }
    },
    [StoreCurationDataKey.START]: startAnnotationResultStore,
    [StoreCurationDataKey.RECEIVED]: receiveAnnotationResultStored,
    [StoreCurationDataKey.ERROR]: (state: CurationDataState): Function => {
        console.log("Error storing annotationResult for curator");
        const allDocumentEntries = Object.entries(state.documents);
        const newState = {
            ...state
        }
        for(let [projectID, documentDict] of allDocumentEntries) {
            for(let documentID of Object.keys((documentDict: any))) {
                newState[projectID][documentID].isSending = false
            }
        }
        return newState;
    },
    [AcceptAnnotationResultKey.RECEIVED]: receiveAnnotationResultStored,
    [AcceptAnnotationResultKey.ERROR]: (state: CurationDataState): Function => {
        return state;
    },
    [CheckEnableConditionActionKey.RECEIVED]: updateEnableConditions,
    [CheckEnableConditionActionKey.ERROR]: (state: CurationDataState): Function => {
        return state;
    },
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onLoadCurationData: Function = function* () {
    yield jwtNetworkRequestSaga(RequestCurationDataKey.START, getDataForCurateProject,
        RequestCurationDataActions.received, RequestCurationDataActions.error);
};

export const sendAnnotationResultAsCurator: Function = function* () {
    yield jwtNetworkRequestSaga(StoreCurationDataKey.START, postAnnotationResultAsCurator,
        StoreCurationDataActions.received, StoreCurationDataActions.error);
};

export const sendAcceptedAnnotationResult: Function = function* () {
    yield jwtNetworkRequestSaga(AcceptAnnotationResultKey.START, postAcceptedAnnotationResult,
        AcceptAnnotationResultActions.received, AcceptAnnotationResultActions.error);
};


export const curateCheckEnableConditions: Function = function* () {
    yield jwtNetworkRequestSaga(CheckEnableConditionActionKey.START, postCheckEnableConditions,
        CheckEnableConditionActions.received, CheckEnableConditionActions.error);
};

const getCurationProject = (state: AppState): CurationProjectState => {
    return state.curationProject;
};
const getCurationData = (state: AppState): CurationDataState => {
    return state.curationData;
};

export const curateOnValueCheckCheckEnableCondition: Function = function* () {
    try {
        yield takeLatest([CurationDataActionKey.SET_VALUE,
                CurationDataActionKey.COPY_EXISTING_ANNOTATION,
                CurationDataActionKey.RESET_ANNOTATIONS], function* (action: SetAnnotationValueAction) {
            const projectState = yield select(getCurationProject);
            const dataState = yield select(getCurationData);
            const activeProjectID = action.payload.projectID;
            const activeDocumentID = action.payload.documentID;
            const activeProject: AnnotateProject = projectState.projects[activeProjectID];
            const annotationDocument: CurationDocumentInState =
                dataState.documents[activeProjectID][activeDocumentID];
            yield put(CheckEnableConditionActions.start(annotationDocument, {
                id: activeProject.id,
                name: activeProject.name,
                description: activeProject.description,
                priority: activeProject.priority,
                layout: activeProject.layout,
                allowManualEscalationToCurator: activeProject.allowManualEscalationToCurator
            }));
        });
    } catch(e) {
        console.log(e);
    }
};