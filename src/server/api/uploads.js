/**
 * @author johnworth, psarando
 *
 * Handles proxying file uploads to Terrain.
 *
 * @module uploads
 */
import querystring from "querystring";
import path from "path";

import { terrainURL } from "../configuration";
import { streamTerrainRequest } from "./terrainStream";

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

    await doUploadToTerrain(req, res, userID, accessToken, destination);
};

/**
 * Formats the URL and streams the upload to Terrain.
 *
 * @param {object} req - An Express request.
 * @param {object} res - An Express response.
 * @param {string} userID - The userID passed in with the request.
 * @param {string} accessToken - The access token used for Terrain auth.
 * @param {string} destination - The destination directory path in the data store.
 * @returns {Promise}
 */
const doUploadToTerrain = (req, res, userID, accessToken, destination) => {
    const apiURL = new URL(terrainURL);
    apiURL.pathname = path.join(apiURL.pathname, "/secured/fileio/upload");
    apiURL.search = querystring.stringify({
        dest: destination,
    });

    return streamTerrainRequest(req, res, {
        userID,
        method: "POST",
        apiURL,
        headers: {
            Authorization: `Bearer ${accessToken.token}`,
        },
        forwardHeaders: ["content-type", "content-length"],
        body: req,
    });
};

export default handler;
