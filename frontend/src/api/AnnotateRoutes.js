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
import type {AnnotationDocument, AnnotationResultStoreResponse} from "../types/annotate/AnnotateTypes";
import type {
    CheckEnableConditionRequest,
    CheckEnableConditionResponse
} from "../types/redux/annotate/AnnotationDataState";
import {ANNOTATION_DOCUMENT_BULK_COUNT} from "../redux/annotate/annotationRefresh";

/*
 *  Routes for annotation related requests to the backend
 */

const AnnotateRoutes: Object = {
    ANNOTATE_PROJECT_LIST: '/annotate/project',
    ANNOTATE_PROJECT: '/annotate/project/',
    ANNOTATE_DATA_FOR_PROJECT: ['/annotate/project/', '/document'],
    ANNOTATE_POST_ANNOTATIONS: '/annotate/annotationResult',
    CHECK_ENABLE_CONDITIONS: '/annotate/checkEnableConditions'
};

export const getAnnotateProjectList: Function = (params = null, jwt: JWT, selectedLanguage?: string):
    Array<ListProject> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${AnnotateRoutes.ANNOTATE_PROJECT_LIST}`, undefined, jwt,
        selectedLanguage);
};
export const getAnnotateProject: Function = (projectID: number, jwt: JWT, selectedLanguage?: string):
    AnnotateProject => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${AnnotateRoutes.ANNOTATE_PROJECT}${projectID}`, undefined, jwt,
        selectedLanguage);
};
export const getDataForAnnotateProject: Function = (parameters: GetDocumentsForAnnotationParameters,
                                                   jwt: JWT, selectedLanguage?: string): Array<AnnotationDocument> => {
    // noinspection LongLine
    return get(`${ACTIVE_ANNO_SERVICE_URL}${AnnotateRoutes.ANNOTATE_DATA_FOR_PROJECT[0]}${parameters.projectID}${AnnotateRoutes.ANNOTATE_DATA_FOR_PROJECT[1]}`,
        {
            "ignoreDocuments": parameters.ignoreDocuments.join(","),
            "subFilter": parameters.subFilter ? encodeURIComponent(JSON.stringify(parameters.subFilter)) : null,
            "dateRange": parameters.dateRange ? encodeURIComponent(JSON.stringify(parameters.dateRange)) : null,
            "limit": ANNOTATION_DOCUMENT_BULK_COUNT
        },
        jwt, selectedLanguage);
};
export const postAnnotationsAsAnnotator: Function = (annotationResult: PostAnnotationResult, jwt: JWT,
                                                     selectedLanguage?: string): AnnotationResultStoreResponse =>
    post(`${ACTIVE_ANNO_SERVICE_URL}${AnnotateRoutes.ANNOTATE_POST_ANNOTATIONS}`,
        annotationResult, jwt, selectedLanguage);

export const postCheckEnableConditions: Function = (request: CheckEnableConditionRequest, jwt: JWT,
                                                 selectedLanguage?: string): CheckEnableConditionResponse =>
    post(`${ACTIVE_ANNO_SERVICE_URL}${AnnotateRoutes.CHECK_ENABLE_CONDITIONS}`,
        request, jwt, selectedLanguage);