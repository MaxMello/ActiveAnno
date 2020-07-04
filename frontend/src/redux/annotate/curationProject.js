// @flow
import {createAction, handleActions} from 'redux-actions';
import type {Dictionary, ProjectID} from '../../types/Types';
import {GlobalActionKey} from "../GlobalActions";
import {jwtNetworkRequestSaga} from "../../api/helper/NetworkRequestSaga";
import {getCurateProject, getCurateProjectList} from "../../api/CurateRoutes";
import type {AnnotateProject, ListProject} from "../../types/annotate/DTOTypes";
import type {CurationProjectState} from "../../types/redux/CurationConfigState";
import {
    errorProject,
    errorProjectList,
    receiveProject,
    receiveProjectList,
    setDateFrom,
    setDateTo,
    setProjectActive,
    setSubFilter,
    startGetProject,
    startGetProjectList
} from "./sharedProjectBehavior";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   A C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const CurationProjectListActionKey = {
    START: "CURATION_PROJECT_LIST/START",
    RECEIVED: "CURATION_PROJECT_LIST/RECEIVED",
    ERROR: "CURATION_PROJECT_LIST/ERROR",
};

export const CurationProjectActionKey = {
    START: "CURATION_PROJECT/START",
    RECEIVED: "CURATION_PROJECT/RECEIVED",
    ERROR: "CURATION_PROJECT/ERROR",
    SET_ACTIVE: "CURATION_PROJECT/SET_ACTIVE",
};

export const CurationProjectListActions = {
    start: createAction(CurationProjectListActionKey.START),
    received: createAction(CurationProjectListActionKey.RECEIVED, (projectList: Array<ListProject>) => projectList),
    error: createAction(CurationProjectListActionKey.ERROR),
};

export const CurationProjectActions = {
    start: createAction(CurationProjectActionKey.START, (projectID: ProjectID) => projectID),
    received: createAction(CurationProjectActionKey.RECEIVED, (projects: Array<AnnotateProject>) => projects),
    error: createAction(CurationProjectActionKey.ERROR),
    setActive: createAction(CurationProjectActionKey.SET_ACTIVE, (projectID: ProjectID) => projectID)
};

export const CurationSelectionActionKey = {
    SET_SUB_FILTER: "CURATION_SELECTION/SET_SUB_FILTER",
    SET_DATE_FROM: "CURATION_SELECTION/SET_DATE_FROM",
    SET_DATE_TO: "CURATION_SELECTION/SET_DATE_TO"
};

export const CurationSelectionActions = {
    setSubFilter: createAction(CurationSelectionActionKey.SET_SUB_FILTER,
        (subFilter: Dictionary<string, string>) => subFilter),
    setDateFilterFrom: createAction(CurationSelectionActionKey.SET_DATE_FROM, (date: string) => date),
    setDateFilterTo: createAction(CurationSelectionActionKey.SET_DATE_TO, (date: string) => date)
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: CurationProjectState = {
    type: "curate",
    projects: {},
    listFetchStatus: null,
    projectFetchStatus: null,
    activeProjectID: "",
    selection: {
        subFilter: {

        },
        dateFilterFrom: null,
        dateFilterTo: null
    }
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   R E D U C E R
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const curationProjectReducer = handleActions({
    [CurationProjectListActionKey.START]: startGetProjectList,
    [CurationProjectListActionKey.RECEIVED]: receiveProjectList,
    [CurationProjectListActionKey.ERROR]: errorProjectList,
    [CurationProjectActionKey.START]: startGetProject,
    [CurationProjectActionKey.RECEIVED]: receiveProject,
    [CurationProjectActionKey.ERROR]: errorProject,
    [GlobalActionKey.LOGOUT]: (): Function => {
        return {
            ...initialState
        };
    },
    [CurationProjectActionKey.SET_ACTIVE]: setProjectActive,
    [CurationSelectionActionKey.SET_SUB_FILTER]: setSubFilter,
    [CurationSelectionActionKey.SET_DATE_FROM]: setDateFrom,
    [CurationSelectionActionKey.SET_DATE_TO]: setDateTo,
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onLoadCurationProjectList: Function = function*() {
    yield jwtNetworkRequestSaga(CurationProjectListActionKey.START, getCurateProjectList,
        CurationProjectListActions.received, CurationProjectListActions.error);
};

export const onLoadCurationProject: Function = function*() {
    yield jwtNetworkRequestSaga(CurationProjectActionKey.START, getCurateProject,
        CurationProjectActions.received, CurationProjectActions.error);
};