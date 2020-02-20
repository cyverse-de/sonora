import express from "express";

import * as authStrategy from "../authStrategy";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function apiRouter() {
    logger.info("creating the api router");
    const api = express.Router();

    logger.info("adding the /api/upload handler ");
    api.post(
        "/upload",
        authStrategy.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/fileio/upload",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    );

    logger.info("adding the /api/download handler");
    api.get(
        "/download",
        authStrategy.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/fileio/download",
        })
    );

    logger.info("adding the /api/filesystem/paged-directory handler");
    api.get(
        "/filesystem/paged-directory",
        authStrategy.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filesystem/paged-directory",
        })
    );

    logger.info("adding the /api/filesystem/stat handler");
    api.post(
        "/filesystem/stat",
        authStrategy.authnTokenMiddleware,
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
        authStrategy.authnTokenMiddleware,
        terrainHandler({ method: "GET", pathname: "/secured/filesystem/root" })
    );

    logger.info("adding the /api/profile handler");
    api.get("/profile", (req, res) => {
        if (req.user) {
            res.json({
                id: req.user.profile.id,
                attributes: req.user.profile.attributes,
            });
        } else {
            res.json(null);
        }
    });

    return api;
}
