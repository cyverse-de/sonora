import callApi from "../common/callApi";

export const DATA_LISTING_QUERY_KEY = "fetchDataListing";
export const USER_INFO_QUERY_KEY = "fetchUserInfo";
export const RESOURCE_PERMISSIONS_KEY = "fetchResourcePermissions";
export const DATA_ROOTS_QUERY_KEY = "fetchDataRoots";

/**
 * Get details on data resources
 * @param key - Query key for react-query
 * @param paths - An array of strings which are resource paths
 * @returns {Promise<any>}
 */
export const getResourceDetails = (key, { paths }) => {
    return callApi({
        endpoint: "/api/filesystem/stat",
        method: "POST",
        body: { paths },
    });
};

/**
 * Get permissions for data resources
 * @param key - Query key for react-query
 * @param paths - An array of strings which are resource paths
 * @returns {Promise<any>}
 */
export const getResourcePermissions = (key, { paths }) => {
    return callApi({
        endpoint: "/api/filesystem/user-permissions",
        method: "POST",
        body: { paths },
    });
};

/**
 * Update the info type for a data resource
 * @param path - The resource path
 * @param infoType - The new info type
 * @returns {Promise<any>}
 */
export const updateInfoType = ({ path, infoType }) => {
    return callApi({
        endpoint: `/api/filetypes/type`,
        method: "POST",
        body: {
            path,
            type: infoType,
        },
    });
};

/**
 * Get a paged directory listing
 * @param key - Query key for react-query
 * @param path - The resource path
 * @param rowsPerPage - The number of rows per page
 * @param orderBy - A column to order items by
 * @param order - Ascending or Descending
 * @param page - The page number or offset
 * @returns {Promise<any>}
 */
export const getPagedListing = (
    key,
    path,
    rowsPerPage,
    orderBy,
    order,
    page
) => {
    return callApi({
        endpoint: `/api/filesystem/paged-directory?path=${encodeURIComponent(
            path
        )}&limit=${rowsPerPage}&sort-col=${orderBy}&sort-dir=${order}&offset=${
            rowsPerPage * page
        }`,
    });
};

/**
 * Get the list of directory roots available to a user
 * @returns {Promise<any>}
 */
export const getFilesystemRoots = () => {
    return callApi({
        endpoint: `/api/filesystem/root`,
    });
};

/**
 * Get a list of all accepted info types
 * @returns {Promise<any>}
 */
export const getInfoTypes = () => {
    return callApi({
        endpoint: `/api/filetypes/type-list`,
    });
};

/**
 * Delete a resource
 * @param paths - An array of strings which are resource paths
 * @returns {Promise<*>}
 */
export const deleteResources = ({ paths }) => {
    return callApi({
        endpoint: "/api/filesystem/delete",
        method: "POST",
        body: { paths },
    });
};

/**
 * Create a data directory
 * @param path - The resource path
 * @returns {Promise<*>}
 */
export const createFolder = ({ path }) => {
    return callApi({
        endpoint: "/api/filesystem/directory/create",
        method: "POST",
        body: { path },
    });
};
