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
    const accessToken = req?.kauth?.grant?.access_token;
    if (accessToken) {
        return {
            id: accessToken.content.preferred_username,
            attributes: {
                email: accessToken.content.email,
                entitlement: accessToken.content.entitlement,
                firstName: accessToken.content.given_name,
                lastName: accessToken.content.family_name,
                name: accessToken.content.name,
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
