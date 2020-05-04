import callApi from "../common/callApi";

/**
 * Obtain a list of tools accessible to the user.
 * @param {string} _ - The string component of the query key
 * @param {Object} queryParams - The query parameers
 */
function getTools(_, { order, orderBy }) {
    // Build the object containing the query parameters.
    const query = {};
    if (order !== null && order !== undefined) {
        query["sort-dir"] = order.toUpperCase();
    }
    if (orderBy !== null && orderBy !== undefined) {
        query["sort-field"] = orderBy.toLowerCase();
    }

    return callApi({
        endpoint: `/api/tools`,
        method: "GET",
        query: query,
    });
}

export { getTools };
