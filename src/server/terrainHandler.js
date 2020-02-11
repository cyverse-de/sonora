import fetch from "node-fetch";
import path from "path";
import querystring from "querystring";
import { terrainURL } from "./configuration";
import * as authStrategy from "./authStrategy";
import logger from "./logging";
import express from "express";
import { camelcaseit } from "../common/functions";

/**
 * @typedef TerrainRequestParamsObject
 * @property {string} method - The HTTP method to use for the request.
 * @property {string} url - The base URL for the requst.
 * @property {string} pathname - The path portion of the requested URL.
 * @property {Object} queryobj - Key-value mapping forming the query portion of the URL.
 * @property {Object} headers - Key-value mapping forming the headers for the request.
 */

/**
 * Returns an object containing the configuration for a request into Terrain. The object
 * is compatible with the `request` library.
 *
 * To actually make a request pass the result of this function to request().
 *
 * See https://github.com/request/request for more info.
 *
 * @param {TerrainRequestParamsObject} object - Destructured for values.
 * @returns {Object}
 */
const getOptions = ({ method, url, pathname, queryobj, headers }) => {
    const apiURL = new URL(url);
    apiURL.pathname = path.join(apiURL.pathname, pathname);
    apiURL.search = querystring.stringify(queryobj);

    const requestOptions = {
        method: method,
        url: apiURL,
    };

    if (headers) {
        requestOptions.headers = headers;
    }

    return requestOptions;
};

const callTerrain = (reqURL, reqOptions) => {
    return fetch(reqURL, reqOptions).then(
        (resp) => {
            if (resp.status < 200 || resp.status > 299) {
                throw Error(resp);
            }
            return resp;
        },
        (e) => logger.error(`${e.message}`)
    );
};

/**
 * Returns an Express handler function that will proxy requests to terrain.
 *
 * @param {TerrainRequestParamsObject} paramsObject - Configuration for the request to Terrain.
 * @returns {function}
 */
const terrain = (paramsObject) => {
    paramsObject.url = paramsObject.url || terrainURL;

    return (req, res) => {
        const params = { ...paramsObject, queryobj: req.query };
        const { url: reqURL, ...reqOptions } = getOptions(params);

        logger.info(
            `TERRAIN ${req?.user?.profile?.id} ${reqOptions.method} ${reqURL.href}`
        );

        callTerrain(reqURL, reqOptions)
            .then((resp) => res.status(200).send(resp.blob()))
            .catch((e) => logger.error(`${e.message}`));
    };
};

/**
 * An Express handler for the /secured/filesystem/paged-directory Terrain call.
 */
const pagedDirectory = async (req, res) => {
    const params = {
        method: "GET",
        url: terrainURL,
        pathname: "/secured/filesystem/paged-directory",
        queryobj: req.query,
        headers: {
            Authorization: req.headers.Authorization,
        },
    };
    const { url: reqURL, ...reqOptions } = getOptions(params);

    logger.info(
        `TERRAIN ${req?.user?.profile?.id} ${params.method} ${reqURL.href}`
    );

    callTerrain(reqURL, reqOptions)
        .then((resp) => resp.json())
        .then((data) => [
            ...data.folders.map((f) => ({ ...f, type: "FOLDER" })),
            ...data.files.map((f) => ({ ...f, type: "FILE" })),
        ])
        .then((listing) =>
            listing.filter((i) => i !== null && i !== "undefined")
        )
        .then((listing) => listing.map((i) => camelcaseit(i)))
        .then((listing) => res.status(200).send(JSON.stringify(listing)))
        .catch((e) => res.status(500).send(e.message));
};

/**
 * Returns an express Router with handlers defined for Terrain-related calls.
 */
const terrainRouter = () => {
    logger.info("creating the terrain router");
    const api = express.Router();

    logger.info("adding the /api/upload handler ");
    api.post(
        "/upload",
        authStrategy.authnTokenMiddleware,
        terrain({
            method: "POST",
            pathname: "/secured/fileio/upload",
        })
    );

    logger.info("adding the /api/download handler");
    api.get(
        "/download",
        authStrategy.authnTokenMiddleware,
        terrain({
            method: "GET",
            pathname: "/secured/fileio/download",
        })
    );

    logger.info("adding the /api/filesystem/paged-directory handler");
    api.get(
        "/filesystem/paged-directory",
        authStrategy.authnTokenMiddleware,
        pagedDirectory
    );

    logger.info("adding the /api/filesystem/stat handler");
    api.post(
        "/filesystem/stat",
        authStrategy.authnTokenMiddleware,
        terrain({
            method: "POST",
            pathname: "/secured/filesystem/stat",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the /api/filesystem/root handler");
    api.get(
        "/filesystem/root",
        authStrategy.authnTokenMiddleware,
        terrain({ method: "GET", pathname: "/secured/filesystem/root" })
    );

    return api;
};

export default terrainRouter;
