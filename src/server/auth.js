/**
 * Application authentication module.
 *
 * @module auth
 */

import session from "express-session";
import pgsimple from "connect-pg-simple";
import keycloak from "keycloak-connect";

import * as config from "./configuration";

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
    const token = req?.kauth?.grant?.access_token?.token;

    if (token) {
        req.headers["Authorization"] = `Bearer ${token}`;
    }

    next();
};

// Configure the session store.
const pgSession = pgsimple(session);
let sessionStore;

/**
 * Returns the session store instance for the application.
 *
 * @returns {Object}
 */
const getSessionStore = () => {
    if (!sessionStore) {
        sessionStore = new pgSession({
            conString: config.dbURI,
            tableName: "session",
            ttl: config.sessionTTL,
        });
    }
    return sessionStore;
};

/**
 * Returns Express middleware for session management.
 *
 * @returns {Object}
 */
export const sessionMiddleware = () =>
    session({
        store: getSessionStore(),
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: config.sessionSecureCookie,
        },
    });

let keycloakClient;
/**
 * Returns a newly instantiated Keycloak client.
 *
 * @returns {Object}
 */
export const getKeycloakClient = () => {
    if (!keycloakClient) {
        keycloakClient = new keycloak(
            {
                store: getSessionStore(),
            },
            {
                serverUrl: config.keycloakServerURL,
                realm: config.keycloakRealm,
                clientId: config.keycloakClientID,
                secret: config.keycloakClientSecret,
            }
        );
    }

    return keycloakClient;
};
