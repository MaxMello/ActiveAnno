// @flow
import {createAction} from "redux-actions";

export const GlobalActionKey = {
    LOGOUT: 'GLOBAL/LOGOUT'
};

export const GlobalActions = {
    logout: createAction(GlobalActionKey.LOGOUT)
};