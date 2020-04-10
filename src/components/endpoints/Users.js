import callApi from "../../common/callApi";

/**
 * Get user information including name, institution, email, etc.
 * @param userIds An array of user ids
 * @returns {Promise<any>}
 */
export const getUserInfo = ({ userIds }) => {
    const userQuery = userIds.join("&username=");

    return callApi({
        endpoint: `/api/user-info?username=${userQuery}`,
    });
};
