/**
 * @author sriram
 *
 * Add fileio handler
 *
 */

import express from "express";

import * as auth from "../auth";
import { requestTimeoutUploads } from "../configuration";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";
import uploadHandler from "./uploads";
import downloadHandler from "./downloads";

export function bodyTimeout(ms) {
    return (req, res, next) => {
        if (ms > 0) {
            const timer = setTimeout(() => {
                if (!res.headersSent) {
                    res.status(408).send({ message: "request timeout" });
                }
                logger.warn(
                    `request timeout after ${ms} ms for ${req.method} ${req.originalUrl}`
                );
                req.destroy();
            }, ms);

            const clear = () => clearTimeout(timer);
            res.on("finish", clear);
            res.on("close", clear); // client/socket gone
        }

        if (!req.socket.destroyed) {
            next();
        }
    };
}

export function fileUploadRouter() {
    const api = express.Router();

    logger.info("************ Adding File Upload handler **********");

    logger.info("adding the POST /api/upload handler");
    // Set a long (or zero = unlimited) request timeout for uploads.
    api.post(
        "/upload",
        bodyTimeout(requestTimeoutUploads),
        auth.authnTokenMiddleware,
        uploadHandler
    );

    return api;
}

export default function fileIORouter() {
    const api = express.Router();

    logger.info("************ Adding File I/O handlers **********");

    logger.info("adding the POST /api/fileio/urlupload handler");
    api.post(
        "/fileio/urlupload",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/fileio/urlupload",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/fileio/save");
    api.post(
        "/fileio/save",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/fileio/save",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/fileio/saveas");
    api.post(
        "/fileio/saveas",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/fileio/saveas",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /api/download handler");
    api.get("/download", auth.authnTokenMiddleware, downloadHandler);

    logger.info("adding the GET /api/downloadText handler");
    api.get("/downloadText", function (req, res) {
        res.set({
            "Content-Disposition": `attachment; filename=${
                req.fileName || "de-download.txt"
            }`,
        });
        res.send(req.query.text);
    });

    return api;
}
