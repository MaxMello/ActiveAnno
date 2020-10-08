import type {ManageListProject, ManageProject, ProjectStoreResponse} from "../types/manage/ManageTypes";
import type {JWT} from "../types/AuthenticationTypes";
import {get, post, put} from "./helper/HttpMethods";
import {ACTIVE_ANNO_SERVICE_URL} from "../constants/Constants";
import type {AnalyzeProjectRequest, AnalyzeProjectResponse} from "../types/manage/AnalyzeProjectResultsTypes";
import type {AnnotationID, ProjectID} from "../types/Types";
import type {AnnotationDefinition} from "../types/annotationdefinition/AnnotationDefinition";
import type {AnnotationGenerator, GenerateAnnotationsResponse} from "../types/annotationdefinition/AnnotationGenerator";

/*
 * Routes related to management activities like editing projects and annotation definitions.
 */

const ManageRoutes = {
    MANAGE_PROJECT_LIST: '/manage/project',
    MANAGE_PROJECT: '/manage/project/',
    MANAGE_POST_PROJECT: '/manage/project',
    MANAGE_PUT_PROJECT: '/manage/project/',

    ANALYZE_PROJECT_RESULTS: '/manage/project/analyzeResults',

    UPLOAD_DOCUMENTS_FOR_PROJECT: ['/manage/project/', '/document'],

    ANNOTATION_DEFINITION: '/manage/annotationDefinition',

    GENERATE_ANNOTATIONS: '/generators/generateAnnotations/project/',

    GET_ANNOTATION_GENERATORS: '/manage/annotationGenerator',
    UPDATE_GENERATOR: '/generators/update/',
};

export const getManageProjectList: Function = (params = null, jwt: JWT, selectedLanguage?: string):
    Array<ManageListProject> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.MANAGE_PROJECT_LIST}`, undefined, jwt,
        selectedLanguage);
};

export const getManageProject: Function = (projectID: number, jwt: JWT, selectedLanguage?: string): ManageProject => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.MANAGE_PROJECT}${projectID}`, undefined, jwt,
        selectedLanguage);
};

export const postManageProject: Function = (project: ManageProject, jwt: JWT, selectedLanguage?: string):
    ProjectStoreResponse =>
    post(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.MANAGE_POST_PROJECT}`, project, jwt, selectedLanguage);

export const putManageProject: Function = (project: ManageProject, jwt: JWT, selectedLanguage?: string):
    ProjectStoreResponse =>
    put(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.MANAGE_PUT_PROJECT}${project.id}`, project, jwt,
        selectedLanguage);

export const postAnalyzeProjectRequest: Function = (analyzeProjectRequest: AnalyzeProjectRequest, jwt: JWT,
                                                    selectedLanguage?: string): AnalyzeProjectResponse =>
    post(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.ANALYZE_PROJECT_RESULTS}`, analyzeProjectRequest, jwt,
        selectedLanguage);

// noinspection LongLine
export const postDocumentsForProject: Function = (request: { projectID: ProjectID, json: any }, jwt: JWT,
                                                  selectedLanguage?: string): AnalyzeProjectResponse =>
    post(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.UPLOAD_DOCUMENTS_FOR_PROJECT[0]}${request.projectID}${ManageRoutes.UPLOAD_DOCUMENTS_FOR_PROJECT[1]}`,
        request.json, jwt, selectedLanguage);


export const getAnnotationDefinitions: Function = (params = null, jwt: JWT, selectedLanguage?: string):
    Array<AnnotationDefinition> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.ANNOTATION_DEFINITION}`, undefined, jwt,
        selectedLanguage);
};

export const getAnnotationDefinition: Function = (annotationID: AnnotationID, jwt: JWT, selectedLanguage?: string):
    AnnotationDefinition => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.ANNOTATION_DEFINITION}/${annotationID}`,
        undefined, jwt, selectedLanguage);
};

export const updateAnnotationDefinition: Function = (annotationDefinition: AnnotationDefinition,
                                                     jwt: JWT, selectedLanguage?: string): AnnotationDefinition =>
    put(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.ANNOTATION_DEFINITION}/${annotationDefinition.id}`,
        annotationDefinition, jwt, selectedLanguage);


export const storeAnnotationDefinition: Function = (annotationDefinition: AnnotationDefinition,
                                                    jwt: JWT, selectedLanguage?: string): AnnotationDefinition =>
    post(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.ANNOTATION_DEFINITION}`,
        annotationDefinition, jwt, selectedLanguage);


export const generateAnnotationsForProject: Function = (project: ManageProject, jwt: JWT, selectedLanguage?: string): GenerateAnnotationsResponse => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.GENERATE_ANNOTATIONS}${project.id}`,
        undefined, jwt, selectedLanguage);
};

export const getAnnotationGenerators: Function = (params = null, jwt: JWT, selectedLanguage?: string):
    Array<AnnotationGenerator> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.GET_ANNOTATION_GENERATORS}`, undefined, jwt,
        selectedLanguage);
};

export const updateGenerator: Function = (generator: AnnotationGenerator, jwt: JWT, selectedLanguage?: string): AnnotationGenerator => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ManageRoutes.UPDATE_GENERATOR}${generator.id}`,
        undefined, jwt, selectedLanguage);
};