// @flow
import {createAction, handleActions} from 'redux-actions';
import type {
    Action,
    annotationID,
    Dictionary,
    documentID,
} from '../types/Types';
import {getDataForCurateConfig, postAnnotationsAsCurator} from "../api/Endpoints";
import {delay, put, race, select, take} from 'redux-saga/effects';
import FetchStatus from "../api/FetchStatus";
import {jwtNetworkRequestSaga, networkRequest} from "../api/NetworkRequestSaga";
import {GlobalActionKey} from "./GlobalActions";
import type {ValidationError} from "../components/helper/ValidateAnnotations";
import type {AnnotationResult, CurationDataState, DocumentToCurate} from "../types/CurateTypes";
import {CurationConfigActionKey} from "./curationConfig";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const RequestCurationDataKey = {
    START: "CURATION_DATA/START",
    RECEIVED: "CURATION_DATA/RECEIVED",
    ERROR: "CURATION_DATA/ERROR",
};

const CurationDataActionKeys = {
    SET_ACTIVE: "CURATION_DATA/SET_ACTIVE",
    SET_CURRENT_TARGET: "CURATION_DATA/SET_CURRENT_TARGET",
    INITIALIZE_SENDING: "CURATION_DATA/INITIALIZE_SENDING",
    ACCEPT_EXISTING_ANNOTATION: "CURATION_DATA/ACCEPT_EXISTING_ANNOTATION",
    COPY_EXISTING_ANNOTATION: "CURATION_DATA/COPY_EXISTING_ANNOTATION",
    GIVE_FEEDBACK_FOR_ANNOTATION: "CURATION_DATA/GIVE_FEEDBACK_FOR_ANNOTATION",
    FINISH_DOCUMENT: "CURATION_DATA/FINISH",
    REPORT_VALIDATION_ERRORS: "CURATION_DATA/REPORT_VALIDATION_ERRORS"
};

const DocumentCurationDataActionKeys = {
    SET_VALUE: "CURATION_DATA_DOCUMENT/SET_VALUE"
};

const SpanCurationDataActionKeys = {
    SET_VALUE: "CURATION_DATA_SPAN/SET_VALUE"
};

export const StoreCurationDataKey = {
    START: "CURATION_STORE/START",
    RECEIVED: "CURATION_STORE/RECEIVED",
    ERROR: "CURATION_STORE/ERROR",
};

export const RequestCurationDataActions = {
    start: createAction(RequestCurationDataKey.START, (configID: string, ignoreDocuments: Array<documentID>) => {
        return {configID, ignoreDocuments}
    }),
    received: createAction(RequestCurationDataKey.RECEIVED, (data: Array) => data),
    error: createAction(RequestCurationDataKey.ERROR),
};

export const CurationDataActions = {
    setActive: createAction(CurationDataActionKeys.SET_ACTIVE, (configurationID: string, documentID: string, currentTarget: string) => {
        return {configurationID, documentID, currentTarget};
    }),
    setCurrentTarget: createAction(CurationDataActionKeys.SET_CURRENT_TARGET, (currentTarget: string) => {
        return {currentTarget};
    }),
    setDocumentValue: createAction(DocumentCurationDataActionKeys.SET_VALUE, (configurationID: string, documentID: string, annotationID: string, value: any) => {
        return {configurationID, documentID, annotationID, value};
    }),
    setSpanValue: createAction(SpanCurationDataActionKeys.SET_VALUE, (configurationID: string, documentID: string, annotationID: string, spans: Array<Span>, value: any) => {
        return {configurationID, documentID, annotationID, value, spans};
    }),
    initializeSending: createAction(CurationDataActionKeys.INITIALIZE_SENDING, (configurationID: string, documentID: string) => {
        return {configurationID, documentID}
    }),
    acceptExistingAnnotation: createAction(CurationDataActionKeys.ACCEPT_EXISTING_ANNOTATION, (configurationID: string, documentID: string, annotationResultID: string) => {
        return {
            configurationID,
            documentID,
            annotationResultID
        };
    }),
    copyExistingAnnotation: createAction(CurationDataActionKeys.COPY_EXISTING_ANNOTATION, (annotatedDocument: AnnotationResult) => {
        return annotatedDocument
    }),
    giveFeedbackForAnnotation: createAction(CurationDataActionKeys.GIVE_FEEDBACK_FOR_ANNOTATION, (annotatedDocument: AnnotationResult) => {
        return {
            annotatedDocument
        }
    }),
    finishDocument: createAction(CurationDataActionKeys.FINISH_DOCUMENT, (configurationID: string, documentID: string) => {
        return {configurationID, documentID}
    }),
    reportValidationErrors: createAction(CurationDataActionKeys.REPORT_VALIDATION_ERRORS, (configurationID: string, documentID: string, validationErrors: Dictionary<annotationID, Array<ValidationError>>) => {
        return {configurationID, documentID, validationErrors}
    })
};

export const StoreCurationDataActions = {
    start: createAction(StoreCurationDataKey.START, (annotations: Array<DocumentToCurate>) => {
        return {
            annotations: annotations
        }
    }),
    received: createAction(StoreCurationDataKey.RECEIVED, (confirmedStores: Array<Object>) => {
        return confirmedStores
    }),
    error: createAction(StoreCurationDataKey.ERROR),
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: CurationDataState = {
    documents: {},
    fetchStatus: null,
    activeDocumentID: "",
    currentTarget: null,
    autoValidate: false
};


const mapDataToState: Function = (state: CurationDataState, data: Array) => {
    let intermediateState = {
        ...state
    };
    data.forEach(d => {
        intermediateState = {
            ...intermediateState,
            ...{
                documents: {
                    ...intermediateState.documents,
                    [d.configurationID]: {
                        ...intermediateState.documents[d.configurationID],
                        [d.documentID]: {
                            ...intermediateState.documents[intermediateState.configurationID] ? intermediateState.documents[d.configurationID][d.documentID] : {},
                            documentData: d.documentData,
                            annotations: d.annotations,
                            configurationID: d.configurationID,
                            documentID: d.documentID,
                            acceptedAnnotationResultID: null,
                            documentAnnotations: {},
                            spanAnnotations: {},
                            interactionLog: {},
                            finished: false,
                            validationErrors: {}
                        },
                    },
                }
            },

        }
    });
    return intermediateState;
};

const removeStoredCurations: Function = (state: CurationDataState, storedCurations: Array) => {
    let intermediateState = {
        ...{},
        ...state
    };
    storedCurations.forEach(it => {
        if (intermediateState.documents[it.configurationID]) {
            delete intermediateState.documents[it.configurationID][it.documentID];
        }
    });
    return intermediateState;
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
    [RequestCurationDataKey.RECEIVED]: (state: CurationDataState, action: Action): Function => {
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
    [CurationConfigActionKey.SET_ACTIVE]: (state: CurationDataState, action: Action): Function => {
        // On active config switch, we need to remove the active document if not for the new config
        return (state.activeDocumentID &&
            !(state.documents[action.payload] && state.documents[action.payload][state.activeDocumentID])) ? {
            ...state,
            ...{
                activeDocumentID: ""
            }
        } : state;
    },
    [CurationDataActionKeys.SET_ACTIVE]: (state: CurationDataState, action: Action): Function => {
        return {
            ...state,
            ...{
                activeDocumentID: action.payload.documentID,
                currentTarget: action.payload.currentTarget,
                documents: {
                    ...state.documents,
                    [action.payload.configurationID]: {
                        ...state.documents[action.payload.configurationID],
                        [action.payload.documentID]: {
                            ...state.documents[action.payload.configurationID][action.payload.documentID],
                            interactionLog: {
                                firstShownTimestamp: Date.now()
                            }
                        },
                    },
                }
            }
        };
    },
    [CurationDataActionKeys.SET_CURRENT_TARGET]: (state: CurationDataState, action: Action): Function => {
        return {
            ...state,
            ...{
                currentTarget: action.payload.currentTarget
            }
        };
    },
    [DocumentCurationDataActionKeys.SET_VALUE]: (state: CurationDataState, action: Action): Function => {
        return {
            ...state,
            documents: {
                ...state.documents,
                [action.payload.configurationID]: {
                    ...state.documents[action.payload.configurationID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.configurationID][action.payload.documentID],
                        documentAnnotations: {
                            ...state.documents[action.payload.configurationID][action.payload.documentID].documentAnnotations,
                            [action.payload.annotationID]: {
                                value: action.payload.value
                            }
                        },
                        interactionLog: {
                            ...state.documents[action.payload.configurationID][action.payload.documentID].interactionLog,
                            firstInteractionTimestamp: state.documents[action.payload.configurationID][action.payload.documentID].interactionLog.firstInteractionTimestamp ? state.documents[action.payload.configurationID][action.payload.documentID].interactionLog.firstInteractionTimestamp : Date.now(),
                            lastInteractionTimestamp: Date.now()
                        }
                    },
                },
            }
        };
    },
    [SpanCurationDataActionKeys.SET_VALUE]: (state: CurationDataState, action: Action): Function => {
        return {
            ...state,
            documents: {
                ...state.documents,
                [action.payload.configurationID]: {
                    ...state.documents[action.payload.configurationID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.configurationID][action.payload.documentID],
                        spanAnnotations: {
                            ...state.documents[action.payload.configurationID][action.payload.documentID].spanAnnotations,
                            [action.payload.annotationID]: {
                                value: action.payload.value,
                                spans: action.payload.spans
                            }
                        },
                        interactionLog: {
                            ...state.documents[action.payload.configurationID][action.payload.documentID].interactionLog,
                            firstInteractionTimestamp: state.documents[action.payload.configurationID][action.payload.documentID].interactionLog.firstInteractionTimestamp ? state.documents[action.payload.configurationID][action.payload.documentID].interactionLog.firstInteractionTimestamp : Date.now(),
                            lastInteractionTimestamp: Date.now()
                        }
                    },
                },
            }
        };
    },
    [CurationDataActionKeys.ACCEPT_EXISTING_ANNOTATION]: (state: CurationDataState, action: Action) => {
        return {
            ...state,
            documents: {
                ...state.documents,
                [action.payload.configurationID]: {
                    ...state.documents[action.payload.configurationID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.configurationID][action.payload.documentID],
                        acceptedAnnotationResultID: action.payload.annotationResultID,
                        finished: true
                    },
                },
            }
        }
    },
    [CurationDataActionKeys.COPY_EXISTING_ANNOTATION]: (state: CurationDataState, action: Action) => {
        return {
            ...state,
            documents: {
                ...state.documents,
                [action.payload.configurationID]: {
                    ...state.documents[action.payload.configurationID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.configurationID][action.payload.documentID],
                        documentAnnotations: action.payload.documentAnnotations,
                        spanAnnotations: action.payload.spanAnnotations
                    },
                },
            }
        }
    },
    [CurationDataActionKeys.GIVE_FEEDBACK_FOR_ANNOTATION]: (state: CurationDataState, action: Action) => {

    },
    [CurationDataActionKeys.FINISH_DOCUMENT]: (state: CurationDataState, action: Action): Function => {
        return {
            ...state,
            documents: {
                ...state.documents,
                [action.payload.configurationID]: {
                    ...state.documents[action.payload.configurationID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.configurationID][action.payload.documentID],
                        finished: true
                    },
                },
            }
        };
    },
    [CurationDataActionKeys.REPORT_VALIDATION_ERRORS]: (state: CurationDataState, action: Action): Function => {
        return {
            ...state,
            documents: {
                ...state.documents,
                [action.payload.configurationID]: {
                    ...state.documents[action.payload.configurationID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.configurationID][action.payload.documentID],
                        validationErrors: action.payload.validationErrors
                    },
                },
            }
        };
    },
    [StoreCurationDataKey.RECEIVED]: (state: CurationDataState, action: Action): Function => {
        return removeStoredCurations(state, action.payload);
    },
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onLoadCurationData: Function = function* () {
    yield jwtNetworkRequestSaga(RequestCurationDataKey.START, getDataForCurateConfig, RequestCurationDataActions.received, RequestCurationDataActions.error);
};

const getCurationData = (state) => state.curationData;
const getCurationConfig = (state) => state.curationConfig;

export const sendFinishedCurations: Function = function* () {
    while (true) {
        const {sendDocument} = yield race({
            sendDocument: take(CurationDataActionKeys.INITIALIZE_SENDING),
            periodicSend: delay(10000),
        });
        if (sendDocument) {
            yield put(CurationDataActions.finishDocument(sendDocument.payload.configurationID, sendDocument.payload.documentID));
        }
        const curationData = yield select(getCurationData);
        const curationConfig = yield select(getCurationConfig);
        const body = Object.values(curationData.documents).flatMap(x => Object.values(x)).filter(d => (d.finished)).map(d => {
                return {
                    acceptedAnnotationResultID: d.acceptedAnnotationResultID,
                    annotatedDocument: !d.acceptedAnnotationResultID ? {
                        documentID: d.documentID,
                        configurationID: d.configurationID,
                        documentData: d.documentData,
                        documentAnnotations: d.documentAnnotations,
                        interactionLog: d.interactionLog,
                        spanAnnotations: d.spanAnnotations,
                        usedConfig: curationConfig.configs[d.configurationID]
                    } : undefined,
                    configurationID: d.configurationID,
                    documentID: d.documentID
                };
            }
        );
        if (body.length > 0) {
            yield networkRequest(StoreCurationDataActions.start(body), postAnnotationsAsCurator, StoreCurationDataActions.received, StoreCurationDataActions.error);
        }
    }
};