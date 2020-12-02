import callApi from "../common/callApi";
import { getDataSimpleSearchQuery } from "components/search/dataSearchQueryBuilder";
import viewerConstants from "components/data/viewers/constants";
import constants from "constants.js";
export const DATA_LISTING_QUERY_KEY = "fetchDataListing";
export const USER_INFO_QUERY_KEY = "fetchUserInfo";
export const RESOURCE_PERMISSIONS_KEY = "fetchResourcePermissions";
export const DATA_ROOTS_QUERY_KEY = "fetchDataRoots";
export const DATA_DETAILS_QUERY_KEY = "fetchDataDetails";
export const DATA_SEARCH_QUERY_KEY = "searchData";
export const INFO_TYPES_QUERY_KEY = "fetchInfoTypes";
export const FETCH_FILE_MANIFEST_QUERY_KEY = "fetchFileManifest";
export const READ_CHUNK_QUERY_KEY = "readChunk";
export const PUBLIC_LINKS_QUERY_KEY = "fetchPublicLinks";
export const MULTI_INPUT_PATH_LIST = "multi-input-path-list";
export const HT_ANALYSIS_PATH_LIST = "ht-analysis-path-list";

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
export const getFilesystemRoots = (key, userId, homePath, trashPath) => {
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
 * Search data
 *
 * @param {string} key
 * @param {object} query
 *
 * @returns {Promise<*>}
 */
export const searchData = (key, { query }) => {
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
export const searchDataInfinite = (
    key,
    { userHomeDir, searchTerm, rowsPerPage, sortField, sortDir },
    page = 0
) => {
    const query = getDataSimpleSearchQuery(
        searchTerm,
        userHomeDir,
        rowsPerPage,
        rowsPerPage * page,
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
 * @param {*} key - react-query key
 * @param {object} param - parameters for fetching manifest
 */
export const fileManifest = (key, path) => {
    return callApi({
        endpoint: `/api/filesystem/file/manifest?path=${encodeURIComponent(
            path
        )}`,
        method: "GET",
    });
};

/**
 * Read a chunk of a file
 * @param {*} key - react-query key
 * @param {*} param - parameters for reading the file chunk
 * @param {*} page - file seek position
 */
export const readFileChunk = (
    key,
    { path, chunkSize, separator },
    page = 0
) => {
    const body = {};
    body.path = path;
    body["chunk-size"] = `${chunkSize}`;
    if (separator) {
        body.page = page + 1;
        body.separator = encodeURIComponent(separator);
        return callApi({
            endpoint: "/api/filesystem/read-csv-chunk",
            method: "POST",
            body,
        });
    } else {
        const pos = page * viewerConstants.DEFAULT_PAGE_SIZE;
        body.position = `${pos}`;
        return callApi({
            endpoint: "/api/filesystem/read-chunk",
            method: "POST",
            body,
        });
    }
};

export const getPublicLinks = (key, paths) => {
    return callApi({
        endpoint: "/api/filesystem/anon-files",
        method: "POST",
        body: {
            paths,
        },
    });
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
    let endpoint = `/api/filesystem/path-list-creator?dest=${encodeURIComponent(
        dest
    )}&folders-only=${foldersOnly}&recursive=${recursive}&path-list-info-type=${encodeURIComponent(
        requestedInfoType
    )}`;
    if (pattern) {
        endpoint = `${endpoint}&name-pattern=${pattern}`;
    }
    if (selectedInfoTypes && selectedInfoTypes.length > 0) {
        let types = "";
        selectedInfoTypes.forEach((type) => {
            types = types.concat("&info-type=" + type);
        });
        endpoint = `${endpoint}${types}`;
    }
    return callApi({
        endpoint,
        method: "POST",
        body: {
            paths,
        },
    });
};
