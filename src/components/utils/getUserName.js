import constants from "../../constants";

/**
 *
 * Get short username
 *
 * @param {string} userNameWithDomain - user name with domain
 *
 * @returns {string} - short username.
 */
export const getUserName = (userNameWithDomain) => {
    return userNameWithDomain && userNameWithDomain.includes(constants.IPLANT)
        ? userNameWithDomain.split("@")[0]
        : userNameWithDomain;
};
