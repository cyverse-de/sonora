/**
 * @author johnworth
 *
 * Express handler and utility functions for proxying most requests to Terrain.
 *
 * @module terrain
 */

import path from "path";
import querystring from "querystring";

import { terrainURL } from "../configuration";
import logger from "../logging";
import axiosInstance from "../../common/getAxios";
import { replaceNamedPathSegments } from "../../common/functions";

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
        call({
            method,
            pathname,
            headers,
            query: req.query,
            params: req.params,
            userID: accessToken?.content?.preferred_username,
            accessToken: accessToken?.token,
            data: req?.body,
        })
            .then((apiResponse) => {
                res.set(apiResponse.headers);
                res.status(apiResponse.status);
                res.send(apiResponse.data);
            })
            .catch(async (err) => {
                logger.error(err);
                const e = await err;

                if (e.response && e.response.status === 302) {
                    //if we don't set it to 200, react-query wont get the custom response with Location
                    res.status(200);
                    res.send({
                        Location: e.response?.headers?.location,
                        status: 302,
                    });
                } else {
                    res.status(e.response?.status || 500);
                    res.send(e.response?.data);
                }
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
 * @param {Object} request.data = The request body, if provided.
 * @returns {Promise}
 */
export const call = ({
    method,
    pathname,
    headers,
    query,
    params,
    userID,
    accessToken,
    data,
}) => {
    const apiURL = new URL(terrainURL);

    let updatedPathName = replaceNamedPathSegments(params, pathname);
    apiURL.pathname = path.join(apiURL.pathname, updatedPathName);

    if (query) {
        apiURL.search = querystring.stringify(query);
    }

    logger.info(
        `TERRAIN ${userID} ${method} ${apiURL.href} ${JSON.stringify(data)}`
    );

    let requestOptions = {
        method: method,
        url: apiURL.toString(),
        withCredentials: true,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        maxRedirects: 0,
        data,
    };

    if (headers) {
        requestOptions.headers = {
            ...requestOptions.headers,
            ...headers,
        };
    }

    return axiosInstance.request(requestOptions);
};
