// @flow

import type {Action, ActionWithPayload} from "../../types/Types";
import {GlobalActionKey, GlobalActions} from "../../redux/GlobalActions";
import {call, put, race, select, take, takeLatest} from 'redux-saga/effects';
import type {JWT} from "../../types/AuthenticationTypes";

const getJwt = (state) => state.authentication.jwt;
const getSelectedLanguage = (state) => state.application.language.selected;

export const networkRequest: Function = function* (action: ActionWithPayload, apiCall: (any, ?JWT, ?string) => any,
                                                   receivedAction: Function, errorAction: Function) {
    try {
        const apiCallTask = function*() {
            const jwt = yield select(getJwt);
            const selectedLanguage = yield select(getSelectedLanguage);
            const response = yield apiCall(action.payload, jwt, selectedLanguage);
            yield put(receivedAction(response, action.payload));
        };
        // Race between api call and logout action getting fired, this will stop the apiCall on logout
        yield race({
            logout: take(GlobalActionKey.LOGOUT),
            callTask: call(apiCallTask),
        });
    } catch (e) {
        if(e?.statusCode === 403 || e?.statusCode === 401) {
            yield put(GlobalActions.logout());
        } else {
            yield put(errorAction(action.payload));
        }
    }
};
/**
 * @param startKey: On which action key should the worker be triggered?
 * @param apiCall: API function to call, gets the actions payload and the jwt as parameter
 * @param receivedAction: Action to call with the server response
 * @param errorAction: Action to call on error
 */
export const jwtNetworkRequestSaga: Function = function* (startKey: string, apiCall: Function,
                                                          receivedAction: Function, errorAction: Function) {
    try {
        yield takeLatest(startKey, function* (action: Action) {
            yield networkRequest(action, apiCall, receivedAction, errorAction);
        });
    } catch(e) {
        console.log(e);
    }
};