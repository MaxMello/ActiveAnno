// @flow
import {createAction, handleActions} from 'redux-actions';
import type {AnnotationID, Dictionary, DocumentID, ProjectID} from '../../types/Types';
import FetchStatus from "../../api/helper/FetchStatus";
import {jwtNetworkRequestSaga} from "../../api/helper/NetworkRequestSaga";
import {GlobalActionKey} from "../GlobalActions";
import type {Annotation} from "../../types/document/annotation/Annotation";
import type {
    AnnotationDataState,
    AnnotationDocumentInState,
    AnnotationDocumentsReceivedAction,
    CheckEnableConditionRequest,
    CheckEnableConditionResponse,
    SetAnnotationValueAction
} from "../../types/redux/annotate/AnnotationDataState";
import {
    getDataForAnnotateProject,
    postAnnotationsAsAnnotator,
    postCheckEnableConditions
} from "../../api/AnnotateRoutes";
import type {AnnotationDocument, AnnotationResultStoreResponse} from "../../types/annotate/AnnotateTypes";
import {AnnotationProjectActionKey} from "./annotationProject";
import type {UsedAnnotateProject} from "../../types/project/UsedAnnotateProject";
import type {AnnotateProject, PostAnnotationResult} from "../../types/annotate/DTOTypes";
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
import {select, takeLatest} from "redux-saga/effects";
import type {AppState} from "../../types/redux/AppState";
import type {AnnotationProjectState} from "../../types/redux/AnnotationConfigState";
import {put} from "@redux-saga/core/effects";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const RequestAnnotationDataKey = {
    START: "ANNOTATION_DATA/START",
    RECEIVED: "ANNOTATION_DATA/RECEIVED",
    ERROR: "ANNOTATION_DATA/ERROR",
};

const AnnotationDataActionKey = {
    SET_ACTIVE: "ANNOTATION_DATA/SET_ACTIVE",
    DELETE_DOCUMENTS_FOR_PROJECT: "ANNOTATION_DATA/DELETE_DOCUMENTS_FOR_PROJECT",
    SET_VALUE: "ANNOTATION_DATA_DOCUMENT/SET_VALUE",
    RESET_ANNOTATIONS: "ANNOTATION_DATA/RESET_ANNOTATIONS",
    SKIP_DOCUMENT: "ANNOTATION_DATA/SKIP_DOCUMENT"
};

const CheckEnableConditionActionKey = {
    START: "ANNOTATE_ENABLE_CONDITION/START",
    RECEIVED: "ANNOTATE_ENABLE_CONDITION/RECEIVED",
    ERROR: "ANNOTATE_ENABLE_CONDITION/ERROR",
};

export const StoreAnnotationDataKey = {
    START: "ANNOTATION_STORE/START",
    RECEIVED: "ANNOTATION_STORE/RECEIVED",
    ERROR: "ANNOTATION_STORE/ERROR",
};

export const RequestAnnotationDataActions = {
    start: createAction(RequestAnnotationDataKey.START, (projectID: ProjectID, ignoreDocuments:
        Array<DocumentID>, subFilter: Dictionary<string, string>, dateRange: Array<number>) => {
        return {projectID, ignoreDocuments, subFilter, dateRange}
    }),
    received: createAction(RequestAnnotationDataKey.RECEIVED, (data: Array<AnnotationDocument>) => data),
    error: createAction(RequestAnnotationDataKey.ERROR),
};

export const AnnotationDataActions = {
    setActive: createAction(AnnotationDataActionKey.SET_ACTIVE, (projectID: string,
                                                                 documentID: string) => {
        return {projectID, documentID};
    }),
    setAnnotationValue: createAction(AnnotationDataActionKey.SET_VALUE,
        (projectID: ProjectID, documentID: DocumentID, annotationID:
            AnnotationID, annotation: Annotation) => {
            return {projectID, documentID, annotationID, annotation};
        }),
    removeDocumentsFromStoreForProject: createAction(AnnotationDataActionKey.DELETE_DOCUMENTS_FOR_PROJECT,
        (projectID: string) => {
        return {projectID}
    }),
    resetAnnotations: createAction(AnnotationDataActionKey.RESET_ANNOTATIONS,
        (projectID: ProjectID, documentID: DocumentID) => {
        return {projectID, documentID}
    }),
    skipDocument: createAction(AnnotationDataActionKey.SKIP_DOCUMENT,
        (projectID: ProjectID, documentID: DocumentID) => {
        return {projectID, documentID}
    }),
};

const CheckEnableConditionActions = {
    start: createAction(CheckEnableConditionActionKey.START,
        (annotationDocument: AnnotationDocumentInState, usedProject: UsedAnnotateProject):
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


export const StoreAnnotationDataActions = {
    start: createAction(StoreAnnotationDataKey.START,
        (annotationDocument: AnnotationDocumentInState, usedProject: UsedAnnotateProject):
        PostAnnotationResult => {
        return { ...annotationDocument,
            usedProject: usedProject,
            interactionLog: {
                firstShownTimestamp: ((annotationDocument.interactionLog?.firstShownTimestamp ?? null): any),
                firstInteractionTimestamp: annotationDocument.interactionLog?.firstInteractionTimestamp ?? Date.now(),
                lastInteractionTimestamp: Date.now()
            },
        }
    }),
    received: createAction(StoreAnnotationDataKey.RECEIVED,
        (storeResponse: AnnotationResultStoreResponse) => storeResponse),
    error: createAction(StoreAnnotationDataKey.ERROR),
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                  C O N S T A N T S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const Target = {
    DOCUMENT: "DocumentTarget",
    SPAN: "SpanTarget"
};

export type TargetType = $Values<typeof Target>;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: AnnotationDataState = {
    documents: {},
    documentOrder: {},
    fetchStatus: null,
    activeDocumentID: ""
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const annotationDataReducer = handleActions({
    [RequestAnnotationDataKey.START]: (state: AnnotationDataState): Function => {
        return {
            ...state,
            ...{
                fetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [RequestAnnotationDataKey.RECEIVED]: (state: AnnotationDataState, action: AnnotationDocumentsReceivedAction):
        Function => {
        return {
            ...state,
            ...mapDataToState(state, action.payload),
            fetchStatus: action.payload.length > 0 ? FetchStatus.SUCCESS : FetchStatus.ERROR
        };
    },
    [RequestAnnotationDataKey.ERROR]: (state: AnnotationDataState): Function => {
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
    [AnnotationProjectActionKey.SET_ACTIVE]: resetActiveDocument,
    [AnnotationDataActionKey.SET_ACTIVE]: setDocumentActive,
    [AnnotationDataActionKey.SET_VALUE]: setAnnotationValue,
    [AnnotationDataActionKey.DELETE_DOCUMENTS_FOR_PROJECT]: deleteDocumentsForProject,
    [AnnotationDataActionKey.RESET_ANNOTATIONS]: resetAnnotations,
    [AnnotationDataActionKey.SKIP_DOCUMENT]: skipDocument,
    [StoreAnnotationDataKey.START]: startAnnotationResultStore,
    [StoreAnnotationDataKey.RECEIVED]: receiveAnnotationResultStored,
    [StoreAnnotationDataKey.ERROR]: (state: AnnotationDataState): Function => {
        const allDocumentEntries = Object.entries(state.documents);
        const newState = {
            ...state
        }
        for(let [projectID, documentDict] of allDocumentEntries) {
            for(let documentID of Object.keys((documentDict: any))) {
                newState.documents[projectID][documentID].isSending = false
            }
        }
        return newState;
    },
    [CheckEnableConditionActionKey.RECEIVED]: updateEnableConditions,
    [CheckEnableConditionActionKey.ERROR]: (state: AnnotationDataState): Function => {
        return state;
    },
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onLoadAnnotationData: Function = function* () {
    yield jwtNetworkRequestSaga(RequestAnnotationDataKey.START, getDataForAnnotateProject,
        RequestAnnotationDataActions.received, RequestAnnotationDataActions.error);
};

export const sendFinishedAnnotationResult: Function = function* () {
    yield jwtNetworkRequestSaga(StoreAnnotationDataKey.START, postAnnotationsAsAnnotator,
        StoreAnnotationDataActions.received, StoreAnnotationDataActions.error);
};

export const annotateCheckEnableConditions: Function = function* () {
    yield jwtNetworkRequestSaga(CheckEnableConditionActionKey.START, postCheckEnableConditions,
        CheckEnableConditionActions.received, CheckEnableConditionActions.error);
};

const getAnnotationProject = (state: AppState): AnnotationProjectState => {
    return state.annotationProject;
};
const getAnnotationData = (state: AppState): AnnotationDataState => {
    return state.annotationData;
};
export const annotateOnValueCheckCheckEnableCondition: Function = function* () {
    try {
        yield takeLatest([AnnotationDataActionKey.SET_VALUE, AnnotationDataActionKey.RESET_ANNOTATIONS],
            function* (action: SetAnnotationValueAction) {
            const projectState = yield select(getAnnotationProject);
            const dataState = yield select(getAnnotationData);
            const activeProjectID = action.payload.projectID;
            const activeDocumentID = action.payload.documentID;
            const activeProject: AnnotateProject = projectState.projects[activeProjectID];
            const annotationDocument: AnnotationDocumentInState =
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