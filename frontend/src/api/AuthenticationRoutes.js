import type {JWT, UserCredentials} from "../types/AuthenticationTypes";
import {AUTHENTICATION_SERVICE_URL, GENERATE_SUPERUSER_ON_LOGIN} from "../constants/Constants";
import {generateSuperUserJWT} from "../helper/Helper";
import {post} from "./helper/HttpMethods";

/**
 * Get the JWT either calculated in GENERATE_SUPERUSER_ON_LOGIN mode, or by posting the user credentials to the
 * Auth service.
 */
export const getJWT: Function = (body: UserCredentials): JWT => {
    if (GENERATE_SUPERUSER_ON_LOGIN) {
        return {
            "token": generateSuperUserJWT(body.username)
        };
    } else {
        return post(AUTHENTICATION_SERVICE_URL, body);
    }
};