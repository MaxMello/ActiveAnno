// @flow
import {createAction, handleActions} from 'redux-actions';
import type {Dictionary, ProjectID} from '../../types/Types';
import {GlobalActionKey} from "../GlobalActions";
import {jwtNetworkRequestSaga} from "../../api/helper/NetworkRequestSaga";
import {getAnnotateProject, getAnnotateProjectList} from "../../api/AnnotateRoutes";
import type {AnnotateProject, ListProject} from "../../types/annotate/DTOTypes";
import type {AnnotationProjectState} from "../../types/redux/AnnotationConfigState";
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

export const AnnotationProjectListActionKey = {
    START: "ANNOTATION_PROJECT_LIST/START",
    RECEIVED: "ANNOTATION_PROJECT_LIST/RECEIVED",
    ERROR: "ANNOTATION_PROJECT_LIST/ERROR",
};

export const AnnotationProjectActionKey = {
    START: "ANNOTATION_PROJECT/START",
    RECEIVED: "ANNOTATION_PROJECT/RECEIVED",
    ERROR: "ANNOTATION_PROJECT/ERROR",
    SET_ACTIVE: "ANNOTATION_PROJECT/SET_ACTIVE",
};

export const AnnotationProjectListActions = {
    start: createAction(AnnotationProjectListActionKey.START),
    received: createAction(AnnotationProjectListActionKey.RECEIVED, (projectList: Array<ListProject>) => projectList),
    error: createAction(AnnotationProjectListActionKey.ERROR),
};

export const AnnotationProjectActions = {
    start: createAction(AnnotationProjectActionKey.START, (projectID: ProjectID) => projectID),
    received: createAction(AnnotationProjectActionKey.RECEIVED, (projects: Array<AnnotateProject>) => projects),
    error: createAction(AnnotationProjectActionKey.ERROR),
    setActive: createAction(AnnotationProjectActionKey.SET_ACTIVE, (projectID: ProjectID) => projectID)
};

export const AnnotationSelectionActionKey = {
    SET_SUB_FILTER: "ANNOTATION_SELECTION/SET_SUB_FILTER",
    SET_DATE_FROM: "ANNOTATION_SELECTION/SET_DATE_FROM",
    SET_DATE_TO: "ANNOTATION_SELECTION/SET_DATE_TO"
};

export const AnnotationSelectionActions = {
    setSubFilter: createAction(AnnotationSelectionActionKey.SET_SUB_FILTER,
        (subFilter: Dictionary<string, string>) => subFilter),
    setDateFilterFrom: createAction(AnnotationSelectionActionKey.SET_DATE_FROM, (date: string) => date),
    setDateFilterTo: createAction(AnnotationSelectionActionKey.SET_DATE_TO, (date: string) => date)
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S T A T E
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const initialState: AnnotationProjectState = {
    type: "annotate",
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

export const annotationProjectReducer = handleActions({
    [AnnotationProjectListActionKey.START]: startGetProjectList,
    [AnnotationProjectListActionKey.RECEIVED]: receiveProjectList,
    [AnnotationProjectListActionKey.ERROR]: errorProjectList,
    [AnnotationProjectActionKey.START]: startGetProject,
    [AnnotationProjectActionKey.RECEIVED]: receiveProject,
    [AnnotationProjectActionKey.ERROR]: errorProject,
    [GlobalActionKey.LOGOUT]: (): Function => {
        return {
            ...initialState
        };
    },
    [AnnotationProjectActionKey.SET_ACTIVE]: setProjectActive,
    [AnnotationSelectionActionKey.SET_SUB_FILTER]: setSubFilter,
    [AnnotationSelectionActionKey.SET_DATE_FROM]: setDateFrom,
    [AnnotationSelectionActionKey.SET_DATE_TO]: setDateTo,
}, initialState);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                                   S A G A
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const onLoadAnnotationProjectList: Function = function*() {
    yield jwtNetworkRequestSaga(AnnotationProjectListActionKey.START, getAnnotateProjectList,
        AnnotationProjectListActions.received, AnnotationProjectListActions.error);
};

export const onLoadAnnotationProject: Function = function*() {
    yield jwtNetworkRequestSaga(AnnotationProjectActionKey.START, getAnnotateProject,
        AnnotationProjectActions.received, AnnotationProjectActions.error);
};