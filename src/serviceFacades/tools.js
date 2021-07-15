import callApi from "../common/callApi";

const TOOLS_QUERY_KEY = "fetchTools";
const TOOL_DETAILS_QUERY_KEY = "fetchToolDetails";
const APPS_USING_QUERY_KEY = "fetchAppsUsed";
const TOOL_TYPES_QUERY_KEY = "fetchToolTypes";
const ADMIN_TOOL_REQUESTS_QUERY_KEY = "fetchAdminToolRequests";
const ADMIN_TOOL_REQUEST_DETAILS_QUERY_KEY = "fetchAdminToolRequestDetails";

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
 * @property {boolean} displayAll - Filter to display all the tools or just users tools
 * @property {string} searchTerm - Tool search term.
 * @property {boolean} isAdmin - is this an admin request
 */

/**
 * Obtain a list of tools accessible to the user.
 * @param {string} _ - the string component of the query key
 * @param {ToolListingParams} queryParams - the listing parameters
 */
function getTools(
    _,
    {
        order,
        orderBy,
        page,
        rowsPerPage,
        displayAll,
        searchTerm,
        isAdmin = false,
    }
) {
    // Determine if the request is supposed to be ordered.
    const isOrdered = order && orderBy;

    // Determine if the request is supposed to be paginated.
    const isPaginated = (page || page === 0) && rowsPerPage;

    // Build the object containing the query parameters.
    const params = {};
    if (isOrdered) {
        params["sort-dir"] = order.toUpperCase();
        params["sort-field"] = orderBy.toLowerCase();
    }
    if (isPaginated) {
        params["limit"] = rowsPerPage;
        params["offset"] = page * rowsPerPage;
    }

    //displayAll can be true, false or null / undefined
    if (displayAll !== null && displayAll !== undefined) {
        params["public"] = displayAll;
    }

    if (searchTerm) {
        params["search"] = searchTerm;
    } else {
        params["search"] = "*";
    }

    return callApi({
        endpoint: isAdmin ? `/api/admin/tools` : `/api/tools`,
        method: "GET",
        params: params,
    });
}

function getToolPermissions({ tools }) {
    return callApi({
        endpoint: `/api/tools/permission-lister`,
        method: "POST",
        body: {
            tools,
        },
    });
}

function getToolDetails(_, { id, isAdmin = false }) {
    return callApi({
        endpoint: isAdmin ? `/api/admin/tools/${id}` : `/api/tools/${id}`,
        method: "GET",
    });
}

function getAppsUsed(_, { id }) {
    return callApi({
        endpoint: `/api/tools/${id}/apps`,
        method: "GET",
    });
}

function getToolTypes(_) {
    return callApi({
        endpoint: "/api/apps/elements/tool-types",
        method: "GET",
    });
}

function addTool(tool) {
    return callApi({
        endpoint: `/api/tools`,
        method: "POST",
        body: tool,
    });
}

function adminAddTool(tool) {
    return callApi({
        endpoint: `/api/admin/tools`,
        method: "POST",
        body: { tools: [tool] },
    });
}

function updateTool(tool) {
    return callApi({
        endpoint: `/api/tools/${tool.id}`,
        method: "PATCH",
        body: tool,
    });
}

function adminUpdateTool(tool) {
    return callApi({
        endpoint: `/api/admin/tools/${tool.id}`,
        method: "PATCH",
        body: tool,
    });
}

function toolRequest(request) {
    return callApi({
        endpoint: `/api/tool-requests`,
        method: "POST",
        body: request,
    });
}

function deleteTool({ id }) {
    return callApi({
        endpoint: `/api/tools/${id}`,
        method: "DELETE",
    });
}

function deleteTools({ ids: toolIds }) {
    return (
        toolIds &&
        toolIds.length > 0 &&
        Promise.all(toolIds.map((id) => deleteTool({ id })))
    );
}

function getAdminToolRequests(_, { order, orderBy }) {
    const isOrdered = order && orderBy;
    const params = {};
    if (isOrdered) {
        params["sort-dir"] = order.toUpperCase();
        params["sort-field"] = orderBy.toLowerCase();
    }

    return callApi({
        endpoint: `/api/admin/tool-requests`,
        method: "GET",
        params: params,
    });
}

function getAdminToolRequestDetails(_, { id }) {
    return callApi({
        endpoint: `/api/admin/tool-requests/${id}`,
        method: "GET",
    });
}

function adminUpdateToolRequest({ id, status, comments }) {
    return callApi({
        endpoint: `/api/admin/tool-requests/${id}/status`,
        method: "POST",
        body: {
            status,
            comments,
        },
    });
}

export {
    getTools,
    getToolPermissions,
    getToolDetails,
    TOOLS_QUERY_KEY,
    TOOL_DETAILS_QUERY_KEY,
    APPS_USING_QUERY_KEY,
    TOOL_TYPES_QUERY_KEY,
    ADMIN_TOOL_REQUESTS_QUERY_KEY,
    ADMIN_TOOL_REQUEST_DETAILS_QUERY_KEY,
    getAppsUsed,
    getToolTypes,
    addTool,
    updateTool,
    toolRequest,
    deleteTools,
    adminAddTool,
    adminUpdateTool,
    getAdminToolRequests,
    getAdminToolRequestDetails,
    adminUpdateToolRequest,
};
