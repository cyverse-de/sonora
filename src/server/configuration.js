/**
 * Application configuration module.
 * @module configuration
 */

import config from "config";

/**
 * Ensures that the values from the configuration file and the environment
 * variables are generally acceptable. Accepts no parameters. Throws an
 * exception if there is a problem.
 * @function
 */
export const validate = () => {
    if (!config.has("terrain_url")) {
        throw Error("terrain_url must be set in the configuration");
    }

    if (!config.has("listen_port")) {
        throw Error("listen_port must be set in the configuration");
    }

    if (!config.has("session_key")) {
        throw Error("session_key must be set in the configuration");
    }

    if (!config.has("cas_url")) {
        throw Error("cas_url must be set in the configuration");
    }

    if (!config.has("service_url")) {
        throw Error("service_url must be set in the configuration");
    }
};

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
 * The key to use for Express sessions.
 *
 * @type {string}
 */
export const sessionKey = config.get("session_key");

/**
 * The base URL for CAS.
 *
 * @type {string}
 */
export const casURL = config.get("cas_url");

/**
 * The base URL for this app.
 *
 * @type {string}
 */
export const serviceURL = config.get("service_url");
