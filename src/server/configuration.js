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
    if (!config.has(name) || config.get(name) === null) {
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
 * Builds a database connection URI from the configuration values.
 *
 * @returns {string}
 */
function buildDatabaseURI() {
    const host = encodeURIComponent(config.get("db.host"));
    const port = encodeURIComponent(config.get("db.port"));
    const user = encodeURIComponent(config.get("db.user"));
    const pass = encodeURIComponent(config.get("db.password"));
    const database = encodeURIComponent(config.get("db.database"));
    return `postgresql://${user}:${pass}@${host}:${port}/${database}`;
}

/**
 * Ensures that the values from the configuration file and the environment
 * variables are generally acceptable. Accepts no parameters. Throws an
 * exception if there is a problem.
 * @function
 */
const validate = () => {
    validateConfigSetting("base_url");
    validateConfigSetting("terrain_url");
    validateConfigSetting("listen_port");

    // logging configuration settings.
    validateConfigSetting("logging.level");
    validateConfigSetting("logging.label");

    // Database configuration settings.
    validateConfigSetting("db.host");
    validateConfigSetting("db.port");
    validateConfigSetting("db.user");
    validateConfigSetting("db.password");
    validateConfigSetting("db.database");

    // Session configuration settings.
    validateConfigSetting("sessions.secret");
    validateConfigSetting("sessions.secure_cookie");
    validateConfigSetting("sessions.ttl");

    // Keycloak configuration settings.
    validateConfigSetting("keycloak.server_url");
    validateConfigSetting("keycloak.realm");
    validateConfigSetting("keycloak.client_id");
    validateConfigSetting("keycloak.client_secret");

    //intercom settings.
    validateConfigSetting("intercom.app_id");
    validateConfigSetting("intercom.enabled");
    validateConfigSetting("intercom.company_id");
    validateConfigSetting("intercom.company_name");

    //amqp settings
    validateConfigSetting("amqp.amqp_uri");
    validateConfigSetting("amqp.exchange_name");

    //groups
    validateConfigSetting("admin.groups");

    //analysis settings
    validateConfigSetting("analysis.support.user");
    validateConfigSetting("analysis.support.source_id");

    //irods settings
    validateConfigSetting("irods.home_path");
    validateConfigSetting("irods.trash_path");
    validateConfigSetting("irods.web_dav.anon_uri");

    // 3rd Party Service URL/Endpoint Settings
    validateConfigSetting("services.ontology_lookup_service.base");
    validateConfigSetting("services.unified_astronomy_thesaurus.base");
    validateConfigSetting("services.user_portal_api.base");
};

validate();

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
 * The URI to use when connecting to the database. Most database interaction
 * is managed by the API, but the UI does use the database to store user
 * session information.
 * @type {string}
 */
export const dbURI = buildDatabaseURI();

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
 * The time-to-live for user sessions. Taken from the 'sessions.ttl' setting
 * in the configuration file. The setting in the configuration file should be
 * specified in hours.
 * @type {number}
 */
export const sessionTTL = parseInt(config.get("sessions.ttl")) * 3600;

/**
 * The Keycloak server URL. Taken from the 'keycloak.server_url' setting in the
 * configuration file.
 * @type {string}
 */
export const keycloakServerURL = config.get("keycloak.server_url");

/**
 * The Keycloak realm. Taken from the 'keycloak.realm' setting in the
 * configuration file.
 * @type {string}
 */
export const keycloakRealm = config.get("keycloak.realm");

/**
 * The Keycloak client ID. Taken from the 'keycloak.client_id' setting in the
 * configuration file.
 * @type {string}
 */
export const keycloakClientID = config.get("keycloak.client_id");

/**
 * The Keycloak client secret. Taken from the 'keycloak.client_secret' setting
 * in the configuration file.
 * @type {string}
 */
export const keycloakClientSecret = config.get("keycloak.client_secret");

/**
 * The log level to use. See https://github.com/winstonjs/winston#logging-levels.
 * We're using the Winston defaults.
 * @type {string}
 */
export const logLevel = config.get("logging.level");

/**
 * The log label to use.
 * @type {string}
 */
export const logLabel = config.get("logging.label");

/**
 * The intercom app id
 * @type {string}
 */
export const intercomAppId = config.get("intercom.app_id");

/**
 * Is intercom enabled
 * @type {boolean}
 */
export const intercomEnabled = parseBoolean(config.get("intercom.enabled"));

/**
 * Is intercom company id
 * @type {string}
 */
export const intercomCompanyId = config.get("intercom.company_id");

/**
 * Is intercom company name
 * @type {string}
 */
export const intercomCompanyName = config.get("intercom.company_name");

/**
 * AMQP URI
 * @type {string}
 */
export const amqpUri = config.get("amqp.amqp_uri");

/**
 * AMQP exchange name
 * @type {string}
 *
 */
export const amqpExchangeName = config.get("amqp.exchange_name");

/**
 * iRods home path
 * @type {string}
 */
export const iRodsHome = config.get("irods.home_path");

/**
 * iRods trash path
 * @type {string}
 */
export const iRodsTrash = config.get("irods.trash_path");

/**
 * The Ontology Lookup Service `select` endpoint.
 * http://www.ebi.ac.uk/ols/docs/api#_select_terms
 *
 * @type {string}
 */
export const olsURL = config.get("services.ontology_lookup_service.base");

/**
 * The Unified Astronomy Thesaurus `concept` endpoint.
 * https://documentation.ands.org.au/display/DOC/Linked+Data+API
 *
 * @type {string}
 */
export const uatURL = config.get("services.unified_astronomy_thesaurus.base");

/**
 * The base URL for the User Portal's API
 */
export const userPortalURL = config.get("services.user_portal_api.base");

/**
 *
 * The base URL for Data Store anon files
 *
 */
export const anonFilesBaseURL = config.get("irods.web_dav.anon_uri");
