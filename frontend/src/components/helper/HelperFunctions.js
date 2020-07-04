// @flow
import type {AnyObject} from "../../types/Types";

export function isArray (value: mixed): boolean {
    return value !== null && typeof value === 'object' && value.constructor === Array;
}

export function buildDeepObject(keys: Array<string>, obj: AnyObject, newValue: any, index: number) {
    const key: string = keys[index]
    if(index === keys.length - 1) {
        return {
            ...obj,
            [key]: newValue
        }
    } else if(index < keys.length - 1) {
        return {
            ...obj,
            [key]: {
                ...buildDeepObject(keys, obj[keys[index]], newValue, index + 1)
            }
        }
    } else {
        return undefined;
    }
}