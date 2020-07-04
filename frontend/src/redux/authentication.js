// @flow
import {createAction, handleActions} from 'redux-actions';
import type {Action} from '../types/Types';
import FetchStatus from "../api/helper/FetchStatus";
import {put, takeLatest} from 'redux-saga/effects';
import {GlobalActionKey} from "./GlobalActions";
import type {JWT, UserCredentials} from "../types/AuthenticationTypes";
import type {AuthenticationState} from "../types/redux/AuthenticationState";
import type {ApplicationState} from "../types/redux/ApplicationState";
import {getJWT} from "../api/AuthenticationRoutes";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const RequestJwtActionKey = {
    START: 'AUTHENTICATION/START',
    RECEIVED: 'AUTHENTICATION/RECEIVED',
    ERROR: 'AUTHENTICATION/ERROR'
};

export const AuthenticationActions = {
    start: createAction(RequestJwtActionKey.START, (userCredentials: UserCredentials):
    UserCredentials => userCredentials),
    received: createAction(RequestJwtActionKey.RECEIVED, (jwt: JWT): JWT => jwt),
    error: createAction(RequestJwtActionKey.ERROR)
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: AuthenticationState = {
    jwt: null,
    fetchStatus: null,
    username: null
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const authentication = handleActions({
    [RequestJwtActionKey.START]: (state: ApplicationState, action: {|
        ...Action,
        payload: UserCredentials
    |}): Function => {
        return {
            ...state,
            ...{
                fetchStatus: FetchStatus.ACTIVE,
                username: action.payload.username
            }
        };
    },
    [RequestJwtActionKey.RECEIVED]: (state: ApplicationState, action: {
        ...Action,
        payload: JWT
    }): Function => {
        return {
            ...state,
            ...{
                jwt: action.payload,
                fetchStatus: FetchStatus.SUCCESS
            }
        };
    },
    [RequestJwtActionKey.ERROR]: (state: ApplicationState): Function => {
        return {
            ...state,
            ...{
                jwt: null,
                fetchStatus: FetchStatus.ERROR
            }
        };
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

export const onGetJWT: Function = function* () {
    yield takeLatest(RequestJwtActionKey.START, function* handleGetJWT({payload}) {
        try {
            yield put(AuthenticationActions.received(yield getJWT(payload)));
        } catch (e) {
            console.log("Could not get JWT", e);
            yield put(AuthenticationActions.error());
        }
    });
};