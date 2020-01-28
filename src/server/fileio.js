import request from "request";
import { terrainURL } from "./configuration";
import path from "path";

/**
 * Handles proxying file upload requests to terrain.
 * @param {object} - An Express Request object.
 * @param {object} - An Express Response object.
 * @param {string} - The base URL to the backing API. Usually an instance of the terrain API.
 * @returns null
 */
export const configurableUploadHandler = (req, res, apiBaseURL) => {
    const token = req?.user?.accessToken;

    if (!token) {
        res.status(401).send("Authorization required.");
        return;
    }

    const { destination } = req.query;
    if (!destination || destination === "") {
        res.status(500).send("destination query parameter must be set.");
        return;
    }

    const apiURL = new URL(apiBaseURL);
    apiURL.pathname = path.join(apiURL.pathname, "/secured/fileio/upload");
    apiURL.search = `dest=${destination}`;

    console.log(apiURL.href);

    req.pipe(
        request.post(apiURL.href, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    ).pipe(res);
};

/**
 * Same as configurableUploadHandler, but defaults to using the configured
 * terrain handler.
 */
export const uploadHandler = (req, res) =>
    configurableUploadHandler(req, res, terrainURL);

/**
 * Handles proxying file download requests to the Terrain API.
 * @param {object} req - An Express Request object.
 * @param {object} res - An Express Response object.
 * @param {string} apiBaseURL - The base URL to the backing API. Usually an instance of the terrain API.
 * @returns null
 */
export const configurableDownloadHandler = (req, res, apiBaseURL) => {
    const token = req?.user?.accessToken;

    if (!token) {
        res.status(401).send("Authorization required.");
        return;
    }

    const { source } = req.query;
    if (!source || source === "") {
        res.status(500).send("source query parameter must be set.");
        return;
    }

    const apiURL = new URL(apiBaseURL);
    apiURL.pathname = path.join(apiURL.pathname, "/secured/fileio/download");
    apiURL.search = `path=${source}`;

    console.log(apiURL.href);

    res.set("Content-Type", "application/octet-stream");
    res.set(
        "Content-Disposition",
        `attachment; filename=${path.basename(source)}`
    );

    req.pipe(
        request.get(apiURL.href, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    ).pipe(res);
};

/**
 * Same as configurableDownloadHandler, but defaults to using the configured
 * terrain handler.
 */
export const downloadHandler = (req, res) =>
    configurableDownloadHandler(req, res, terrainURL);
