/**
 * @author johnworth
 *
 * Handles proxying file uploads to Terrain.
 *
 * @module uploads
 */
import request from "postman-request";
import querystring from "querystring";
import path from "path";
import logger from "../logging";

import { terrainURL } from "../configuration";

/**
 * Express handler for file upload requests. The response from this
 * will be the response from Terrain unless the request validation
 * fails.
 *
 * @param {object} req - An Express request.
 * @param {object} res - An Express response.
 * @returns null
 */
const handler = async (req, res) => {
    const accessToken = req?.kauth?.grant?.access_token;
    if (!accessToken) {
        res.status(401).send("authorization required");
        return;
    }

    const userID = accessToken?.content?.preferred_username;
    if (!userID) {
        res.status(401).send("authorization required");
        return;
    }

    const destination = req?.query?.dest;
    if (!destination) {
        res.status(400).send("destination query parameter required");
        return;
    }

    req.pipe(doUploadToTerrain(userID, accessToken, destination)).pipe(res);
};

/**
 * Formats the URL and returns the request() response.
 *
 * @param {string} userID - The userID passed in with the request.
 * @param {string} accessToken - The access token used for Terrain auth.
 * @param {string} destination - The destination directory path in the data store.
 * @returns {object}
 */
const doUploadToTerrain = (userID, accessToken, destination) => {
    const apiURL = new URL(terrainURL);
    apiURL.pathname = path.join(apiURL.pathname, "/secured/fileio/upload");
    apiURL.search = querystring.stringify({
        dest: destination,
    });

    const requestOptions = {
        method: "POST",
        url: apiURL,
        headers: {
            Authorization: `Bearer ${accessToken.token}`,
        },
    };

    logger.info(`TERRAIN ${userID} POST ${apiURL.href}`);

    return request(requestOptions);
};

export default handler;
