import type {ManageConfigFull, ManageState} from "../types/ManageTypes";
import {createAction, handleActions} from "redux-actions";
import FetchStatus from "../api/FetchStatus";
import type {Action} from "../types/Types";
import {normalize, normalizeObject} from "../helper/Helper";
import {GlobalActionKey} from "./GlobalActions";
import {jwtNetworkRequestSaga} from "../api/NetworkRequestSaga";
import {getManageConfig, getManageConfigList, postManageConfig, putManageConfig} from "../api/Endpoints";
import {buildDeepObject} from "../components/helper/HelperFunctions";
import {LayoutAreaTypes} from "../constants/LayoutAreaTypes";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


export const ManageConfigListActionKey = {
    START: "MANAGE_CONFIG_LIST/START",
    RECEIVED: "MANAGE_CONFIG_LIST/RECEIVED",
    ERROR: "MANAGE_CONFIG_LIST/ERROR",
};

export const ManageConfigActionKey = {
    START: "MANAGE_CONFIG/START",
    RECEIVED: "MANAGE_CONFIG/RECEIVED",
    ERROR: "MANAGE_CONFIG/ERROR"
};

export const CreateConfigActionKey = {
    START: "CREATE_CONFIG/START",
    RECEIVED: "CREATE_CONFIG/RECEIVED",
    ERROR: "CREATE_CONFIG/ERROR"
};

export const SaveConfigActionKey = {
    START: "SAVE_CONFIG/START",
    RECEIVED: "SAVE_CONFIG/RECEIVED",
    ERROR: "SAVE_CONFIG/ERROR"
};

export const EditProjectActionKey = {
    UPDATE_CONFIG_VALUE: "EDIT_PROJECT/UPDATE_CONFIG_VALUE"
};

export const ManageConfigListActions = {
    start: createAction(ManageConfigListActionKey.START),
    received: createAction(ManageConfigListActionKey.RECEIVED, (configList) => configList),
    error: createAction(ManageConfigListActionKey.ERROR),
};

export const ManageConfigActions = {
    start: createAction(ManageConfigActionKey.START, (configID: string) => configID),
    received: createAction(ManageConfigActionKey.RECEIVED, (configs: Array) => configs),
    error: createAction(ManageConfigActionKey.ERROR)
};

export const CreateConfigActions = {
    start: createAction(CreateConfigActionKey.START),
    received: createAction(CreateConfigActionKey.RECEIVED, (config: ManageConfigFull) => config),
    error: createAction(CreateConfigActionKey.ERROR)
};

export const SaveConfigActions = {
    start: createAction(SaveConfigActionKey.START, (configID: string) => {
            return {configID}
    }),
    received: createAction(SaveConfigActionKey.RECEIVED, (config: ManageConfigFull) => config),
    error: createAction(SaveConfigActionKey.ERROR)
};

export const EditProjectActions = {
    updateConfigValue: createAction(EditProjectActionKey.UPDATE_CONFIG_VALUE, (configID: string, keys: Array<string>, value: any) => {
        return {
            configID, keys, value
        }
    }),
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   V A L U E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const OnOverwrittenFinalizedAnnotationBehavior = {
    DO_NOTHING: "DO_NOTHING",
    TRIGGER_EXPORT_AGAIN: "TRIGGER_EXPORT_AGAIN"
};

export const RestAuthentication = {
    NONE: {
        type: "None"
    },
    HTTP_BASIC_AUTH: {
        type: "HttpBasicAuth",
        username: "",
        password: ""
    },
    JWT_ROLE: {
        type: "JwtRole"
    }
};

export const WebHookAuthentication = {
    NONE: {
        type: "None"
    },
    HTTP_BASIC_AUTH: {
        type: "HttpBasicAuth",
        username: "",
        password: ""
    }
};

export const OnWebHookFailureBehavior = {
    IGNORE: "IGNORE",
    RESEND_ON_NEXT_TRIGGER: "RESEND_ON_NEXT_TRIGGER"
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const newConfig = {
    userRoles: {
        annotators: [],
        curators: [],
        managers: []
    },
    name: "",
    description: "",
    active: false,
    priority: 0,
    filter: null,
    inputMapping: {
        documentText: {
            key: ""
        },
        metaData: []
    },
    sort: {
        sorts: [{
            key: 'storeTimestamp',
            order: 'DESC'
        }]
    },
    annotations: {
        annotationMap: {

        }
    },
    layout: {
        exampleDocument: {
            documentID: "EXAMPLE_DOCUMENT",
            spanAnnotations: {},
            documentAnnotations: {},
            documentData: {
                "DOCUMENT_TEXT": ""
            }
        },
        layoutAreas: {
            [LayoutAreaTypes.COMMON]: {
                id: LayoutAreaTypes.COMMON,
                rows: [

                ]
            },
            [LayoutAreaTypes.DOCUMENT_TARGET]: {
                id: LayoutAreaTypes.DOCUMENT_TARGET,
                rows: [

                ]
            }
        }
    },
    policy: {
        numberOfAnnotatorsPerDocument: 1,
        allowManualEscalationToCurator: false,
        finalizeAnnotationPolicy: "MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR"
    },
    export: {
        webHooks: [

        ],
        rest: null,
        onOverwrittenFinalizedAnnotationBehavior: OnOverwrittenFinalizedAnnotationBehavior.DO_NOTHING
    }
};

const initialState: ManageState = {
    configs: {},
    listFetchStatus: null,
    configFetchStatus: null,
    newConfig: newConfig
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const manageReducer = handleActions({
    [ManageConfigListActionKey.START]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                listFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [ManageConfigListActionKey.RECEIVED]: (state: ManageState, action: Action): Function => {
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
    [ManageConfigListActionKey.ERROR]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                listFetchStatus: FetchStatus.ERROR
            }
        };
    },
    [ManageConfigActionKey.START]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                configFetchStatus: FetchStatus.ACTIVE
            }
        };
    },
    [ManageConfigActionKey.RECEIVED]: (state: ManageState, action: Action): Function => {
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
    [ManageConfigActionKey.ERROR]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                configFetchStatus: FetchStatus.ERROR
            }
        };
    },
    [EditProjectActionKey.UPDATE_CONFIG_VALUE]: (state: ManageState, action: Action): Function => {
        return {
            ...state,
            ...(action.payload.configID ? {
                configs: {
                    ...state.configs,
                    [action.payload.configID]: {
                        ...buildDeepObject(action.payload.keys, state.configs[action.payload.configID], action.payload.value, 0),
                        needsSyncing: true
                    }
                }
            } : {
                newConfig: buildDeepObject(action.payload.keys, state.newConfig, action.payload.value, 0)
            })
        };
    },
    [CreateConfigActionKey.START]: (state: ManageState): Function => {
        return {
            ...state,
            ...{
                newConfig: {
                    ...state.newConfig,
                    ...{
                        fetchStatus: FetchStatus.ACTIVE
                    }
                }
            }
        };
    },
    [CreateConfigActionKey.RECEIVED]: (state: ManageState, action: Action): Function => {
        return {
            ...state,
            ...{
                configs: {
                    ...state.configs,
                    [action.payload.config.id]: {
                        ...state.configs[action.payload.config]
                    }
                },
                newConfig: newConfig
            }
        };
    },
    [CreateConfigActionKey.ERROR]: (state: ManageState, action: Action): Function => {
        return action.payload.configID ? {
            ...state,
            ...{
                newConfig: {
                    ...state.newConfig,
                    ...{
                        fetchStatus: FetchStatus.ERROR
                    }
                }
            }
        } : state;
    },
    [SaveConfigActionKey.START]: (state: ManageState, action: Action): Function => {
        return {
            ...state,
            ...{
                configs: {
                    ...state.configs,
                    [action.payload.configID]: {
                        ...state.configs[action.payload.configID],
                        ...{
                            fetchStatus: FetchStatus.ACTIVE
                        }
                    }
                }
            }
        };
    },
    [SaveConfigActionKey.RECEIVED]: (state: ManageState, action: Action): Function => {
        return {
            ...state,
            ...{
                configs: {
                    ...state.configs,
                    [action.payload.config.id]: {
                        ...state.configs[action.payload.config]
                    }
                },
            }
        };
    },
    [SaveConfigActionKey.ERROR]: (state: ManageState, action: Action): Function => {
        return action.payload.configID ? {
            ...state,
            ...{
                configs: {
                    ...state.configs,
                    [action.payload.configID]: {
                        ...state.configs[action.payload.configID],
                        ...{
                            fetchStatus: FetchStatus.ERROR
                        }
                    }
                }
            }
        } : state;
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

export const onLoadManageConfigList: Function = function*() {
    yield jwtNetworkRequestSaga(ManageConfigListActionKey.START, getManageConfigList, ManageConfigListActions.received, ManageConfigListActions.error);
};

export const onLoadManageConfig: Function = function*() {
    yield jwtNetworkRequestSaga(ManageConfigActionKey.START, getManageConfig, ManageConfigActions.received, ManageConfigActions.error);
};

export const onCreateConfig: Function = function*() {
    yield jwtNetworkRequestSaga(CreateConfigActionKey.START, postManageConfig, CreateConfigActionKey.received, CreateConfigActionKey.error);
};

export const onSaveConfig: Function = function*() {
    yield jwtNetworkRequestSaga(SaveConfigActionKey.START, putManageConfig, SaveConfigActionKey.received, SaveConfigActionKey.error);
};