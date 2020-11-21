/**
 * @author sriram
 *
 * Add data handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function dataRouter() {
    const api = express.Router();

    logger.info("************ Adding Data handlers **********");

    logger.info("adding the GET /api/filesystem/paged-directory handler");
    api.get(
        "/filesystem/paged-directory",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/filesystem/paged-directory",
        })
    );

    logger.info("adding the POST /api/filesystem/stat handler");
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

    logger.info("adding the GET /api/filesystem/root handler");
    api.get(
        "/filesystem/root",
        auth.authnTokenMiddleware,
        terrainHandler({ method: "GET", pathname: "/secured/filesystem/root" })
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
        "adding the GET GET /api/filesystem/entry/:resourceId/tags handler"
    );
    api.get(
        "/filesystem/entry/:resourceId/tags",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filesystem/entry/:resourceId/tags",
        })
    );

    logger.info("adding the POST /api/filesystem/user-permissions handler");
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

    logger.info("adding the POST /api/filesystem/delete handler");
    api.post(
        "/filesystem/delete",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filesystem/delete",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/filesystem/directory/create handler");
    api.post(
        "/filesystem/directory/create",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filesystem/directory/create",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /filetypes/type-list handler");
    api.get(
        "/filetypes/type-list",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/filetypes/type-list",
        })
    );

    logger.info("adding the POST /filetypes/type handler");
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

    logger.info("adding the POST /api/filesystem/search handler");
    api.post(
        "/filesystem/search",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/search",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /api/filesystem/file/manifest handler");
    api.get(
        "/filesystem/file/manifest",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/filesystem/file/manifest",
        })
    );

    logger.info("adding the POST /api/filesystem/read-chunk handler");
    api.post(
        "/filesystem/read-chunk",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/read-chunk",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/filesystem/read-csv-chunk handler");
    api.post(
        "/filesystem/read-csv-chunk",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/read-csv-chunk",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/filesystem/anon-files");
    api.post(
        "/filesystem/anon-files",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/anon-files",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
