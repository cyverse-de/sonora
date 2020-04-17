/**
 * @author aramsey
 *
 * A function intended for usage with react-query's `isFetching` or `status` values to determine
 * if a query is loading.  This can also accept an array of those values and return the final result.
 *
 * @param status
 * @returns {boolean}
 */

export default function isQueryLoading(status) {
    const type = typeof status;
    switch (type) {
        case "boolean":
            return status;
        case "string":
            return "loading" === status;
        case "object":
            if (Array.isArray(status)) {
                return status.reduce(
                    (acc, item) => acc || isQueryLoading(item),
                    false
                );
            } else {
                return false;
            }
        default:
            return false;
    }
}
