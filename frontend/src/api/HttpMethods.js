// @flow

import {checkServerResponse, requestConfig, RequestMethod} from './RequestHelper';

const convertObjectToGetParameters: Function = (object: Object): string => object ? Object.keys(object).map(key => `${key}=${object[key]}`).join('&') : '';

/**
 * Method which will call the given url with the given parameters. As result, an object is expected.
 *
 * @param url The URL which should be called.
 * @param params Object which will be converted to parameters.
 * @param jwt Optional jwt string
 */
export const get: Function = async (url: string, params: Object, jwt?: string): Promise<Array<Object>> => checkServerResponse(await fetch(`${url}?${convertObjectToGetParameters(params)}`, requestConfig(RequestMethod.GET, undefined, jwt)));

/**
 * Method which will post the body data to the given url. As response an object is expected.
 *
 * @param url The URL which should be called.
 * @param body The request body which will be sent to the server.
 * @param jwt Optional jwt string
 */
export const post: Function = async (url: string, body: any, jwt?: string): Promise<Object> => checkServerResponse(await fetch(url, requestConfig(RequestMethod.POST, body, jwt)));

/**
 * Method which will post the body data to the given url. As response an object is expected.
 *
 * @param url The URL which should be called.
 * @param body The request body which will be sent to the server.
 * @param jwt Optional jwt string
 */
export const put: Function = async (url: string, body: any, jwt?: string): Promise<Object> => checkServerResponse(await fetch(url, requestConfig(RequestMethod.PUT, body, jwt)));
