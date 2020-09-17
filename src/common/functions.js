import isPlainObject from "is-plain-object";
import camelCase from "camelcase";

/**
 * A callback that can transform strings passed to it.
 * @callback stringTransformer
 * @param {string} s - The string to change.
 * @returns {string} The string after it's been changed.
 */

/**
 * deepMapKeys recursively transforms the keys in the map using the provided
 * callback function.
 * @param {*} obj - An object that has keys that require modifying. If it's not
 *      a plain object, it will be returned unchanged.
 * @param {stringTransformer} callback  - A function that transforms the
 *      strings passed to it. (x) => string.
 * @returns {*} - The new version of the object with the keys modified by the
 *      callback.
 */
export function deepMapKeys(obj, callback) {
    if (obj == null) {
        return null;
    }

    return typeof obj === "string"
        ? obj
        : Array.isArray(obj)
        ? obj.map((item) => deepMapKeys(item, callback))
        : isPlainObject(obj)
        ? Object.fromEntries(
              Object.entries(obj).map(([key, value]) => [
                  callback(key),
                  deepMapKeys(value, callback),
              ])
          )
        : obj;
}

/**
 * camelcaseit - Recursively iterates through the provided object and changes
 * all keys to camelCase.
 *
 * @param obj An object that has keys that need to be camelCased.
 * @returns A new version of the object with the keys camcelCased.
 */
export const camelcaseit = (obj) => deepMapKeys(obj, camelCase);

/**
 * A function that will take a list and group the list based on a
 * classification function
 * @param list A list of any type
 * @param keyFn A function used to classify each item in the list
 * @param valueFn A function used to calculate the value for each item
 * @returns A map whose keys are the set of classifications and whose
 * values are an array containing all items that match that classification
 */
export const groupBy = (list, keyFn, valueFn) => {
    return list.reduce((acc, item) => {
        const key = keyFn(item);
        return {
            ...acc,
            [key]: (acc[key] || []).concat(valueFn ? valueFn(item) : item),
        };
    }, {});
};
