/**
 * @author psarando
 *
 * Apps related utility functions.
 */
import NavigationConstants from "../../common/NavigationConstants";
import Permissions from "../models/Permissions";

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
 */

export const getListingPath = (
    order,
    orderBy,
    page,
    rowsPerPage,
    filter,
    category
) => {
    const encodedFilter = encodeURIComponent(filter);
    const encodedCategory = encodeURIComponent(category);
    return `/${NavigationConstants.APPS}?selectedOrder=${order}&selectedOrderBy=${orderBy}&selectedPage=${page}&selectedRowsPerPage=${rowsPerPage}&selectedFilter=${encodedFilter}&selectedCategory=${encodedCategory}`;
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
        !apps.find((app) => app.permission !== Permissions.OWN)
    );
};
