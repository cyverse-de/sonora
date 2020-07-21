/**
 * @author sriram
 *
 */
import { getMessage } from "@cyverse-de/ui-lib";

import constants from "../../constants";
import NavigationConstants from "../../common/NavigationConstants";

import DataConstants from "./constants";
import Permissions, { permissionHierarchy } from "../models/Permissions";

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
    `${constants.PATH_SEPARATOR}${NavigationConstants.DATA}${constants.PATH_SEPARATOR}ds${folderPath}`;

const validateDiskResourceName = (name) => {
    if (name === "") {
        return getMessage("validationEmptyDiskResourceName");
    }
    if (name === "." || name === "..") {
        return getMessage("validationDiskResourceName");
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

        return getMessage("validationInvalidCharacters", {
            values: { charList },
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
    if (!selectedResources) {
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

export {
    getEncodedPath,
    getFolderPage,
    validateDiskResourceName,
    hasOwn,
    isOwner,
    isWritable,
    isReadable,
    parseNameFromPath,
};
