/**
 * @author sriram, psarando
 *
 */

import constants from "../../constants";
import NavigationConstants from "../../common/NavigationConstants";

import DataConstants from "./constants";
import Permissions, { permissionHierarchy } from "../models/Permissions";
import ResourceTypes from "components/models/ResourceTypes";

/**
 * Encode given path
 *
 * @param {string} path - path selected by user
 * @returns {string} encoded path
 */
function getEncodedPath(path) {
    const encodedPath = path
        .split(constants.PATH_SEPARATOR)
        .map((item) => encodeURIComponent(item))
        .join(constants.PATH_SEPARATOR);
    return encodedPath;
}

/**
 * Builds a path to the page of the given folder's data store path.
 *
 * @param {string} folderPath The data store path to the folder.
 */
const getFolderPage = (folderPath) =>
    `${constants.PATH_SEPARATOR}${NavigationConstants.DATA}${constants.PATH_SEPARATOR}${constants.DATA_STORE_STORAGE_ID}${folderPath}`;

const validateDiskResourceName = (name, i18nFn) => {
    if (name === "") {
        return i18nFn("data:validationEmptyDiskResourceName");
    }
    if (name === "." || name === "..") {
        return i18nFn("data:validationDiskResourceName");
    }

    const illegalChars = name?.match(DataConstants.NAME_INVALID_CHARS_REGEX);

    if (illegalChars) {
        const charList = [...new Set(illegalChars)]
            .map((c) => {
                if (c === "\n") return "\\n";
                if (c === "\t") return "\\t";
                return c;
            })
            .join("");

        return i18nFn("data:validationInvalidCharacters", {
            charList,
        });
    }

    return null;
};

const hasOwn = (permission) => {
    return Permissions.OWN === permission;
};

const isWritable = (permission) => {
    return (
        permissionHierarchy(permission) >=
        permissionHierarchy(Permissions.WRITE)
    );
};

const isReadable = (permission) => {
    return (
        permissionHierarchy(permission) >= permissionHierarchy(Permissions.READ)
    );
};

const isOwner = (selectedResources) => {
    if (!selectedResources || selectedResources.length === 0) {
        return false;
    }
    const notOwners = selectedResources.filter(
        (resource) => !hasOwn(resource.permission)
    );
    return notOwners.length === 0;
};

const parseNameFromPath = (path) => {
    return path?.split(constants.PATH_SEPARATOR).pop();
};

const getParentPath = (path) => {
    if (path) {
        const pathItems = path.split(constants.PATH_SEPARATOR);
        pathItems.pop();
        const parentPath = pathItems.join(constants.PATH_SEPARATOR);
        return parentPath;
    }
    return null;
};

const useDataNavigationLink = (path, resourceId, type) => {
    let href = `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}?type=${type}&resourceId=${resourceId}`;
    let as = `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}${path}?type=${type}&resourceId=${resourceId}`;

    if (resourceId) {
        href = href.concat(`&resourceId=${resourceId}`);
    }

    return [href, as];
};

const DEFAULT_PAGE_SETTINGS = {
    order: constants.SORT_ASCENDING,
    orderBy: "name",
    page: 0,
    rowsPerPage: 100,
};

const getPageQueryParams = (order, orderBy, page, rowsPerPage) => {
    const selectedOrder = order || DEFAULT_PAGE_SETTINGS.order;
    const selectedOrderBy = orderBy || DEFAULT_PAGE_SETTINGS.orderBy;
    const selectedPage = page || DEFAULT_PAGE_SETTINGS.page;
    const selectedRowsPerPage =
        rowsPerPage || DEFAULT_PAGE_SETTINGS.rowsPerPage;
    return `selectedOrder=${selectedOrder}&selectedOrderBy=${selectedOrderBy}&selectedPage=${selectedPage}&selectedRowsPerPage=${selectedRowsPerPage}`;
};

const containsFolders = (resources) => {
    if (resources) {
        const folders = resources.filter(
            (resource) => resource.type === ResourceTypes.FOLDER
        );
        return folders.length > 0;
    }
    return false;
};

export {
    DEFAULT_PAGE_SETTINGS,
    getEncodedPath,
    getFolderPage,
    getPageQueryParams,
    validateDiskResourceName,
    hasOwn,
    isOwner,
    isWritable,
    isReadable,
    parseNameFromPath,
    getParentPath,
    useDataNavigationLink,
    containsFolders,
};
