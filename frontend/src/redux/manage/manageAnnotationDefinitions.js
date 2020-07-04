import {jwtNetworkRequestSaga} from "../../api/helper/NetworkRequestSaga";
import {
    getAnnotationDefinition,
    getAnnotationDefinitions,
    storeAnnotationDefinition,
    updateAnnotationDefinition
} from "../../api/ManageRoutes";
import {createAction} from "redux-actions";
import type {
    AnnotationDefinition,
    AnnotationDefinitionInStore
} from "../../types/annotationdefinition/AnnotationDefinition";
import type {Action, AnnotationID} from "../../types/Types";
import {DefaultAnnotationDefinitions} from "../../constants/AnnotationDefinition";
import type {ManageState} from "../../types/redux/ManageState";
import FetchStatus from "../../api/helper/FetchStatus";
import {normalize} from "../../helper/Helper";

/*
   LOAD ANNOTATION DEFINITIONS (LIST)
 */

export const LoadAnnotationDefinitionsKey = {
    START: "LOAD_ANNOTATION_DEFINITIONS/START",
    RECEIVED: "LOAD_ANNOTATION_DEFINITIONS/RECEIVED",
    ERROR: "LOAD_ANNOTATION_DEFINITIONS/ERROR",
};

export const LoadAnnotationDefinitionsActions = {
    start: createAction(LoadAnnotationDefinitionsKey.START),
    received: createAction(LoadAnnotationDefinitionsKey.RECEIVED,
        (annotationDefinitions: Array<AnnotationDefinition>) => annotationDefinitions),
    error: createAction(LoadAnnotationDefinitionsKey.ERROR)
};

export const onLoadAnnotationDefinitions: Function = function* () {
    yield jwtNetworkRequestSaga(LoadAnnotationDefinitionsKey.START, getAnnotationDefinitions,
        LoadAnnotationDefinitionsActions.received, LoadAnnotationDefinitionsActions.error);
};

/*
    LOAD A SINGLE ANNOTATION DEFINITION
 */

export const LoadAnnotationDefinitionKey = {
    START: "RELOAD_ANNOTATION_DEFINITION/START",
    RECEIVED: "RELOAD_ANNOTATION_DEFINITION/RECEIVED",
    ERROR: "RELOAD_ANNOTATION_DEFINITION/ERROR",
};

export const LoadAnnotationDefinitionAction = {
    start: createAction(LoadAnnotationDefinitionKey.START, (annotationID: AnnotationID) => annotationID),
    received: createAction(LoadAnnotationDefinitionKey.RECEIVED,
        (annotationDefinition: AnnotationDefinition) => annotationDefinition),
    error: createAction(LoadAnnotationDefinitionKey.ERROR)
};

export const onLoadAnnotationDefinition: Function = function* () {
    yield jwtNetworkRequestSaga(LoadAnnotationDefinitionKey.START, getAnnotationDefinition,
        LoadAnnotationDefinitionAction.received, LoadAnnotationDefinitionAction.error);
};

/*
    UPDATE AN ANNOTATION DEFINITION IN THE BACKEND
 */

export const UpdateAnnotationDefinitionKey = {
    START: "UPDATE_ANNOTATION_DEFINITION/START",
    RECEIVED: "UPDATE_ANNOTATION_DEFINITION/RECEIVED",
    ERROR: "UPDATE_ANNOTATION_DEFINITION/ERROR",
};

export const UpdateAnnotationDefinitionAction = {
    start: createAction(UpdateAnnotationDefinitionKey.START,
        (annotationDefinition: AnnotationDefinition) => annotationDefinition),
    received: createAction(UpdateAnnotationDefinitionKey.RECEIVED,
        (annotationDefinition: AnnotationDefinition) => annotationDefinition),
    error: createAction(UpdateAnnotationDefinitionKey.ERROR)
};

export const onUpdateAnnotationDefinition: Function = function* () {
    yield jwtNetworkRequestSaga(UpdateAnnotationDefinitionKey.START, updateAnnotationDefinition,
        UpdateAnnotationDefinitionAction.received, UpdateAnnotationDefinitionAction.error);
};

/*
    STORE A NEW ANNOTATION DEFINITION IN THE BACKEND
 */

export const StoreAnnotationDefinitionKey = {
    START: "STORE_ANNOTATION_DEFINITION/START",
    RECEIVED: "STORE_ANNOTATION_DEFINITION/RECEIVED",
    ERROR: "STORE_ANNOTATION_DEFINITION/ERROR",
};

export const StoreAnnotationDefinitionAction = {
    start: createAction(StoreAnnotationDefinitionKey.START,
        (annotationDefinition: AnnotationDefinition) => annotationDefinition),
    received: createAction(StoreAnnotationDefinitionKey.RECEIVED,
        (annotationDefinition: AnnotationDefinition) => annotationDefinition),
    error: createAction(StoreAnnotationDefinitionKey.ERROR)
};

export const onStoreAnnotationDefinition: Function = function* () {
    yield jwtNetworkRequestSaga(StoreAnnotationDefinitionKey.START, storeAnnotationDefinition,
        StoreAnnotationDefinitionAction.received, StoreAnnotationDefinitionAction.error);
};

/*
 * GENERAL ANNOTATION DEFINITION ACTIONS
 */

export const AnnotationDefinitionKey = {
    UPDATE_STATE: "ANNOTATION_DEFINITION/UPDATE_STATE"
};

export const AnnotationDefinitionAction = {
    updateState: createAction(AnnotationDefinitionKey.UPDATE_STATE,
        (annotationDefinition: AnnotationDefinition) => annotationDefinition),
};

/*
    DEFAULT OBJECTS
 */

export const newAnnotationDefinition: AnnotationDefinitionInStore = {
    ...DefaultAnnotationDefinitions.TagSetAnnotationDefinition,
    changed: false
};

export const manageAnnotationDefinitionReducerActions = {
    [LoadAnnotationDefinitionsKey.START]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                annotationDefinitionListFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [LoadAnnotationDefinitionsKey.RECEIVED]: (state: ManageState, action: {|
        ...Action,
        payload: Array<AnnotationDefinition>
    |}): Function => {
        return {
            ...state,
            ...{
                annotationDefinitions: {
                    ...normalize(Object.values(state.annotationDefinitions).filter(a => !a.changed)),
                    ...normalize(action.payload),
                    // Do not overwrite changed ones
                    ...normalize(Object.values(state.annotationDefinitions).filter(a => a.changed)),
                },
                annotationDefinitionFetchStatus: FetchStatus.SUCCESS
            }
        };
    },
    [LoadAnnotationDefinitionsKey.ERROR]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                annotationDefinitionFetchStatus: FetchStatus.ERROR
            }
        };
    },
    [LoadAnnotationDefinitionKey.START]: (state: ManageState, action: {|
    ...Action,
        payload: AnnotationDefinition
    |}): Function => {
        return {
            ...state,
            ...{
                annotationDefinitions: {
                    ...state.annotationDefinitions,
                    [action.payload.id]: {
                        ...state.annotationDefinitions[action.payload.id],
                        fetchStatus: FetchStatus.ACTIVE
                    }
                }
            }
        };
    },
    [LoadAnnotationDefinitionKey.RECEIVED]: (state: ManageState, action: {|
        ...Action,
        payload: AnnotationDefinition
    |}): Function => {
        return {
            ...state,
            ...{
                annotationDefinitions: {
                    ...state.annotationDefinitions,
                    [action.payload.id]: action.payload
                },
            }
        };
    },
    [LoadAnnotationDefinitionKey.ERROR]: (state: ManageState): Function => {
        return state;
    },
    [UpdateAnnotationDefinitionKey.START]: (state: ManageState, action: {|
        ...Action,
        payload: AnnotationDefinition
    |}): Function => {
        return {
            ...state,
            ...{
                annotationDefinitions: {
                    ...state.annotationDefinitions,
                    [action.payload.id]: {
                        ...state.annotationDefinitions[action.payload.id],
                        fetchStatus: FetchStatus.ACTIVE
                    }
                }
            }
        };
    },
    [UpdateAnnotationDefinitionKey.RECEIVED]: (state: ManageState, action: {|
        ...Action,
        payload: AnnotationDefinition
    |}): Function => {
        return {
            ...state,
            ...{
                annotationDefinitions: {
                    ...state.annotationDefinitions,
                    [action.payload.id]: action.payload
                },
            }
        };
    },
    [UpdateAnnotationDefinitionKey.ERROR]: (state: ManageState): Function => {
        return state;
    },
    [StoreAnnotationDefinitionKey.START]: (state: ManageState, action: {|
        ...Action,
        payload: AnnotationDefinition
    |}): Function => {
        return {
            ...state,
            ...{
                newAnnotationDefinition: {
                    ...state.newAnnotationDefinition,
                    fetchStatus: FetchStatus.ACTIVE
                }
            }
        };
    },
    [StoreAnnotationDefinitionKey.RECEIVED]: (state: ManageState, action: {|
        ...Action,
        payload: AnnotationDefinition
    |}): Function => {
        return {
            ...state,
            ...{
                annotationDefinitions: {
                    ...state.annotationDefinitions,
                    [action.payload.id]: action.payload
                },
                newAnnotationDefinition: newAnnotationDefinition
            }
        };
    },
    [StoreAnnotationDefinitionKey.ERROR]: (state: ManageState): Function => {
        return state;
    },
    [AnnotationDefinitionKey.UPDATE_STATE]: (state: ManageState, action: {|
        ...Action,
        payload: AnnotationDefinition
    |}): Function => {
        if(Object.keys(state.annotationDefinitions).includes(action.payload.id)) {
            return {
                ...state,
                ...{
                    annotationDefinitions: {
                        ...state.annotationDefinitions,
                        [action.payload.id]: {
                            ...action.payload,
                            changed: true
                        }
                    }
                }
            };
        } else {
            return {
                ...state,
                newAnnotationDefinition: {
                    ...action.payload,
                    changed: true
                }
            }
        }
    },
};