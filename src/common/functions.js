import _ from 'lodash';

/**
 * deepMapKeys recursively transforms the keys in the map using the provided
 * callback function.
 * 
 * @param obj An object that has keys that require modifying.
 * @param callback A function that transforms the strings passed to it. (x) => string.
 * @returns The new version of the object with the keys modified by the callback.
 */
export function deepMapKeys(obj, callback) {
    return _.isString(obj) ?
        obj
    :
    _.isArray(obj) ?
        _.map(obj, item => deepMapKeys(item, callback))
    :
    _.isPlainObject(obj) ?
        _.fromPairs(
            _.toPairsIn(obj).map(
                ([key, value]) => [ callback(key), deepMapKeys(value, callback) ]
            )
        )
    :
    obj
}

/**
 * camelcaseit - Recursively iterates through the provided object and changes
 * all keys to camelCase.
 * 
 * @param obj An object that has keys that need to be camelCased.
 * @returns A new version of the object with the keys camcelCased.
 */
export const camelcaseit = (obj) => deepMapKeys(obj, _.camelCase);