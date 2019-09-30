// @flow
import {handleActions} from 'redux-actions';
import type {Action} from '../types/Types';
import {createAction} from 'redux-actions';
import {getAnnotateConfig, getAnnotateConfigs} from "../api/Endpoints";
import FetchStatus from "../api/FetchStatus";
import {normalize, normalizeObject} from "../helper/Helper";
import {GlobalActionKey} from "./GlobalActions";
import {jwtNetworkRequestSaga} from "../api/NetworkRequestSaga";
import type {AnnotationConfigState} from "../types/AnnotationTypes";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const AnnotationConfigListActionKey = {
    START: "ANNOTATION_CONFIG_LIST/START",
    RECEIVED: "ANNOTATION_CONFIG_LIST/RECEIVED",
    ERROR: "ANNOTATION_CONFIG_LIST/ERROR",
};

export const AnnotationConfigActionKey = {
    START: "ANNOTATION_CONFIG/START",
    RECEIVED: "ANNOTATION_CONFIG/RECEIVED",
    ERROR: "ANNOTATION_CONFIG/ERROR",
    SET_ACTIVE: "ANNOTATION_CONFIG/SET_ACTIVE",
};

export const AnnotationConfigListActions = {
    start: createAction(AnnotationConfigListActionKey.START),
    received: createAction(AnnotationConfigListActionKey.RECEIVED, (configList) => configList),
    error: createAction(AnnotationConfigListActionKey.ERROR),
};

export const AnnotationConfigActions = {
    start: createAction(AnnotationConfigActionKey.START, (configID: string) => configID),
    received: createAction(AnnotationConfigActionKey.RECEIVED, (configs: Array) => configs),
    error: createAction(AnnotationConfigActionKey.ERROR),
    setActive: createAction(AnnotationConfigActionKey.SET_ACTIVE, (configID: string) => configID)
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: AnnotationConfigState = {
    configs: {},
    listFetchStatus: null,
    configFetchStatus: null,
    activeConfigID: ""
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const annotationConfigReducer = handleActions({
    [AnnotationConfigListActionKey.START]: (state: AnnotationConfigState): Function => {
        return {
            ...state,
            ...{
                listFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [AnnotationConfigListActionKey.RECEIVED]: (state: AnnotationConfigState, action: Action): Function => {
        return {
            ...state,
            ...{
                configs: {
                    ...normalize(action.payload),  /* here, we merge the payload first as the list request has less data than the full requests */
                    ...state.configs
                },
                listFetchStatus: FetchStatus.SUCCESS
            }
        };
    },
    [AnnotationConfigListActionKey.ERROR]: (state: AnnotationConfigState): Function => {
        return {
            ...state,
            ...{
                listFetchStatus: FetchStatus.ERROR
            }
        };
    },
    [AnnotationConfigActionKey.START]: (state: AnnotationConfigState): Function => {
        return {
            ...state,
            ...{
                configFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [AnnotationConfigActionKey.RECEIVED]: (state: AnnotationConfigState, action: Action): Function => {
        return {
            ...state,
            ...{
                configs: {
                    ...state.configs,
                    ...normalizeObject(action.payload)
                },
                configFetchStatus: FetchStatus.SUCCESS
            }
        };
    },
    [AnnotationConfigActionKey.ERROR]: (state: AnnotationConfigState): Function => {
        return {
            ...state,
            ...{
                configFetchStatus: FetchStatus.ERROR
            }
        };
    },
    [GlobalActionKey.LOGOUT]: (): Function => {
        return {
            ...initialState
        };
    },
    [AnnotationConfigActionKey.SET_ACTIVE]: (state: AnnotationConfigState, action: Action): Function => {
        return {
            ...state,
            ...{
                activeConfigID: action.payload
            }
        };
    }
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onLoadAnnotationConfigList: Function = function*() {
    yield jwtNetworkRequestSaga(AnnotationConfigListActionKey.START, getAnnotateConfigs, AnnotationConfigListActions.received, AnnotationConfigListActions.error);
};

export const onLoadAnnotationConfig: Function = function*() {
    yield jwtNetworkRequestSaga(AnnotationConfigActionKey.START, getAnnotateConfig, AnnotationConfigActions.received, AnnotationConfigActions.error);
};