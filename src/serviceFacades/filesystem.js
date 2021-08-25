import callApi from "../common/callApi";
import { getDataSimpleSearchQuery } from "components/search/dataSearchQueryBuilder";
import viewerConstants from "components/data/viewers/constants";
import constants from "constants.js";
export const DATA_LISTING_QUERY_KEY = "fetchDataListing";
export const USER_INFO_QUERY_KEY = "fetchUserInfo";
export const RESOURCE_PERMISSIONS_KEY = "fetchResourcePermissions";
export const DATA_ROOTS_QUERY_KEY = "fetchDataRoots";
export const DATA_DETAILS_QUERY_KEY = "fetchDataDetails";
export const DATA_DETAILS_FROM_PAGE_QUERY_KEY = "fetchDataDetailsFromPage";
export const DATA_SEARCH_QUERY_KEY = "searchData";
export const INFO_TYPES_QUERY_KEY = "fetchInfoTypes";
export const FETCH_FILE_MANIFEST_QUERY_KEY = "fetchFileManifest";
export const READ_CHUNK_QUERY_KEY = "readChunk";
export const READ_RAW_CHUNK_QUERY_KEY = "readRawChunk";
export const PUBLIC_LINKS_QUERY_KEY = "fetchPublicLinks";
export const MULTI_INPUT_PATH_LIST = "multi-input-path-list";
export const HT_ANALYSIS_PATH_LIST = "ht-analysis-path-list";

/**
 * Get details on data resources
 * @param paths - An array of strings which are resource paths
 * @returns {Promise<any>}
 */
export const getResourceDetails = ({ paths }) => {
    return callApi({
        endpoint: "/api/filesystem/stat",
        method: "POST",
        body: { paths },
    });
};

/**
 * Get permissions for data resources
 * @param paths - An array of strings which are resource paths
 * @returns {Promise<any>}
 */
export const getResourcePermissions = ({ paths }) => {
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
 * @param path - The resource path
 * @param rowsPerPage - The number of rows per page
 * @param orderBy - A column to order items by
 * @param order - Ascending or Descending
 * @param page - The page number or offset
 * @returns {Promise<any>}
 */
export const getPagedListing = (path, rowsPerPage, orderBy, order, page) => {
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
export const getFilesystemRoots = ({ userId, homePath, trashPath }) => {
    return userId
        ? callApi({
              endpoint: `/api/filesystem/root`,
          })
        : Promise.resolve({
              roots: [
                  {
                      path: `${homePath}/${constants.ANONYMOUS_USER}`,
                      label: constants.ANONYMOUS_USER,
                  },
                  {
                      path: `${homePath}/shared`,
                      label: constants.COMMUNITY_DATA,
                  },
                  {
                      path: homePath,
                      label: constants.SHARED_WITH_ME,
                  },
                  {
                      path: `${trashPath}/${constants.ANONYMOUS_USER}`,
                      label: constants.TRASH,
                  },
              ],
              "base-paths": {
                  user_home_path: `${homePath}/${constants.ANONYMOUS_USER}`,
                  user_trash_path: `${trashPath}/${constants.ANONYMOUS_USER}`,
                  base_trash_path: trashPath,
              },
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

/**
 * Rename a file or folder
 * @param {object} param - destination and source.
 *  @returns {Promise<*>}
 */
export const rename = ({ dest, source }) => {
    return callApi({
        endpoint: "/api/filesystem/rename",
        method: "POST",
        body: { dest, source },
    });
};

/**
 * Search data
 *
 * @param {string} key
 * @param {object} query
 *
 * @returns {Promise<*>}
 */
export const searchData = ({ query }) => {
    return callApi({
        endpoint: "/api/filesystem/search",
        method: "POST",
        body: query,
    });
};
/**
 * Search data
 * @param {string} key - react-query key
 * @param {object} param - parameters for searching data.
 * @param {integer} page - the page to retrieve. The last parameter must be the page number as required by react-query useInfiniteQuery.
 */
export const searchDataInfinite = ({
    userHomeDir,
    searchTerm,
    rowsPerPage,
    sortField,
    sortDir,
    pageParam,
}) => {
    const query = getDataSimpleSearchQuery(
        searchTerm,
        userHomeDir,
        rowsPerPage,
        rowsPerPage * pageParam,
        sortField,
        sortDir
    );
    return callApi({
        endpoint: "/api/filesystem/search",
        method: "POST",
        body: query,
    });
};

/**
 * Get file manifest
 * @param {object} param - parameters for fetching manifest
 */
export const fileManifest = (path) => {
    return callApi({
        endpoint: `/api/filesystem/file/manifest?path=${encodeURIComponent(
            path
        )}`,
        method: "GET",
    });
};

/**
 * Read a chunk of a file
 * @param {*} param - parameters for reading the file chunk
 * @param {*} page - file seek position
 */
export const readFileChunk = ({
    path,
    chunkSize,
    separator,
    pageParam = 0,
}) => {
    const body = {};
    body.path = path;
    body["chunk-size"] = `${chunkSize}`;
    if (separator) {
        body.page = pageParam + 1;
        body.separator = encodeURIComponent(separator);
        return callApi({
            endpoint: "/api/filesystem/read-csv-chunk",
            method: "POST",
            body,
        });
    } else {
        const pos = pageParam * viewerConstants.DEFAULT_PAGE_SIZE;
        body.position = `${pos}`;
        return callApi({
            endpoint: "/api/filesystem/read-chunk",
            method: "POST",
            body,
        });
    }
};

export const getPublicLinks = (paths) => {
    return callApi({
        endpoint: "/api/filesystem/anon-files",
        method: "POST",
        body: {
            paths,
        },
    });
};

export const refreshCache = ({ paths }) => {
    return (
        paths &&
        paths.length > 0 &&
        Promise.all(
            paths.map((path) =>
                callApi({
                    endpoint: `/api/filesystem/refresh-cache?path=${path}`,
                    method: "GET",
                })
            )
        )
    );
};

export const pathListCreator = ({
    paths,
    dest,
    pattern,
    foldersOnly,
    recursive,
    requestedInfoType,
    selectedInfoTypes,
}) => {
    const params = {};
    params["recursive"] = recursive;
    params["path-list-info-type"] = requestedInfoType;
    params["dest"] = dest;
    params["folders-only"] = foldersOnly;
    if (pattern) {
        params["name-pattern"] = pattern;
    }
    if (selectedInfoTypes && selectedInfoTypes.length > 0) {
        params["info-type"] = selectedInfoTypes;
    }
    return callApi({
        endpoint: "/api/filesystem/path-list-creator",
        method: "POST",
        body: {
            paths,
        },
        params,
    });
};

export const restore = (paths) => {
    return callApi({
        endpoint: "/api/filesystem/restore",
        method: "POST",
        body: paths,
    });
};

export const emptyTrash = () => {
    return callApi({
        endpoint: "/api/filesystem/trash",
        method: "DELETE",
    });
};

export const move = ({ sources, dest }) => {
    return callApi({
        endpoint: "/api/filesystem/move",
        method: "POST",
        body: {
            dest,
            sources,
        },
    });
};

export const copyMetadata = ({ source_id, destination_ids }) => {
    return callApi({
        endpoint: `/api/filesystem/${source_id}/metadata/copy`,
        method: "POST",
        body: { destination_ids },
    });
};
