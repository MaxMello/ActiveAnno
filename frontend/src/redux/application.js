// @flow
import {handleActions} from 'redux-actions';
import type {ApplicationState} from '../types/Types';
import {GlobalActionKey} from "./GlobalActions";

const initialState: ApplicationState = {
    language: {
        selected: 'en',
        available: ['de', 'en']
    }
};

export const applicationReducer = handleActions({
    [GlobalActionKey.LOGOUT]: (): Function => {
        return {
            ...initialState
        };
    }
}, initialState);