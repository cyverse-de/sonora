/**
 * @author johnworth
 *
 * Express handler and utility functions for proxying most requests to Terrain.
 *
 * @module terrain
 */

import fetch from "node-fetch";
import path from "path";
import querystring from "querystring";

import { terrainURL } from "../configuration";
import logger from "../logging";

/**
 * Returns an Express handler that can proxy most requests to Terrain. Does not handle
 * file uploads.
 *
 * @param {Object} config - The configuration for the handler.
 * @param {string} config.method - The HTTP method to use for Terrain requests.
 * @param {string} config.pathname - The request path for the Terrain requests.
 * @param {Object} config.headers - The headers to include in the Terrain requests.
 * @return {Function}
 */
export const handler = ({ method, pathname, headers }) => {
    return async (req, res) => {
        const accessToken = req?.kauth?.grant?.access_token;
        call(
            {
                method,
                pathname,
                headers,
                query: req.query,
                params: req.params,
                userID: accessToken?.content?.preferred_username,
                accessToken: accessToken?.token,
            },
            req
        )
            .then((apiResponse) => {
                res.status(apiResponse.status);
                apiResponse.body.pipe(res);
            })
            .catch((e) => {
                res.status(500).send(e.message);
            });
    };
};

/**
 * Calls a Terrain endpoint. Returns a Promise.
 *
 * @param {Object} request - The request configuration object.
 * @param {string} request.method - The HTTP method to use for the Terrain request.
 * @param {string} request.pathname - The path for the Terrain request.
 * @param {Object} request.headers - The headers to include in the Terrain request.
 * @param {Object} request.query - The query params to include in the Terrain request.
 * @param {Object} request.params - The named path segments
 * @param {Object} request.userID - The user ID to include in the Terrain request.
 * @param {Object} request.accessToken - The access token to use in the Terrain request.
 * @param {Object} inStream - The ReadableStream to use as the body of the Terrain request.
 * @returns {Promise}
 */
export const call = (
    { method, pathname, headers, query, params, userID, accessToken },
    inStream
) => {
    const apiURL = new URL(terrainURL);
    let updatedPathName = pathname;

    // Replace any named path segments (:variableName) with the
    // corresponding values
    if (params) {
        const keys = Object.keys(params);
        keys.forEach((key) => {
            updatedPathName = updatedPathName.replace(`:${key}`, params[key]);
        });
    }
    apiURL.pathname = path.join(apiURL.pathname, updatedPathName);

    if (query) {
        apiURL.search = querystring.stringify(query);
    }

    logger.info(`TERRAIN ${userID} ${method} ${apiURL.href}`);

    const buildRequestOptionHeaders = () => {
        return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    };

    let requestOptions = {
        method,
        credentials: "include",
        headers: buildRequestOptionHeaders(),
    };

    if (!["GET", "HEAD"].includes(method)) {
        requestOptions.body = inStream;
    }

    if (headers) {
        requestOptions.headers = {
            ...requestOptions.headers,
            ...headers,
        };
    }

    return fetch(apiURL, requestOptions);
};
