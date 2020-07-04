// @flow

import {checkServerResponse, requestConfig, RequestMethod} from './RequestHelper';
import type {JWT} from "../../types/AuthenticationTypes";
import type {AnyObject} from "../../types/Types";

const convertObjectToGetParameters: Function = (object: AnyObject): string => object
    ? Object.keys(object).map(key => `${key}=${object[key]}`).join('&') : '';

/**
 * Method which will call the given url with the given parameters. As result, an object is expected.
 *
 * @param url The URL which should be called.
 * @param params Object which will be converted to parameters.
 * @param jwt Optional jwt string
 * @param selectedLanguage optional current selected language
 */
export const get: Function = async (url: string, params: any, jwt?: JWT, selectedLanguage?: string):
    Promise<Array<any>> =>
    checkServerResponse(await fetch(`${url}?${convertObjectToGetParameters(params)}`,
        requestConfig(RequestMethod.GET, undefined, jwt, selectedLanguage)));

/**
 * Method which will post the body data to the given url. As response an object is expected.
 *
 * @param url The URL which should be called.
 * @param body The request body which will be sent to the server.
 * @param jwt Optional jwt string
 * @param selectedLanguage optional current selected language
 */
export const post: Function = async (url: string, body: any, jwt?: JWT, selectedLanguage?: string): Promise<any> =>
    checkServerResponse(await fetch(url, requestConfig(RequestMethod.POST, body, jwt, selectedLanguage)));

/**
 * Method which will post the body data to the given url. As response an object is expected.
 *
 * @param url The URL which should be called.
 * @param body The request body which will be sent to the server.
 * @param jwt Optional jwt string
 * @param selectedLanguage optional current selected language
 */
export const put: Function = async (url: string, body: any, jwt?: JWT, selectedLanguage?: string): Promise<any> =>
    checkServerResponse(await fetch(url, requestConfig(RequestMethod.PUT, body, jwt, selectedLanguage)));
