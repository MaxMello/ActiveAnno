/**
 * Shared redux logic for curation page
 */
import { take, takeLatest, race, delay, select } from 'redux-saga/effects';
import {createAction} from "redux-actions";
import FetchStatus from "../api/FetchStatus";
import {getCurateConfigList, getDataForCurateConfig} from "../api/Endpoints";
import {networkRequest} from "../api/NetworkRequestSaga";
import {CurationConfigListActions} from "./curationConfig";
import {RequestCurationDataActions} from "./curationData";
import type {AnnotationConfigFull} from "../types/AnnotationTypes";

const CurationActionKeys = {
    FORCE_REFRESH: "CURATION/FORCE_REFRESH",
    TRIGGER_REFRESH: "CURATION/TRIGGER_REFRESH",
    START_REFRESHING: "CURATION/START_REFRESHING",
    STOP_REFRESHING: "CURATION/STOP_REFRESHING",
};

export const CurationAction = {
    forceRefresh: createAction(CurationActionKeys.FORCE_REFRESH),
    triggerRefresh: createAction(CurationActionKeys.TRIGGER_REFRESH),
    startRefreshing: createAction(CurationActionKeys.START_REFRESHING),
    stopRefreshing: createAction(CurationActionKeys.STOP_REFRESHING)
};

const getCurationConfig = (state) => state.curationConfig;
const getCurationData = (state) => state.curationData;

const refreshCurationPage: Function = function * (force: boolean = false) {
    const curationConfig = yield select(getCurationConfig);
    const curationData = yield select(getCurationData);
    if(force) {
        // If force, start by refreshing the list of configs
        yield networkRequest(CurationConfigListActions.start(), getCurateConfigList, CurationConfigListActions.received, CurationConfigListActions.error);
    }
    if(curationConfig.configs && curationConfig.activeConfigID && curationConfig.configs[curationConfig.activeConfigID].annotations) { // Make sure full config is loaded
        const activeConfig: AnnotationConfigFull = curationConfig.configs[curationConfig.activeConfigID];
        const documentsForActiveConfig = curationData.documents[activeConfig.id] ? curationData.documents[activeConfig.id] : {};
        const nonFinishedDocuments = Object.values(documentsForActiveConfig).filter(d => !d.finished);
        if(nonFinishedDocuments.length <= 3 && curationData.fetchStatus !== FetchStatus.ACTIVE) {
            yield networkRequest(RequestCurationDataActions.start(curationConfig.activeConfigID, Object.keys(documentsForActiveConfig)),
                getDataForCurateConfig, RequestCurationDataActions.received, RequestCurationDataActions.error);
        }
    }
};

export const refreshCurationPageSaga: Function = function* () {
    yield takeLatest(CurationActionKeys.START_REFRESHING, function*() {
        while (true) {
            const {forceRefresh, triggerRefresh, periodicRefresh, cancel} = yield race({
                forceRefresh: take(CurationActionKeys.FORCE_REFRESH),
                triggerRefresh: take(CurationActionKeys.TRIGGER_REFRESH),
                periodicRefresh: delay(10000),
                cancel: take(CurationActionKeys.STOP_REFRESHING)
            });
            if (forceRefresh || triggerRefresh || periodicRefresh) {
                yield refreshCurationPage(!!forceRefresh);
            } else if (cancel) {
                break;
            }
        }
    });
};