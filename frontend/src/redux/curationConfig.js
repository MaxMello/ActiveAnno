// @flow
import {handleActions} from 'redux-actions';
import type {Action} from '../types/Types';
import {createAction} from 'redux-actions';
import {getCurateConfig, getCurateConfigList} from "../api/Endpoints";
import FetchStatus from "../api/FetchStatus";
import {normalize, normalizeObject} from "../helper/Helper";
import {GlobalActionKey} from "./GlobalActions";
import {jwtNetworkRequestSaga} from "../api/NetworkRequestSaga";
import type {CurationConfigState} from "../types/CurateTypes";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const CurationConfigListActionKey = {
    START: "CURATION_CONFIG_LIST/START",
    RECEIVED: "CURATION_CONFIG_LIST/RECEIVED",
    ERROR: "CURATION_CONFIG_LIST/ERROR",
};

export const CurationConfigActionKey = {
    START: "CURATION_CONFIG/START",
    RECEIVED: "CURATION_CONFIG/RECEIVED",
    ERROR: "CURATION_CONFIG/ERROR",
    SET_ACTIVE: "CURATION_CONFIG/SET_ACTIVE",
};

export const CurationConfigListActions = {
    start: createAction(CurationConfigListActionKey.START),
    received: createAction(CurationConfigListActionKey.RECEIVED, (configList) => configList),
    error: createAction(CurationConfigListActionKey.ERROR),
};

export const CurationConfigActions = {
    start: createAction(CurationConfigActionKey.START, (configID: string) => configID),
    received: createAction(CurationConfigActionKey.RECEIVED, (configs: Array) => configs),
    error: createAction(CurationConfigActionKey.ERROR),
    setActive: createAction(CurationConfigActionKey.SET_ACTIVE, (configID: string) => configID)
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: CurationConfigState = {
    configs: {},
    listFetchStatus: null,
    configFetchStatus: null,
    activeConfigID: ""
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const curationConfigReducer = handleActions({
    [CurationConfigListActionKey.START]: (state: CurationConfigState): Function => {
        return {
            ...state,
            ...{
                listFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [CurationConfigListActionKey.RECEIVED]: (state: CurationConfigState, action: Action): Function => {
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
    [CurationConfigListActionKey.ERROR]: (state: CurationConfigState): Function => {
        return {
            ...state,
            ...{
                listFetchStatus: FetchStatus.ERROR
            }
        };
    },
    [CurationConfigActionKey.START]: (state: CurationConfigState): Function => {
        return {
            ...state,
            ...{
                configFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [CurationConfigActionKey.RECEIVED]: (state: CurationConfigState, action: Action): Function => {
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
    [CurationConfigActionKey.ERROR]: (state: CurationConfigState): Function => {
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
    [CurationConfigActionKey.SET_ACTIVE]: (state: CurationConfigState, action: Action): Function => {
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

export const onLoadCurationConfigList: Function = function*() {
    yield jwtNetworkRequestSaga(CurationConfigListActionKey.START, getCurateConfigList, CurationConfigListActions.received, CurationConfigListActions.error);
};

export const onLoadCurationConfig: Function = function*() {
    yield jwtNetworkRequestSaga(CurationConfigActionKey.START, getCurateConfig, CurationConfigActions.received, CurationConfigActions.error);
};