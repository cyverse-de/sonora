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
            pathname: "/filesystem/paged-directory",
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

    logger.info("adding the /api/tags/suggestions handler");
    api.get(
        "/tags/suggestions",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/tags/suggestions",
        })
    );

    logger.info("adding the /api/tags/user handler");
    api.post(
        "/tags/user",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/tags/user",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the PATCH /api/filesystem/entry/:resourceId/tags handler"
    );
    api.patch(
        "/filesystem/entry/:resourceId/tags",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/secured/filesystem/entry/:resourceId/tags",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the GET /api/filesystem/entry/:resourceId/tags handler"
    );
    api.get(
        "/filesystem/entry/:resourceId/tags",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filesystem/entry/:resourceId/tags",
        })
    );

    logger.info("adding the /api/filesystem/user-permissions handler");
    api.post(
        "/filesystem/user-permissions",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filesystem/user-permissions",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the /api/user-info handler");
    api.get(
        "/user-info",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/user-info",
        })
    );

    logger.info("adding the /filetypes/type-list handler");
    api.get(
        "/filetypes/type-list",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filetypes/type-list",
        })
    );

    logger.info("adding the /filetypes/type handler");
    api.post(
        "/filetypes/type",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filetypes/type",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the /share handler");
    api.post(
        "/share",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/share",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the /apps/categories handler");
    api.get(
        "/apps/categories",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/categories",
        })
    );

    logger.info("adding the /apps handler");
    api.get(
        "/apps",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps",
        })
    );

    return api;
}
