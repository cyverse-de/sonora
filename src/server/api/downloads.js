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

    const filePath = req?.query?.path;
    const attachment = req?.query?.attachment || 0;
    const url = req?.query?.url;

    req.pipe(
        doDownloadFromTerrain(userID, accessToken, filePath, attachment, url)
    ).pipe(res);
};

const doDownloadFromTerrain = (
    userID,
    accessToken,
    filePath,
    attachment,
    url
) => {
    const apiURL = new URL(terrainURL);
    if (url) {
        apiURL.pathname = path.join(
            apiURL.pathname,
            "/secured/filesystem/display-download"
        );
        apiURL.search = "path=" + filePath + "&attachment=" + attachment;
    } else {
        apiURL.pathname = path.join(
            apiURL.pathname,
            "/secured/fileio/download"
        );
        apiURL.search = "path=" + filePath;
    }
    logger.info(`TERRAIN ${userID} GET ${apiURL.href}`);
    const requestOptions = {
        method: "GET",
        url: apiURL,
        headers: {
            Authorization: `Bearer ${accessToken.token}`,
            Accept: "application/octet-stream",
        },
    };
    return request(requestOptions).on("error", function (err) {
        logger.error(err);
    });
};

export default handler;
