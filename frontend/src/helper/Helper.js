// @flow

import type {Dictionary} from "../types/Types";
import CryptoJS from "crypto-js";
import moment from "moment";

export const normalize: Function = (array: Array<Object>, injected?: Object, idKey: string = "id") => {
    const normalized: Dictionary = {};
    array.forEach(element => normalized[element[idKey]] = {...element, ...(injected !== undefined ? injected : {})});
    return normalized;
};

export const normalizeObject: Function = (object: Object) => {
    return {
        [object.id]: object
    };
};

/**
 * For debug cases and when no real authorization and authentication is required, this can be used to generate
 * a super user token for any user identifier.
 * Based on this CodePen: https://codepen.io/jpetitcolas/pen/zxGxKN
 * @param userIdentifier: Some unique identifier like a unique name or email
 * @returns {string} The base64 encoded full JWT
 */
export const generateSuperUserJWT: Function = (userIdentifier: string) => {
    // Defining our token parts
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    };

    const data = {
        "sub": userIdentifier,
        "name": `SU ${userIdentifier}`,
        "roles": [
            "activeanno_admin",
            "activeanno_manager",
            "activeanno_user",
            "activeanno_producer",
            "activeanno_consumer",
            "activeanno_global_search"
        ]
    };

    const secret = "This it not secure";

    function base64url(source) {
        return CryptoJS.enc.Base64.stringify(source).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    }

    const encodedHeader = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
    const encodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(data)));
    const signature = base64url(CryptoJS.HmacSHA256(encodedHeader + "." + encodedData, secret));
    return encodedHeader + "." + encodedData + "." + signature;
};


export function formatByMoment(d: string, formatString: string) {
    let dateInput;
    if(isNaN(d)) {
        dateInput = d;
    } else {
        dateInput = Number(d);
    }
    return moment(dateInput).format(formatString);
}