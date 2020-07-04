// @flow
import {delay, put, race, select, take, takeLatest} from 'redux-saga/effects';
import {createAction} from "redux-actions";
import FetchStatus from "../../api/helper/FetchStatus";
import {RequestCurationDataActions} from "./curationData";
import type {AnnotateProject} from "../../types/annotate/DTOTypes";
import {CurationProjectActions, CurationProjectListActions} from "./curationProject";
import type {CurationDataState, CurationDocumentInState} from "../../types/redux/annotate/CurationDataState";
import type {AppState} from "../../types/redux/AppState";
import type {CurationProjectState} from "../../types/redux/CurationConfigState";

export const CURATION_DOCUMENT_BULK_COUNT = 15


const CurationRefreshActionKey = {
    FORCE_REFRESH: "CURATION/FORCE_REFRESH",
    TRIGGER_REFRESH: "CURATION/TRIGGER_REFRESH",
    START_REFRESHING: "CURATION/START_REFRESHING",
    STOP_REFRESHING: "CURATION/STOP_REFRESHING",
};

export const CurationAction = {
    /**
     * Force refresh: Manual, full refresh, also loads project list new
     */
    forceRefresh: createAction(CurationRefreshActionKey.FORCE_REFRESH),
    /**
     * Active trigger of refresh, but not triggered by user
     */
    triggerRefresh: createAction(CurationRefreshActionKey.TRIGGER_REFRESH),
    /**
     * Enable refreshing process
     */
    startRefreshing: createAction(CurationRefreshActionKey.START_REFRESHING),
    /**
     * Disable refreshing process
     */
    stopRefreshing: createAction(CurationRefreshActionKey.STOP_REFRESHING)
};

const getCurationProject = (state: AppState): CurationProjectState => {
    return state.curationProject;
}
const getCurationData = (state: AppState): CurationDataState => {
    return state.curationData;
}

const refreshCurationPage: Function = function * (force: boolean = false) {
    const curationProject: CurationProjectState = yield select(getCurationProject);
    const curationData: CurationDataState = yield select(getCurationData);
    if(force) {
        // If force, start by refreshing the list of projects
        yield put(CurationProjectListActions.start());
        if(curationProject.projects && curationProject.activeProjectID) {
            yield put(CurationProjectActions.start(curationProject.activeProjectID));
        }
    }
    if(curationProject.projects && curationProject.activeProjectID &&
        curationProject.projects[curationProject.activeProjectID].layout) { // Make sure full project is loaded
        const activeProject: AnnotateProject = curationProject.projects[curationProject.activeProjectID];
        const allProjectDocuments = curationData.documents[activeProject.id]
            ? curationData.documents[activeProject.id] : {};
        const relevantProjectDocuments = (Object.values(allProjectDocuments): Array<any>)
            .filter((d: CurationDocumentInState) => !d.skipped);
        if(relevantProjectDocuments.length < (CURATION_DOCUMENT_BULK_COUNT / 2) &&
            curationData.fetchStatus !== FetchStatus.ACTIVE) {
            yield put(RequestCurationDataActions.start(curationProject.activeProjectID,
                Object.keys(allProjectDocuments),
                curationProject.selection.subFilter, [
                    curationProject.selection.dateFilterFrom ? new Date(curationProject.selection.dateFilterFrom)
                        .getTime() : null,
                    curationProject.selection.dateFilterTo ? new Date(curationProject.selection.dateFilterTo)
                        .getTime() : null
                ]));
        }
    }
};

export const refreshCurationPageSaga: Function = function* () {
    yield takeLatest(CurationRefreshActionKey.START_REFRESHING, function*() {
        while (true) {
            const {forceRefresh, triggerRefresh, periodicRefresh, cancel} = yield race({
                forceRefresh: take(CurationRefreshActionKey.FORCE_REFRESH),
                triggerRefresh: take(CurationRefreshActionKey.TRIGGER_REFRESH),
                periodicRefresh: delay(10000),
                cancel: take(CurationRefreshActionKey.STOP_REFRESHING)
            });
            if (forceRefresh || triggerRefresh || periodicRefresh) {
                yield refreshCurationPage(!!forceRefresh);
            } else if (cancel) {
                break;
            }
        }
    });
};