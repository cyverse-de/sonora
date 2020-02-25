import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";
import uploadHandler from "./uploads";

export default function apiRouter() {
    logger.info("creating the api router");
    const api = express.Router();

    logger.info("adding the /api/upload handler ");
    api.post("/upload", auth.authnTokenMiddleware, uploadHandler);

    logger.info("adding the /api/download handler");
    api.get(
        "/download",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/fileio/download",
        })
    );

    logger.info("adding the /api/filesystem/paged-directory handler");
    api.get(
        "/filesystem/paged-directory",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filesystem/paged-directory",
        })
    );

    logger.info("adding the /api/filesystem/stat handler");
    api.post(
        "/filesystem/stat",
        auth.authnTokenMiddleware,
        terrainHandler({
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
        auth.authnTokenMiddleware,
        terrainHandler({ method: "GET", pathname: "/secured/filesystem/root" })
    );

    logger.info("adding the /api/profile handler");
    api.get("/profile", (req, res) => res.json(auth.getUserProfile(req)));

    return api;
}
