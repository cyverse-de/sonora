import { useState, useLayoutEffect } from "react";

/**
 * @author aramsey
 *
 * Get and set the selected key in the browser's local storage
 * At least in dev mode, with HMR, `window` can sometimes be undefined. Wrapped
 * in try/catch due to this.
 * @returns {null|string[]}
 */
export function getLocalStorage(key) {
    try {
        return window.localStorage.getItem(key)?.split(",");
    } catch (error) {
        return null;
    }
}

export function setLocalStorage(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        return;
    }
}

/**
 * @author johnworth
 *
 * Custom hook for accessing and setting values in localStorage. Should be
 * SSR-safe.
 *
 * @param {string} key
 * @param {*} initialValue
 * @returns {Array}
 */
export const useLocalStorage = (key, initialValue) => {
    // effectively caches the value from localStorage.
    const [value, setValue] = useState(initialValue);

    // Should update the state from localStorage before rendering
    // preventing an annoying flash as the state updates.
    useLayoutEffect(() => {
        const currValue = getLocalStorage(key);
        if (currValue === null) {
            setValue(initialValue);
        } else {
            setValue(currValue);
        }
    }, [key, initialValue]);

    const setValueFn = (newValue) => {
        setValue(newValue);
        setLocalStorage(key, newValue);
    };

    return [value, setValueFn];
};
