/**
 * Application authentication module.
 *
 * @module auth
 */

/**
 * Extracts the username from the calims in the JWT access token.
 *
 * @param {Object} req
 */
export const getUserID = (req) => {
    return req?.kauth?.grant?.access_token?.content?.preferred_username;
};

/**
 * Extracts the user profile from the claims in the JWT access token.
 *
 * @param {Object} req
 */
export const getUserProfile = (req) => {
    const access_token = req?.kauth?.grant?.access_token;
    if (access_token) {
        return {
            id: access_token.content.preferred_username,
            attributes: {
                email: access_token.content.email,
                entitlement: access_token.content.entitlement,
                firstName: access_token.content.given_name,
                lastName: access_token.content.family_name,
                name: access_token.content.name,
            },
        };
    } else {
        return null;
    }
};

/**
 * Adds the access token to the Authorization header if it's present in the request.
 */
export const authnTokenMiddleware = (req, res, next) => {
    const token = req?.kauth?.grant?.access_token?.signed;

    if (token) {
        req.headers["Authorization"] = `Bearer ${token}`;
    }

    next();
};
