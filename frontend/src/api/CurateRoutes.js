// @flow
import type {JWT} from "../types/AuthenticationTypes";
import type {
    AnnotateProject,
    GetDocumentsForAnnotationParameters,
    ListProject,
    PostAnnotationResult
} from "../types/annotate/DTOTypes";
import {get, post} from "./helper/HttpMethods";
import {ACTIVE_ANNO_SERVICE_URL} from "../constants/Constants";
import type {AcceptAnnotationResult, CurationDocument} from "../types/annotate/CurateTypes";
import {CURATION_DOCUMENT_BULK_COUNT} from "../redux/annotate/curationRefresh";

/*
 *  Routes for curation related requests to the backend
 */

const CurateRoutes: Object = {
    CURATE_PROJECT_LIST: '/curate/project',
    CURATE_PROJECT: '/curate/project/',
    CURATE_DATA_FOR_PROJECT: ['/curate/project/', '/document'],
    CURATE_POST_RESULT: '/curate/annotationResult',
    CURATE_ACCEPT_RESULT: '/curate/acceptAnnotationResult'
};

export const getCurateProjectList: Function = (params = null, jwt: JWT, selectedLanguage?: string):
    Array<ListProject> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${CurateRoutes.CURATE_PROJECT_LIST}`, undefined, jwt,
        selectedLanguage);
};

export const getCurateProject: Function = (projectID: number, jwt: JWT, selectedLanguage?: string): AnnotateProject => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${CurateRoutes.CURATE_PROJECT}${projectID}`, undefined, jwt,
        selectedLanguage);
};

export const getDataForCurateProject: Function = (parameters: GetDocumentsForAnnotationParameters,
                                                 jwt: JWT, selectedLanguage?: string): Array<CurationDocument> => {
    // noinspection LongLine
    return get(`${ACTIVE_ANNO_SERVICE_URL}${CurateRoutes.CURATE_DATA_FOR_PROJECT[0]}${parameters.projectID}${CurateRoutes.CURATE_DATA_FOR_PROJECT[1]}`,
        {
            "ignoreDocuments": parameters.ignoreDocuments.join(","),
            "subFilter": parameters.subFilter ? encodeURIComponent(JSON.stringify(parameters.subFilter)) : null,
            "dateRange": parameters.dateRange ? encodeURIComponent(JSON.stringify(parameters.dateRange)) : null,
            "limit": CURATION_DOCUMENT_BULK_COUNT
        },
        jwt,selectedLanguage);
};

export const postAnnotationResultAsCurator: Function = (annotationResult: PostAnnotationResult, jwt: JWT,
                                                        selectedLanguage?: string): Object =>
    post(`${ACTIVE_ANNO_SERVICE_URL}${CurateRoutes.CURATE_POST_RESULT}`, annotationResult, jwt,
        selectedLanguage);

export const postAcceptedAnnotationResult: Function = (acceptAnnotationResult: AcceptAnnotationResult, jwt: JWT,
                                                        selectedLanguage?: string): Object =>
    post(`${ACTIVE_ANNO_SERVICE_URL}${CurateRoutes.CURATE_ACCEPT_RESULT}`, acceptAnnotationResult, jwt,
        selectedLanguage);