/**
 * Streams requests to Terrain and streams Terrain responses back to clients.
 *
 * @module terrainStream
 *
 * @author psarando
 */
import { Readable } from "stream";
import { pipeline } from "stream/promises";

import logger from "../logging";

// Node sets these for each connection, so do not copy them from Terrain.
const connectionHeaders = ["connection", "keep-alive", "transfer-encoding"];

// fetch decodes compressed bodies, so these Terrain values become incorrect.
const encodedBodyHeaders = ["content-encoding", "content-length"];

/**
 * Sends a request to Terrain and streams the Terrain response to the client.
 * Responds with a 502 status if Terrain cannot be reached.
 *
 * @param {object} req - An Express request.
 * @param {object} res - An Express response.
 * @param {object} options
 * @param {string} options.userID - The userID for logging.
 * @param {string} options.method - The HTTP method of the Terrain request.
 * @param {URL} options.apiURL - The Terrain URL.
 * @param {object} options.headers - The headers to send to Terrain.
 * @param {string[]} [options.forwardHeaders] - The names of client request headers to send to Terrain.
 * @param {object} [options.body] - The request body to stream to Terrain.
 */
export const streamTerrainRequest = async (
    req,
    res,
    { userID, method, apiURL, headers, forwardHeaders = [], body }
) => {
    logger.info(`TERRAIN ${userID} ${method} ${apiURL.href}`);

    const requestHeaders = { ...headers };
    forwardHeaders.forEach((name) => {
        if (req.headers[name]) {
            requestHeaders[name] = req.headers[name];
        }
    });

    const controller = new AbortController();
    res.on("close", () => {
        if (!res.writableFinished) {
            controller.abort();
        }
    });

    let response;
    try {
        response = await fetch(apiURL, {
            method,
            headers: requestHeaders,
            body,
            duplex: body ? "half" : undefined,
            signal: controller.signal,
        });
    } catch (err) {
        if (!controller.signal.aborted) {
            logger.error(err);

            if (!res.headersSent) {
                res.status(502).send("unable to reach Terrain");
            }
        }

        return;
    }

    const bodyDecoded = response.headers.has("content-encoding");
    response.headers.forEach((value, name) => {
        if (
            !connectionHeaders.includes(name) &&
            !(bodyDecoded && encodedBodyHeaders.includes(name))
        ) {
            res.setHeader(name, value);
        }
    });

    res.status(response.status);

    if (!response.body) {
        res.end();
        return;
    }

    try {
        await pipeline(Readable.fromWeb(response.body), res);
    } catch (err) {
        if (!controller.signal.aborted) {
            logger.error(err);
        }
    }
};
