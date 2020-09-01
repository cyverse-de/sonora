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
