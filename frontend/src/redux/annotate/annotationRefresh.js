// @flow
import {delay, put, race, select, take, takeLatest} from 'redux-saga/effects';
import {createAction} from "redux-actions";
import {RequestAnnotationDataActions} from "./annotationData";
import FetchStatus from "../../api/helper/FetchStatus";
import type {AnnotateProject} from "../../types/annotate/DTOTypes";
import type {AnnotationProjectState} from "../../types/redux/AnnotationConfigState";
import {AnnotationProjectActions, AnnotationProjectListActions} from "./annotationProject";
import type {AnnotationDataState, AnnotationDocumentInState} from "../../types/redux/annotate/AnnotationDataState";
import type {AppState} from "../../types/redux/AppState";

export const ANNOTATION_DOCUMENT_BULK_COUNT = 15

const AnnotationRefreshActionKey = {
    FORCE_REFRESH: "ANNOTATION/FORCE_REFRESH",
    TRIGGER_REFRESH: "ANNOTATION/TRIGGER_REFRESH",
    START_REFRESHING: "ANNOTATION/START_REFRESHING",
    STOP_REFRESHING: "ANNOTATION/STOP_REFRESHING",
};

export const AnnotationAction = {
    /**
     * Force refresh: Manual, full refresh, also loads project list new
     */
    forceRefresh: createAction(AnnotationRefreshActionKey.FORCE_REFRESH),
    /**
     * Active trigger of refresh, but not triggered by user
     */
    triggerRefresh: createAction(AnnotationRefreshActionKey.TRIGGER_REFRESH),
    /**
     * Enable refreshing process
     */
    startRefreshing: createAction(AnnotationRefreshActionKey.START_REFRESHING),
    /**
     * Disable refreshing process
     */
    stopRefreshing: createAction(AnnotationRefreshActionKey.STOP_REFRESHING)
};

const getAnnotationProject = (state: AppState): AnnotationProjectState => {
    return state.annotationProject;
};
const getAnnotationData = (state: AppState): AnnotationDataState => {
    return state.annotationData;
};

const refreshAnnotationPage: Function = function * (force: boolean = false) {
    const annotationProject: AnnotationProjectState = yield select(getAnnotationProject);
    const annotationData: AnnotationDataState = yield select(getAnnotationData);
    if(force) {
        // If force, start by refreshing the list of projects
        yield put(AnnotationProjectListActions.start());
        if(annotationProject.projects && annotationProject.activeProjectID) {
            yield put(AnnotationProjectActions.start(annotationProject.activeProjectID));
        }
    }
    if(annotationProject.projects && annotationProject.activeProjectID &&
        annotationProject.projects[annotationProject.activeProjectID].layout) { // Make sure full project is loaded
        const activeProject: AnnotateProject = annotationProject.projects[annotationProject.activeProjectID];
        const allProjectDocuments = annotationData.documents[activeProject.id]
            ? annotationData.documents[activeProject.id] : {};
        const relevantProjectDocuments = (Object.values(allProjectDocuments) : Array<any>)
            .filter((d: AnnotationDocumentInState) => !d.skipped);
        if(relevantProjectDocuments.length < (ANNOTATION_DOCUMENT_BULK_COUNT / 2) &&
            annotationData.fetchStatus !== FetchStatus.ACTIVE) {
            yield put(RequestAnnotationDataActions.start(annotationProject.activeProjectID,
                Object.keys(allProjectDocuments),
                annotationProject.selection.subFilter, [
                    annotationProject.selection.dateFilterFrom ? new Date(annotationProject.selection.dateFilterFrom)
                        .getTime() : null,
                    annotationProject.selection.dateFilterTo ? new Date(annotationProject.selection.dateFilterTo)
                        .getTime() : null
                ]));
        }
    }
};

export const refreshAnnotationPageSaga: Function = function* () {
    yield takeLatest(AnnotationRefreshActionKey.START_REFRESHING, function*() {
        while (true) {
            const {forceRefresh, triggerRefresh, periodicRefresh, cancel} = yield race({
                forceRefresh: take(AnnotationRefreshActionKey.FORCE_REFRESH),
                triggerRefresh: take(AnnotationRefreshActionKey.TRIGGER_REFRESH),
                periodicRefresh: delay(10000),
                cancel: take(AnnotationRefreshActionKey.STOP_REFRESHING)
            });
            if (forceRefresh || triggerRefresh || periodicRefresh) {
                yield refreshAnnotationPage(!!forceRefresh);
            } else if (cancel) {
                break;
            }
        }
    });
};