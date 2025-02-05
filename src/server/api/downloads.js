/**
 * @author sriram
 *
 * Handles proxying file downloads from Terrain.
 *
 * @module downloads
 */
import request from "postman-request";
import path from "path";
import logger from "../logging";

import { terrainURL } from "../configuration";

/**
 * Express handler for file download requests. The response from this
 * will be the response from Terrain unless the request validation
 * fails.
 *
 * @param {object} req - An Express request.
 * @param {object} res - An Express response.
 * @returns null
 */
const handler = async (req, res) => {
    // When user isn't logged in, these will just end up empty and use the fallbacks defined in the backend services
    const accessToken = req?.kauth?.grant?.access_token;
    const userID = accessToken?.content?.preferred_username;

    const filePath = encodeURIComponent(req?.query?.path);
    const attachment = req?.query?.attachment || 0;
    const url = req?.query?.url;

    const apiURL = new URL(terrainURL);
    if (url) {
        apiURL.pathname = path.join(
            apiURL.pathname,
            "/filesystem/display-download"
        );
        apiURL.search = "path=" + filePath + "&attachment=" + attachment;
    } else {
        apiURL.pathname = path.join(apiURL.pathname, "/fileio/download");
        apiURL.search = "path=" + filePath;
    }

    req.pipe(doDownloadFromTerrain(userID, accessToken, apiURL)).pipe(res);
};

/**
 * Express handler for Metadata Template CSV download requests.
 * The response from this will be the response from Terrain unless the
 * request validation fails.
 *
 * @param {object} req - An Express request.
 * @param {object} res - An Express response.
 * @returns null
 */
const metadataTemplateCSVhandler = async (req, res) => {
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

    const apiURL = new URL(terrainURL);
    apiURL.pathname = path.join(
        apiURL.pathname,
        "/secured/filesystem/metadata/template",
        req?.params?.templateId,
        "zip-csv"
    );

    req.pipe(doDownloadFromTerrain(userID, accessToken, apiURL)).pipe(res);
};

const doDownloadFromTerrain = (userID, accessToken, apiURL) => {
    logger.info(`TERRAIN ${userID} GET ${apiURL.href}`);
    const requestOptions = {
        method: "GET",
        url: apiURL,
        headers: {
            Accept: "application/octet-stream",
        },
        disableUrlEncoding: true,
    };
    if (accessToken) {
        requestOptions.headers["Authorization"] = `Bearer ${accessToken.token}`;
    }
    return request(requestOptions).on("error", function (err) {
        logger.error(err);
    });
};

export { metadataTemplateCSVhandler };
export default handler;
