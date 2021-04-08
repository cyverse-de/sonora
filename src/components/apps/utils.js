/**
 * @author psarando
 *
 * Apps related utility functions.
 */
import NavigationConstants from "../../common/NavigationConstants";

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
import Permissions from "components/models/Permissions";

/**
 * Builds a path to the App Launch Wizard for the app with the given IDs.
 *
 * @param {string} systemId The app's system ID.
 * @param {string} appId The app's ID.
 */
export const getAppLaunchPath = (systemId, appId) =>
    `/${NavigationConstants.APPS}/${systemId}/${appId}/launch`;

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
    isAdminView
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
