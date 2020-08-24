/**
 * @author psarando
 *
 * Apps related utility functions.
 */
import NavigationConstants from "../../common/NavigationConstants";

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
) =>
    `/${NavigationConstants.APPS}?selectedOrder=${order}&selectedOrderBy=${orderBy}&selectedPage=${page}&selectedRowsPerPage=${rowsPerPage}&selectedFilter=${filter}&selectedCategory=${category}`;

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
