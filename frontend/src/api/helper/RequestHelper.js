// @flow
import * as StatusCode from 'http-status-codes';
import type {JWT} from "../../types/AuthenticationTypes";
import type {HttpError} from "../../types/Types";

/**
 * Enumeration for the request method types which can be used.
 *
 * @type {{GET: string, POST: string, PUT: string, DELETE: string}}
 */
export const RequestMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

const httpError = (statusCode: number, statusText: string): HttpError => {
    return {
        statusCode,
        statusText
    };
};

/**
 * Checks whether the server has delivered a 200 response. If not so, an error is thrown.
 *
 * @param response The response of the server.
 * @return The response of the server as JSON.
 * @throws HttpError if the response status code is 400+ or < 200
 */
export const checkServerResponse = (response: Object): Object => {
    if (response && response.status >= StatusCode.OK && response.status < StatusCode.BAD_REQUEST) {
        return response.json();
    } else {
        throw httpError(response.status, response.statusText ? response.statusText : "Unknown status");
    }
};

/**
 * Defines the header which should be used in each request.
 *
 * @return {{Accept: string, ContentType: string}} An object which contains the headers which will be used in a request.
 */
export const defaultHeaders = (): Object => ({
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
});

/**
 * Helper method to get the default request configuration.
 *
 * @param method The used HTTP request method.
 * @param data The data to send in the body of the request.
 * @param jwt Optional jwt object
 * @param selectedLanguage optionally specify the selected language
 * @return {{method: *, headers: *, body: *}} The default request configuration.
 */
export const requestConfig = (method: any, data?: Object, jwt?: JWT, selectedLanguage?: string): Object => {
    let languages: Array<string> = navigator.languages.concat();
    if(selectedLanguage != null) {
        if(languages.includes(selectedLanguage)) {
            languages = languages.filter(l => l !== selectedLanguage);
        }
        languages.unshift(selectedLanguage);
    }
    return {
        method: method,
        headers: {
            ...defaultHeaders(),
            ...(jwt ? {'Authorization': `Bearer ${jwt.token}`} : undefined),
            ...{"Accept-Language": languages.join(",")}
        },
        body: data ? JSON.stringify(data) : null
    }
};
