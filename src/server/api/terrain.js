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
 * Calls a Terrain endpoint. Returns the a Promise.
 *
 * @param {Object} requestParam - The request configuration object.
 * @param {string} requestParam.method - The HTTP method to use for the Terrain request.
 * @param {string} requestParam.pathname - The path for the Terrain request.
 * @param {Object} requestParam.headers - The headers to include in the Terrain request.
 * @param {Object} requestParam.query - The query params to include in the Terrain request.
 * @param {Object} requestParam.userID - The user ID to include in the Terrain request.
 * @param {Object} requestParam.accessToken - The access token to use in the Terrain request.
 * @param {Object} inStream - The ReadableStream to use as the body of the Terrain request.
 * @returns {Promise}
 */
export const call = (
    { method, pathname, headers, query, userID, accessToken },
    inStream
) => {
    const apiURL = new URL(terrainURL);
    apiURL.pathname = path.join(apiURL.pathname, pathname);

    if (query) {
        apiURL.search = querystring.stringify(query);
    }

    logger.info(`TERRAIN ${userID} ${method} ${apiURL.href}`);

    let requestOptions = {
        method,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
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
