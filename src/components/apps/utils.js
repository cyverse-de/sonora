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
