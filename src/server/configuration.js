import config from "config";

/**
 * Ensures that the values from the configuration file and the environment
 * variables are generally acceptable. Accepts no parameters. Throws an
 * exception if there is a problem.
 */
export const validate = () => {
    if (!config.has("terrain_url")) {
        throw Error("terrain_url must be set in the configuration.");
    }
};

/**
 * @type {string} - The base URL for the Terrain service. Taken from the
 * 'terrain_url' setting in the configuration file.
 */
export const terrainURL = config.get("terrain_url");

/**
 * @type {boolean} - Is set to true if the application is running in
 * development mode. Checks to make sure the NODE_ENV environment variable
 * is not set to 'production'.
 */
export const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * @type {number} - The port the application listens on for requests. Takes its
 * value from the PORT environment variable. Defaults to 3000 if it's not set.
 */
export const listenPort = parseInt(process.env.PORT || "3000", 10);
