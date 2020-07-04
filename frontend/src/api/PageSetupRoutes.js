// @flow

import {get} from './helper/HttpMethods';
import {ACTIVE_ANNO_SERVICE_URL} from "../constants/Constants";
import type {JWT} from "../types/AuthenticationTypes";
import type {PageSetup} from "../types/pagesetup/PageSetupTypes";

const PageSetupRoutes: Object = {
    LOAD: '/pageSetup'
};

export const load: Function = (params = null, jwt: JWT, selectedLanguage?: string): PageSetup => {
    return get(`${ACTIVE_ANNO_SERVICE_URL}${PageSetupRoutes.LOAD}`, undefined, jwt, selectedLanguage);
};


