// @flow
import {createAction, handleActions} from 'redux-actions';
import type {ApplicationState} from "../types/redux/ApplicationState";
import type {Action} from "../types/Types";


export const availableLanguages = ['de', 'en'];

const initialState: ApplicationState = {
    language: {
        selected: null,
        available: availableLanguages
    }
};

export const LanguageActionKey = {
    SELECT: "APPLICATION/LANGUAGE_SELECT"
}

export const LanguageActions = {
    select: createAction(LanguageActionKey.SELECT, (language: string) => language)
}

export const applicationReducer = handleActions({
    [LanguageActionKey.SELECT]: (state: ApplicationState, action: {
        ...Action,
        payload: string
    }): Function => {
        return availableLanguages.includes(action.payload) ? {
            ...state,
            language: {
                ...state.language,
                selected: action.payload
            }
        } : state;
    }
}, initialState);