// @flow

import type {Action} from "../types/Types";
import {GlobalActionKey, GlobalActions} from "../redux/GlobalActions";
import { takeLatest, put, select, race, take, call } from 'redux-saga/effects';

const getJwt = (state) => state.authentication.jwt;

export const networkRequest: Function = function* (action: Action, apiCall: Function, receivedAction: Function, errorAction: Function) {
    try {
        const apiCallTask = function*() {
            const jwt = yield select(getJwt);
            const response = yield apiCall(action.payload, jwt);
            console.log(action, "Response", response);
            yield put(receivedAction(response));
        };
        // Race between api call and logout action getting fired, this will stop the apiCall on logout
        yield race({
            logout: take(GlobalActionKey.LOGOUT),
            callTask: call(apiCallTask),
        });
    } catch (e) {
        console.log(action, "Error getting response form server", e);
        if(e.statusCode === 403) {
            yield put(GlobalActions.logout());
        } else {
            yield put(errorAction());
        }
    }
};
/**
 * @param startKey: On which action key should the worker be triggered?
 * @param apiCall: API function to call, gets the actions payload and the jwt as parameter
 * @param receivedAction: Action to call with the server response
 * @param errorAction: Action to call on error
 * @returns {IterableIterator<ForkEffect>}
 */
export const jwtNetworkRequestSaga: Function = function* (startKey: string, apiCall: Function, receivedAction: Function, errorAction: Function) {
    yield takeLatest(startKey, function*(action: Action) {
        yield networkRequest(action, apiCall, receivedAction, errorAction);
    });
};