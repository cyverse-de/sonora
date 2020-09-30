/**
 * @author sriram
 *
 * Add fileio handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";
import uploadHandler from "./uploads";
import downloadHandler from "./downloads";

export default function fileIORouter() {
    const api = express.Router();

    logger.info("************ Adding File I/O handlers **********");

    logger.info("adding the POST /api/upload handler");
    api.post("/upload", auth.authnTokenMiddleware, uploadHandler);

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

    return api;
}
