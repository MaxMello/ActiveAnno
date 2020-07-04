import type {AnnotationProjectState} from "../../types/redux/AnnotationConfigState";
import type {Action, Dictionary, ProjectID} from "../../types/Types";
import type {AnnotateProject, ListProject} from "../../types/annotate/DTOTypes";
import {normalize, normalizeObject} from "../../helper/Helper";
import FetchStatus from "../../api/helper/FetchStatus";
import type {CurationProjectState} from "../../types/redux/CurationConfigState";

/*
    This file contains Redux actions both shared by annotate project and curate project
 */

export const startGetProjectList = (state: AnnotationProjectState | CurationProjectState): Function => {
    return {
        ...state,
        ...{
            listFetchStatus: FetchStatus.ACTIVE
        }
    };
};

export const receiveProjectList = (state: AnnotationProjectState | CurationProjectState, action: {|
    ...Action,
    payload: Array<ListProject>
|}): Function => {
    return {
        ...state,
        ...{
            projects: {
                ...normalize(action.payload),  /* here, we merge the payload first as
                     the list request has less data than the full requests */
                ...state.projects
            },
            listFetchStatus: FetchStatus.SUCCESS
        }
    };
}

export const errorProjectList = (state: AnnotationProjectState | CurationProjectState): Function => {
    return {
        ...state,
        ...{
            listFetchStatus: FetchStatus.ERROR
        }
    };
};

export const startGetProject = (state: AnnotationProjectState | CurationProjectState): Function => {
    return {
        ...state,
        ...{
            projectFetchStatus: FetchStatus.ACTIVE
        }
    };
};

export const receiveProject = (state: AnnotationProjectState | CurationProjectState, action: {|
    ...Action,
    payload: Array<AnnotateProject>
|}): Function => {
    return {
        ...state,
        ...{
            projects: {
                ...state.projects,
                ...normalizeObject(action.payload)
            },
            projectFetchStatus: FetchStatus.SUCCESS
        }
    };
};

export const errorProject = (state: AnnotationProjectState | CurationProjectState): Function => {
    return {
        ...state,
        ...{
            projectFetchStatus: FetchStatus.ERROR
        }
    };
};

export const setProjectActive = (state: AnnotationProjectState | CurationProjectState, action: {|
    ...Action,
    payload: ProjectID
|}): Function => {
    return {
        ...state,
        ...{
            activeProjectID: action.payload,
            // Switching active project will de-select selection criteria
            selection: {
                ...state.selection,
                subFilter: {

                },
                dateFilterFrom: null,
                dateFilterTo: null
            }
        }
    };
}

export const setSubFilter = (state: AnnotationProjectState | CurationProjectState, action: {|
    ...Action,
    payload: Dictionary<string, string>
|}): Function => {
    return {
        ...state,
        ...{
            selection: {
                ...state.selection,
                subFilter: action.payload
            }
        }
    };
};

export const setDateFrom = (state: AnnotationProjectState | CurationProjectState, action: {
    ...Action,
    payload: string
}): Function => {
    return {
        ...state,
        ...{
            selection: {
                ...state.selection,
                dateFilterFrom: action.payload
            }
        }
    };
};

export const setDateTo = (state: AnnotationProjectState, action: {
    ...Action,
    payload: string
}): Function => {
    return {
        ...state,
        ...{
            selection: {
                ...state.selection,
                dateFilterTo: action.payload
            }
        }
    };
};