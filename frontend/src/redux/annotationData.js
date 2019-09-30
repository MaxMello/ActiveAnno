// @flow
import {createAction, handleActions} from 'redux-actions';
import type {
    Action,
    annotationID,
    Dictionary,
    documentID
} from '../types/Types';
import {getDataForAnnotateConfig, postAnnotationsAsAnnotator} from "../api/Endpoints";
import {delay, put, race, select, take} from 'redux-saga/effects';
import FetchStatus from "../api/FetchStatus";
import {jwtNetworkRequestSaga, networkRequest} from "../api/NetworkRequestSaga";
import {GlobalActionKey} from "./GlobalActions";
import {AnnotationConfigActionKey} from "./annotationConfig";
import type {ValidationError} from "../components/helper/ValidateAnnotations";
import type {AnnotationDataState, DocumentToAnnotate, Span} from "../types/AnnotationTypes";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const RequestAnnotationDataKey = {
    START: "ANNOTATION_DATA/START",
    RECEIVED: "ANNOTATION_DATA/RECEIVED",
    ERROR: "ANNOTATION_DATA/ERROR",
};

const AnnotationDataActionKeys = {
    SET_ACTIVE: "ANNOTATION_DATA/SET_ACTIVE",
    SET_CURRENT_TARGET: "ANNOTATION_DATA/SET_CURRENT_TARGET",
    INITIALIZE_SENDING: "ANNOTATION_DATA/INITIALIZE_SENDING",
    FINISH_DOCUMENT: "ANNOTATION_DATA/FINISH",
    REPORT_VALIDATION_ERRORS: "ANNOTATION_DATA/REPORT_VALIDATION_ERRORS"
};

const DocumentAnnotationDataActionKeys = {
    SET_VALUE: "ANNOTATION_DATA_DOCUMENT/SET_VALUE"
};

const SpanAnnotationDataActionKeys = {
    SET_VALUE: "ANNOTATION_DATA_SPAN/SET_VALUE"
};

export const StoreAnnotationDataKey = {
    START: "ANNOTATION_STORE/START",
    RECEIVED: "ANNOTATION_STORE/RECEIVED",
    ERROR: "ANNOTATION_STORE/ERROR",
};

export const RequestAnnotationDataActions = {
    start: createAction(RequestAnnotationDataKey.START, (configID: string, ignoreDocuments: Array<documentID>) => {
        return {configID, ignoreDocuments}
    }),
    received: createAction(RequestAnnotationDataKey.RECEIVED, (data: Array) => data),
    error: createAction(RequestAnnotationDataKey.ERROR),
};

export const AnnotationDataActions = {
    setActive: createAction(AnnotationDataActionKeys.SET_ACTIVE, (configurationID: string, documentID: string, currentTarget: string) => {
        return {configurationID, documentID, currentTarget};
    }),
    setCurrentTarget: createAction(AnnotationDataActionKeys.SET_CURRENT_TARGET, (currentTarget: string) => {
        return {currentTarget};
    }),
    setDocumentValue: createAction(DocumentAnnotationDataActionKeys.SET_VALUE, (configurationID: string, documentID: string, annotationID: string, value: any) => {
        return {configurationID, documentID, annotationID, value};
    }),
    setSpanValue: createAction(SpanAnnotationDataActionKeys.SET_VALUE, (configurationID: string, documentID: string, annotationID: string, spans: Array<Span>, value: any) => {
        return {configurationID, documentID, annotationID, value, spans};
    }),
    initializeSending: createAction(AnnotationDataActionKeys.INITIALIZE_SENDING, (configurationID: string, documentID: string) => {
        return {configurationID, documentID}
    }),
    finishDocument: createAction(AnnotationDataActionKeys.FINISH_DOCUMENT, (configurationID: string, documentID: string) => {
        return {configurationID, documentID}
    }),
    reportValidationErrors: createAction(AnnotationDataActionKeys.REPORT_VALIDATION_ERRORS, (configurationID: string, documentID: string, validationErrors: Dictionary<annotationID, Array<ValidationError>>) => {
        return {configurationID, documentID, validationErrors}
    })
};

export const StoreAnnotationDataActions = {
    start: createAction(StoreAnnotationDataKey.START, (annotations: Array<DocumentToAnnotate>) => {
        return {
            annotations: annotations
        }
    }),
    received: createAction(StoreAnnotationDataKey.RECEIVED, (confirmedStores: Array<Object>) => {
        return confirmedStores
    }),
    error: createAction(StoreAnnotationDataKey.ERROR),
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                  C O N S T A N T S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const Target = {
    DOCUMENT: "DocumentTarget",
    SPAN: "SpanTarget"
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: AnnotationDataState = {
    documents: {},
    fetchStatus: null,
    activeDocumentID: "",
    currentTarget: null,
    autoValidate: false
};


const mapDataToState: Function = (state: AnnotationDataState, data: Array) => {
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
                            configurationID: d.configurationID,
                            documentID: d.documentID,
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

const removeStoredAnnotations: Function = (state: AnnotationDataState, storedAnnotations: Array) => {
    let intermediateState = {
        ...{},
        ...state
    };
    storedAnnotations.forEach(it => {
        if (intermediateState.documents[it.configurationID]) {
            delete intermediateState.documents[it.configurationID][it.documentID];
        }
    });
    return intermediateState;
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
    [RequestAnnotationDataKey.RECEIVED]: (state: AnnotationDataState, action: Action): Function => {
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
    [AnnotationConfigActionKey.SET_ACTIVE]: (state: AnnotationDataState, action: Action): Function => {
        // On active config switch, we need to remove the active document if not for the new config
        return (state.activeDocumentID &&
            !(state.documents[action.payload] && state.documents[action.payload][state.activeDocumentID])) ? {
            ...state,
            ...{
                activeDocumentID: ""
            }
        } : state;
    },
    [AnnotationDataActionKeys.SET_ACTIVE]: (state: AnnotationDataState, action: Action): Function => {
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
    [AnnotationDataActionKeys.SET_CURRENT_TARGET]: (state: AnnotationDataState, action: Action): Function => {
        return {
            ...state,
            ...{
                currentTarget: action.payload.currentTarget
            }
        };
    },
    [DocumentAnnotationDataActionKeys.SET_VALUE]: (state: AnnotationDataState, action: Action): Function => {
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
    [SpanAnnotationDataActionKeys.SET_VALUE]: (state: AnnotationDataState, action: Action): Function => {
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
    [AnnotationDataActionKeys.FINISH_DOCUMENT]: (state: AnnotationDataState, action: Action): Function => {
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
    [AnnotationDataActionKeys.REPORT_VALIDATION_ERRORS]: (state: AnnotationDataState, action: Action): Function => {
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
    [StoreAnnotationDataKey.RECEIVED]: (state: AnnotationDataState, action: Action): Function => {
        return removeStoredAnnotations(state, action.payload);
    },
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onLoadAnnotationData: Function = function* () {
    yield jwtNetworkRequestSaga(RequestAnnotationDataKey.START, getDataForAnnotateConfig, RequestAnnotationDataActions.received, RequestAnnotationDataActions.error);
};

const getAnnotationData = (state) => state.annotationData;
const getAnnotationConfig = (state) => state.annotationConfig;

export const sendFinishedAnnotations: Function = function* () {
    while (true) {
        const {sendDocument} = yield race({
            sendDocument: take(AnnotationDataActionKeys.INITIALIZE_SENDING),
            periodicSend: delay(10000),
        });
        if (sendDocument) {
            yield put(AnnotationDataActions.finishDocument(sendDocument.payload.configurationID, sendDocument.payload.documentID));
        }
        const annotationData = yield select(getAnnotationData);
        const annotationConfig = yield select(getAnnotationConfig);
        const body = Object.values(annotationData.documents).flatMap(x => Object.values(x)).filter(d => (d.finished)).map(d => {
                return {
                    ...d,
                    usedConfig: annotationConfig.configs[d.configurationID]
                };
            }
        );
        if (body.length > 0) {
            yield networkRequest(StoreAnnotationDataActions.start(body), postAnnotationsAsAnnotator, StoreAnnotationDataActions.received, StoreAnnotationDataActions.error);
        }
    }
};