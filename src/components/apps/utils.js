/**
 * @author psarando
 *
 * Apps related utility functions.
 */

import NavigationConstants from "common/NavigationConstants";
import Checkbox from "components/apps/launch/params/Checkbox";
import Double from "components/apps/launch/params/Double";
import FileFolderInput from "components/apps/launch/params/FileFolderInput";
import FileInput from "components/apps/launch/params/FileInput";
import FolderInput from "components/apps/launch/params/FolderInput";
import Info from "components/apps/launch/params/Info";
import Integer from "components/apps/launch/params/Integer";
import MultiFileSelector from "components/apps/launch/params/MultiFileSelector";
import MultilineText from "components/apps/launch/params/MultilineText";
import Selection from "components/apps/launch/params/Selection";
import Text from "components/apps/launch/params/Text";

import ReferenceGenomeSelect from "components/apps/launch/ReferenceGenomeSelect";

import AppParamTypes from "components/models/AppParamTypes";
import Permissions, {
    permissionHierarchy,
} from "components/models/Permissions";

/**
 * Builds a path to the App Launch Wizard for the app with the given IDs.
 *
 * @param {string} systemId The app's system ID.
 * @param {string} appId The app's ID.
 * @param {string} versionId The app's version ID.
 */
export const getAppLaunchPath = (systemId, appId, versionId) =>
    versionId
        ? `/${NavigationConstants.APPS}/${systemId}/${appId}/versions/${versionId}/launch`
        : `/${NavigationConstants.APPS}/${systemId}/${appId}/launch`;

/**
 * Builds a path to the App Launch Wizard for the Saved Launch with
 * the given IDs.
 *
 * @param {string} systemId The app's system ID.
 * @param {string} appId The app's ID.
 * @param {string} launchId The Saved Launch ID.
 * @returns The path to the App Launch Wizard for the Saved Launch with
 * the given IDs.
 */
export const getSavedLaunchPath = (systemId, appId, launchId) =>
    `/${NavigationConstants.APPS}/${systemId}/${appId}/launch?saved-launch-id=${launchId}`;

/**
 * Builds a path to the App Editor for the app with the given IDs.
 *
 * @param {string} systemId The app's system ID.
 * @param {string} appId The app's ID.
 * @param {string} versionId The app's version ID.
 */
export const getAppEditPath = (systemId, appId, versionId) =>
    `/${NavigationConstants.APPS}/${systemId}/${appId}/versions/${versionId}/edit`;

/**
 * Builds a path to the App Editor for creating a new version
 * of the app with the given IDs.
 *
 * @param {string} systemId The app's system ID.
 * @param {string} appId The app's ID.
 * @param {string} versionId The app's version ID.
 */
export const getAppVersionCreatePath = (systemId, appId, versionId) =>
    `/${NavigationConstants.APPS}/${systemId}/${appId}/versions/${versionId}/create`;

/**
 *
 * @param {string} order The apps listing sort order, asc or desc.
 * @param {string} orderBy The apps listing sort field.
 * @param {string} page The apps listing page.
 * @param {string} rowsPerPage The apps listing page size.
 * @param {string} filter The apps listing filter option.
 * @param {string} category The apps category
 * @param {boolean} isAdminView True if the view is admin app view.
 */

export const getListingPath = (
    order,
    orderBy,
    page,
    rowsPerPage,
    filter,
    category,
    isAdminView,
    searchTerm,
    adminOwnershipFilter
) => {
    return {
        pathname: isAdminView
            ? `/${NavigationConstants.ADMIN}/${NavigationConstants.APPS}`
            : `/${NavigationConstants.APPS}`,
        query: {
            selectedOrder: order,
            selectedOrderBy: orderBy,
            selectedPage: page,
            selectedRowsPerPage: rowsPerPage,
            selectedFilter: filter,
            selectedCategory: category,
            searchTerm: searchTerm || "",
            adminOwnershipFilter: adminOwnershipFilter,
        },
    };
};

/**
 * Builds `href` and `as` paths for use in an app listing next/link
 *
 * @param {string} systemId The app's system ID
 * @param {string} appId The app's ID
 *
 * @return {array} [href, as] to be used in a next/link
 */
export const getAppListingLinkRefs = (systemId, appId) => {
    const href = `/${NavigationConstants.APPS}/[systemId]/[appId]`;
    const as = `/${NavigationConstants.APPS}/${systemId}/${appId}`;

    return [href, as];
};

/**
 * Builds a path to the App Launch Wizard for the app with the given IDs.
 *
 * @param {string} systemId The app's system ID.
 * @param {string} appId The app's ID.
 */
export const useAppLaunchLink = (systemId, appId) => {
    const href = `/${NavigationConstants.APPS}/[systemId]/[appId]/launch`;
    const as = `/${NavigationConstants.APPS}/${systemId}/${appId}/launch`;
    return [href, as];
};

export const canShare = (apps) => {
    return (
        apps &&
        apps.length > 0 &&
        !apps.find((app) => app?.permission !== Permissions.OWN)
    );
};

export const hasOwn = (permission) => {
    return Permissions.OWN === permission;
};

export const isWritable = (permission) => {
    return (
        permissionHierarchy(permission) >=
        permissionHierarchy(Permissions.WRITE)
    );
};

export const isReadable = (permission) => {
    return (
        permissionHierarchy(permission) >= permissionHierarchy(Permissions.READ)
    );
};

export const getAppParameterLaunchComponent = (paramType) => {
    switch (paramType) {
        case AppParamTypes.INFO:
            return Info;

        case AppParamTypes.TEXT:
            return Text;

        case AppParamTypes.MULTILINE_TEXT:
            return MultilineText;

        case AppParamTypes.INTEGER:
            return Integer;

        case AppParamTypes.DOUBLE:
            return Double;

        case AppParamTypes.FLAG:
            return Checkbox;

        case AppParamTypes.TEXT_SELECTION:
        case AppParamTypes.INTEGER_SELECTION:
        case AppParamTypes.DOUBLE_SELECTION:
            return Selection;

        case AppParamTypes.FILE_INPUT:
            return FileInput;

        case AppParamTypes.FOLDER_INPUT:
            return FolderInput;

        case AppParamTypes.FILE_FOLDER_INPUT:
            return FileFolderInput;

        case AppParamTypes.MULTIFILE_SELECTOR:
            return MultiFileSelector;

        case AppParamTypes.REFERENCE_GENOME:
        case AppParamTypes.REFERENCE_SEQUENCE:
        case AppParamTypes.REFERENCE_ANNOTATION:
            return ReferenceGenomeSelect;

        default:
            return Text;
    }
};

export const validateAppName = (
    restrictedStartingChars,
    restrictedChars,
    value,
    t
) => {
    if (!value) {
        return t("emptyValue");
    }

    let startingCharsRegex = new RegExp("^[" + restrictedStartingChars + "]");
    let invalid = value.match(startingCharsRegex);
    if (invalid) {
        return t("nameBeginsWithInvalidChars", {
            restrictedStartingChars,
            inValid: invalid.join(""),
        });
    }

    // Escape each non-alphanumeric char since some are used as special chars in regex
    let escapedRestrictedChars = restrictedChars.replace(/\W/g, "\\$&");
    let restrictedCharsRegex = new RegExp(
        "[" + escapedRestrictedChars + "]",
        "g"
    );
    invalid = value.match(restrictedCharsRegex);
    if (invalid) {
        return t("nameContainsInvalidChars", {
            restrictedChars,
            inValid: invalid.join(""),
        });
    }
};

export const formatAppDoc = (
    name,
    desc,
    testData,
    inputFilesDesc,
    paramsDesc,
    outputFilesDesc,
    licenseType,
    licenseLink,
    references
) => {
    const combinedRefs = references?.join(",");
    const doc = `### ${name}\n\n#### Description and Quick Start\n${desc}\n\n#### Test Data\n${testData}\n\n#### Input File(s)\n${inputFilesDesc}\n\n#### Parameters Used in App\n${paramsDesc}\n\n#### Output File(s)\n${outputFilesDesc}\n\n### License\n${licenseType}\n${licenseLink}\n\n### Reference(s)\n${combinedRefs}`;
    console.log("Doc=>" + doc);
    return doc;
};

export const appUnavailable = (
    app,
    hasDeprecatedParams,
    computeLimitExceeded
) => {
    return (
        app?.deleted ||
        app?.disabled ||
        hasDeprecatedParams ||
        computeLimitExceeded
    );
};
