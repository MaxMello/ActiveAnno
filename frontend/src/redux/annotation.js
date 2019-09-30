/**
 * Shared redux logic for annotation page
 */
import { take, takeLatest, race, delay, select } from 'redux-saga/effects';
import {createAction} from "redux-actions";
import {AnnotationConfigListActions} from "./annotationConfig";
import {RequestAnnotationDataActions} from "./annotationData";
import FetchStatus from "../api/FetchStatus";
import {getAnnotateConfigs, getDataForAnnotateConfig} from "../api/Endpoints";
import {networkRequest} from "../api/NetworkRequestSaga";
import type {AnnotationConfigFull} from "../types/AnnotationTypes";

const AnnotationActionKeys = {
    FORCE_REFRESH: "ANNOTATION/FORCE_REFRESH",
    START_REFRESHING: "ANNOTATION/START_REFRESHING",
    STOP_REFRESHING: "ANNOTATION/STOP_REFRESHING",
};

export const AnnotationAction = {
    forceRefresh: createAction(AnnotationActionKeys.FORCE_REFRESH),
    startRefreshing: createAction(AnnotationActionKeys.START_REFRESHING),
    stopRefreshing: createAction(AnnotationActionKeys.STOP_REFRESHING)
};

const getAnnotationConfig = (state) => state.annotationConfig;
const getAnnotationData = (state) => state.annotationData;

const refreshAnnotationPage: Function = function * (force: boolean = false) {
    const annotationConfig = yield select(getAnnotationConfig);
    const annotationData = yield select(getAnnotationData);
    if(force) {
        // If force, start by refreshing the list of configs
        yield networkRequest(AnnotationConfigListActions.start(), getAnnotateConfigs, AnnotationConfigListActions.received, AnnotationConfigListActions.error);
    }
    if(annotationConfig.configs && annotationConfig.activeConfigID && annotationConfig.configs[annotationConfig.activeConfigID].annotations) { // Make sure full config is loaded
        const activeConfig: AnnotationConfigFull = annotationConfig.configs[annotationConfig.activeConfigID];
        const documentsForActiveConfig = annotationData.documents[activeConfig.id] ? annotationData.documents[activeConfig.id] : {};
        const nonFinishedDocuments = Object.values(documentsForActiveConfig).filter(d => !d.finished);
        if(nonFinishedDocuments.length <= 3 && annotationData.fetchStatus !== FetchStatus.ACTIVE) {
            console.log("Load data", annotationData, "with ignore", Object.keys(documentsForActiveConfig));
            yield networkRequest(RequestAnnotationDataActions.start(annotationConfig.activeConfigID, Object.keys(documentsForActiveConfig)),
                getDataForAnnotateConfig, RequestAnnotationDataActions.received, RequestAnnotationDataActions.error);
        }
    }
};

export const refreshAnnotationPageSaga: Function = function* () {
    yield takeLatest(AnnotationActionKeys.START_REFRESHING, function*() {
        while (true) {
            const {forceRefresh, periodicRefresh, cancel} = yield race({
                forceRefresh: take(AnnotationActionKeys.FORCE_REFRESH),
                periodicRefresh: delay(10000),
                cancel: take(AnnotationActionKeys.STOP_REFRESHING)
            });
            if (forceRefresh || periodicRefresh) {
                yield refreshAnnotationPage(!!forceRefresh);
            } else if (cancel) {
                break;
            }
        }
    });
};