/**
 * Shared detection and handling for gateway maintenance-mode responses.
 *
 * When the gateway enters maintenance mode it answers API/XHR requests with a
 * 503 carrying an `x-maintenance-mode: true` header and/or a `{ maintenance:
 * true }` body. Detecting either signal lets the client force a hard navigation
 * so the browser re-requests the page as a document and lands on the
 * maintenance page served by the gateway.
 *
 * @module common/maintenance
 */

const RELOADING_FLAG = "__deMaintenanceReloading";

/**
 * Reads a header value from either an axios-style headers object (plain object
 * with lowercased keys) or a fetch `Headers` instance.
 *
 * @param {Object|Headers} headers - The response headers.
 * @param {string} name - The header name (lowercase).
 * @returns {string|undefined}
 */
const getHeader = (headers, name) => {
    if (!headers) {
        return undefined;
    }
    if (typeof headers.get === "function") {
        return headers.get(name);
    }
    return headers[name];
};

/**
 * Determines whether a response indicates the gateway is in maintenance mode.
 * Accepts either signal so axios- and fetch-based callers behave identically.
 *
 * @param {Object} response - The response to inspect.
 * @param {number} response.status - The HTTP status code.
 * @param {Object|Headers} [response.headers] - The response headers.
 * @param {*} [response.data] - The parsed response body, if available.
 * @returns {boolean}
 */
export const isMaintenanceResponse = ({ status, headers, data } = {}) =>
    status === 503 &&
    (getHeader(headers, "x-maintenance-mode") === "true" ||
        data?.maintenance === true);

/**
 * Forces a hard reload onto the gateway's maintenance page, guarding against
 * many concurrent in-flight calls each triggering a repeat reload. Browser-only;
 * a no-op when `window` is undefined (e.g. server-side rendering).
 *
 * @returns {boolean} Whether a maintenance reload is in progress, so callers can
 *      avoid surfacing error UI before the page tears down.
 */
export const triggerMaintenanceReload = () => {
    if (typeof window === "undefined") {
        return false;
    }
    if (!window[RELOADING_FLAG]) {
        window[RELOADING_FLAG] = true;
        window.location.reload();
    }
    return true;
};
