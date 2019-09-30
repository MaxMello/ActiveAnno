// @flow
import {handleActions} from 'redux-actions';
import type {Action} from '../types/Types';
import {createAction} from 'redux-actions';
import {load} from "../api/Endpoints";
import FetchStatus from "../api/FetchStatus";
import {GlobalActionKey} from "./GlobalActions";
import {jwtNetworkRequestSaga} from "../api/NetworkRequestSaga";
import {
    StoreAnnotationDataKey
} from "./annotationData";
import {StoreCurationDataKey} from "./curationData";
import {delay, put, select} from "@redux-saga/core/effects";
import type {PageSetupState} from "../types/PageSetupTypes";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const RequestPageSetupActionKey = {
    START_LOAD: "PAGE_SETUP/START_LOAD",
    RECEIVED: "PAGE_SETUP/RECEIVED",
    LOAD_ERROR: "PAGE_SETUP/LOAD_ERROR",
    DELETE: "PAGE_SETUP/DELETE"
};

export const RequestPageSetupActions = {
    start: createAction(RequestPageSetupActionKey.START_LOAD),
    received: createAction(RequestPageSetupActionKey.RECEIVED, (pageSetup: PageSetup): PageSetup => pageSetup),
    error:  createAction(RequestPageSetupActionKey.LOAD_ERROR)
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   C O N S T A N T S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const Pages = {
    ANNOTATE: "annotate",
    CURATE: "curate",
    MANAGE: "manage",
    ADMIN: "admin",
    SEARCH: "search"
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: PageSetupState = {
    pageSetup: null,
    fetchStatus: null
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const pageSetupReducer = handleActions({
    [RequestPageSetupActionKey.START_LOAD]: (state: PageSetupState): Function => {
        return {
            ...state,
            ...{
                fetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [RequestPageSetupActionKey.RECEIVED]: (state: PageSetupState, action: Action): Function => {
        return {
            ...state,
            ...{
                pageSetup: action.payload,
                fetchStatus: FetchStatus.SUCCESS
            }
        };
    },
    [RequestPageSetupActionKey.LOAD_ERROR]: (state: PageSetupState): Function => {
        return {
            ...state,
            ...{
                pageSetup: null,
                fetchStatus: FetchStatus.ERROR
            }
        };
    },
    [StoreAnnotationDataKey.RECEIVED]: (state: PageSetupState): Function => {
        return {
            ...state,
            ...{
                pageSetup: {
                    ...state.pageSetup,
                    pages: {
                        ...state.pageSetup.pages,
                        annotate: {
                            ...state.pageSetup.pages.annotate,
                            badgeCount: Math.max(0, state.pageSetup.pages.annotate.badgeCount - 1)
                        }
                    }
                },
                fetchStatus: FetchStatus.ERROR
            }
        }
    },
    [StoreCurationDataKey.RECEIVED]: (state: PageSetupState): Function => {
        return {
            ...state,
            ...{
                pageSetup: {
                    ...state.pageSetup,
                    pages: {
                        ...state.pageSetup.pages,
                        curate: {
                            ...state.pageSetup.pages.curate,
                            badgeCount: Math.max(0, state.pageSetup.pages.curate.badgeCount - 1)
                        }
                    }
                },
                fetchStatus: FetchStatus.ERROR
            }
        }
    },
    [GlobalActionKey.LOGOUT]: (): Function => {
        return {
            ...initialState
        };
    }
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onStartLoad: Function = function*() {
    yield jwtNetworkRequestSaga(RequestPageSetupActionKey.START_LOAD, load, RequestPageSetupActions.received, RequestPageSetupActions.error);
};
const getAuthentication = (state) => state.authentication;
const getPageSetup = (state) => state.pageSetup;

export const periodicRefreshPageSetup: Function = function* () {
    while (true) {
        yield delay(30000);
        console.log("periodic page setup");
        const authentication = yield select(getAuthentication);
        const pageSetup = yield select(getPageSetup);
        if(authentication.jwt !== null && (!pageSetup.pageSetup || pageSetup.fetchStatus !== FetchStatus.ACTIVE)) {
            console.log("periodic page setup start");
            yield put(RequestPageSetupActions.start());
        }
    }
};