// @flow

import {get, post, put} from './HttpMethods'
import {
    ACTIVE_ANNO_SERVICE_URL,
    AUTHENTICATION_SERVICE_URL,
    GENERATE_SUPERUSER_ON_LOGIN
} from "../constants/Constants";
import type {AnnotationConfigFull, AnnotationConfigMinimal, AnnotationDocument} from "../types/AnnotationTypes";
import type {JWT, UserCredentials} from "../types/AuthenticationTypes";
import type {PageSetup} from "../types/PageSetupTypes";
import type {CurationDocument} from "../types/CurateTypes";
import {generateSuperUserJWT} from "../helper/Helper";
import type {ManageConfigFull, ManageConfigMinimal} from "../types/ManageTypes";

const ActiveAnnoService: Object = {
    LOAD: '/pageSetup',

    ANNOTATE_CONFIG_LIST: '/annotate/config',
    ANNOTATE_CONFIG: '/annotate/config/',
    ANNOTATE_DATA_FOR_CONFIG: ['/annotate/config/', '/document'],
    ANNOTATE_POST_ANNOTATIONS: '/annotate/annotation',

    CURATE_CONFIG_LIST: '/curate/config',
    CURATE_CONFIG: '/curate/config/',
    CURATE_DATA_FOR_CONFIG: ['/curate/config/', '/document'],
    CURATE_POST_ANNOTATIONS: '/curate/annotation',

    MANAGE_CONFIG_LIST: '/manage/config',
    MANAGE_CONFIG: '/manage/config/',
    MANAGE_POST_CONFIG: '/manage/config',
    MANAGE_PUT_CONFIG: '/manage/config/'
};

export const getJWT: Function = (body: UserCredentials): JWT => {
    if(GENERATE_SUPERUSER_ON_LOGIN) {
        return {
            "token": generateSuperUserJWT(body.username)
        };
    } else {
        return post(AUTHENTICATION_SERVICE_URL, body);
    }
};

export const load: Function = (params = null, jwt: JWT): PageSetup => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.LOAD}`, undefined, jwt);
};

export const getAnnotateConfigs: Function = (params = null, jwt: JWT): Array<AnnotationConfigMinimal> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.ANNOTATE_CONFIG_LIST}`, undefined, jwt);
};

export const getAnnotateConfig: Function = (configID: number, jwt: JWT): AnnotationConfigFull => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.ANNOTATE_CONFIG}${configID}`, undefined, jwt);
};

export const getDataForAnnotateConfig: Function = (body: any, jwt: JWT): Array<AnnotationDocument> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.ANNOTATE_DATA_FOR_CONFIG[0]}${body.configID}${ActiveAnnoService.ANNOTATE_DATA_FOR_CONFIG[1]}`, {"ignoreDocuments": body.ignoreDocuments.join(",")}, jwt);
};

export const postAnnotationsAsAnnotator: Function = (annotations: Array<Object>, jwt: JWT): Object => post(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.ANNOTATE_POST_ANNOTATIONS}`, annotations, jwt);


export const getCurateConfigList: Function = (params = null, jwt: JWT): Array<AnnotationConfigMinimal> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.CURATE_CONFIG_LIST}`, undefined, jwt);
};

export const getCurateConfig: Function = (configID: number, jwt: JWT): AnnotationConfigFull => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.CURATE_CONFIG}${configID}`, undefined, jwt);
};

export const getDataForCurateConfig: Function = (body: any, jwt: JWT): Array<CurationDocument> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.CURATE_DATA_FOR_CONFIG[0]}${body.configID}${ActiveAnnoService.CURATE_DATA_FOR_CONFIG[1]}`, {"ignoreDocuments": body.ignoreDocuments.join(",")}, jwt);
};

export const postAnnotationsAsCurator: Function = (annotations: Array<Object>, jwt: JWT): Object => post(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.CURATE_POST_ANNOTATIONS}`, annotations, jwt);


export const getManageConfigList: Function = (params = null, jwt: JWT): Array<ManageConfigMinimal> => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.MANAGE_CONFIG_LIST}`, undefined, jwt);
};

export const getManageConfig: Function = (configID: number, jwt: JWT): ManageConfigFull => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.MANAGE_CONFIG}${configID}`, undefined, jwt);
};

export const postManageConfig: Function = (config: ManageConfigFull, jwt: JWT): Object => post(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.MANAGE_POST_CONFIG}`, config, jwt);

export const putManageConfig: Function = (config: ManageConfigFull, jwt: JWT): Object => put(`${ACTIVE_ANNO_SERVICE_URL}${ActiveAnnoService.MANAGE_PUT_CONFIG}${config.id}`, config, jwt);

