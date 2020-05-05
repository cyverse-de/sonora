import callApi from "../common/callApi";

/**
 * The parameters accepted by a tool listing request. Sorting will only be
 * attempted if both `order` and `orderBy` are specified. Similarly, paging
 * will only be attempted if both `page` and `rowsPerPage` are specified.
 *
 * @typedef {Object} ToolListingParams
 * @property {String} order - the sort order (asc, desc, ASC, or DESC)
 * @property {String} orderBy - the field to sort results by (name)
 * @property {number} page - the page number to display
 * @property {number} rowsPerPage - the number of rows in a single page
 */

/**
 * Obtain a list of tools accessible to the user.
 * @param {string} _ - the string component of the query key
 * @param {ToolListingParams} queryParams - the listing parameters
 */
function getTools(_, { order, orderBy, page, rowsPerPage }) {
    // Determine if the request is supposed to be ordered.
    const isOrdered =
        order !== null &&
        order !== undefined &&
        orderBy != null &&
        orderBy !== undefined;

    // Determine if the request is supposed to be paginated.
    const isPaginated =
        page !== null &&
        page !== undefined &&
        rowsPerPage != null &&
        rowsPerPage !== undefined;

    // Build the object containing the query parameters.
    const query = {};
    if (isOrdered) {
        query["sort-dir"] = order.toUpperCase();
        query["sort-field"] = orderBy.toLowerCase();
    }
    if (isPaginated) {
        query["limit"] = rowsPerPage;
        query["offset"] = page * rowsPerPage;
    }

    return callApi({
        endpoint: `/api/tools`,
        method: "GET",
        query: query,
    });
}

export { getTools };
