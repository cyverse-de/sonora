import constants from "../../constants";

/**
 * Returns the username suffix used by this DE installation. If the username suffix appears in the configuration then
 * that suffix is returned. Otherwise, the default username suffix is returned.
 *
 * @param {object} config - the app configuration.
 *
 * @returns the username suffix to use.
 */
export const getUserNameSuffix = (config) => {
    if (!config) {
        console.error("no configuration was provided");
    }
    return config?.username?.suffix || constants.DEFAULT_USERNAME_SUFFIX;
};

/**
 *
 * Get short username
 *
 * @param {string} userNameWithDomain - user name with domain
 * @param {object} config - the app configuration.
 *
 * @returns {string} - short username.
 */
export const getUserName = (userNameWithDomain, config) => {
    const suffix = getUserNameSuffix(config);
    return userNameWithDomain && userNameWithDomain.endsWith(suffix)
        ? userNameWithDomain.split("@")[0]
        : userNameWithDomain;
};
