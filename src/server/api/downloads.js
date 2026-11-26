/**
 * @author sriram, psarando
 *
 * Handles proxying file downloads from Terrain.
 *
 * @module downloads
 */
import path from "path";

import { terrainURL } from "../configuration";
import { streamTerrainRequest } from "./terrainStream";

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

    await doDownloadFromTerrain(req, res, userID, accessToken, apiURL);
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

    await doDownloadFromTerrain(req, res, userID, accessToken, apiURL);
};

const doDownloadFromTerrain = (req, res, userID, accessToken, apiURL) => {
    const headers = {
        Accept: "application/octet-stream",
    };
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken.token}`;
    }

    // Media viewers send Range requests to seek in a file.
    return streamTerrainRequest(req, res, {
        userID,
        method: "GET",
        apiURL,
        headers,
        forwardHeaders: ["range", "if-range"],
    });
};

export { metadataTemplateCSVhandler };
export default handler;
