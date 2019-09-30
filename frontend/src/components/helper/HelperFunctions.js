export function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

export function buildDeepObject(keys: Array<string>, obj: Object, newValue: any, index: number) {
    if(index === keys.length - 1) {
        return {
            ...obj,
            [[keys[index]]]: newValue
        }
    } else if(index < keys.length - 1) {
        return {
            ...obj,
            [[keys[index]]]: {
                ...buildDeepObject(keys, obj[keys[index]], newValue, index + 1)
            }
        }
    } else {
        return undefined;
    }
}