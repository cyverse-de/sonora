/**
 * Application configuration module.
 * @module configuration
 */

import config from "config";

/**
 * Verifies that a setting is present in the configuration.
 *
 * @param {string} name
 */
function validateConfigSetting(name) {
    if (!config.has(name)) {
        throw Error(`${name} must be set in the configuration`);
    }
}

/**
 * Parses a configuration setting as a Boolean value. If the value is already Boolean then it's simply returned. If
 * the value is a string then it's treated as true only if it is equal to "true" (case insensitive, with optional
 * leading or trailing whitespace). If the value is any other type then it will be treated as false.
 *
 * @param {*} value
 */
function parseBoolean(value) {
    if (typeof value == "boolean") {
        return value;
    } else if (typeof value == "string") {
        return /^\s*true\s*$/i.test(value);
    } else {
        return false;
    }
}

/**
 * Ensures that the values from the configuration file and the environment
 * variables are generally acceptable. Accepts no parameters. Throws an
 * exception if there is a problem.
 * @function
 */
export const validate = () => {
    validateConfigSetting("base_url");
    validateConfigSetting("terrain_url");
    validateConfigSetting("listen_port");

    // Session configuration settings.
    validateConfigSetting("sessions.secret");
    validateConfigSetting("sessions.secure_cookie");

    // OAuth2 configuration settings.
    validateConfigSetting("oauth2.authorization_url");
    validateConfigSetting("oauth2.token_url");
    validateConfigSetting("oauth2.profile_url");
    validateConfigSetting("oauth2.client_id");
    validateConfigSetting("oauth2.client_secret");
};

/**
 * The bse URL for the Discovery Environment. Taken from the 'base_url'
 * setting in the configuration file.
 *
 * @type {string}
 */
export const baseURL = config.get("base_url");

/**
 * The base URL for the Terrain service. Taken from the
 * 'terrain_url' setting in the configuration file.
 *
 * @type {string}
 */
export const terrainURL = config.get("terrain_url");

/**
 * Is set to true if the application is running in
 * development mode. Checks to make sure the NODE_ENV environment variable
 * is not set to 'production'.
 *
 * @type {boolean}
 */
export const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * The port the application listens on for requests. Takes its value from the
 * 'listen_port' setting in the configuration file.
 * @type {number}
 */
export const listenPort = parseInt(config.get("listen_port"), 10);

/**
 * The secret to use when encoding and decoding secrets. Taken from the
 * 'sessions.secret' setting in the configuration file.
 * @type {string}
 */
export const sessionSecret = config.get("sessions.secret");

/**
 * Whether or not to use secure cookies to store a session. Secure cookies
 * will not work if HTTPS isn't being used. Taken from the
 * 'sessions.secure_cookie' setting in the configuration file.
 * @type {boolean}
 */
export const sessionSecureCookie = parseBoolean(
    config.get("sessions.secure_cookie")
);

/**
 * The URL to redirect users to for OAuth2 authorization. Taken from the
 * 'oauth2.authorization_url' setting in the configuration file.
 * @type {string}
 */
export const oauth2AuthorizationURL = config.get("oauth2.authorization_url");

/**
 * The URL to connect to in order to get an OAuth2 token. Taken from the
 * 'oauth2.token_url' setting in the configuration file.
 * @type {string}
 */
export const oauth2TokenURL = config.get("oauth2.token_url");

/**
 * The URL to connect to in order to obtain the user profile once an access
 * token has been obtained. Taken from the 'oauth2.profile_url' setting in
 * the configuration file.
 * @type {string}
 */
export const oauth2ProfileURL = config.get("oauth2.profile_url");

/**
 * The client ID to use for the OAuth2 provider. Taken from the
 * 'oauth2.client_id' setting in the configuration file.
 * @type {string}
 */
export const oauth2ClientID = config.get("oauth2.client_id");

/**
 * The client secret to use for the OAuth2 provider. Taken from the
 * 'oauth2.client_secret' setting in the configuration file.
 * @type {string}
 */
export const oauth2ClientSecret = config.get("oauth2.client_secret");
