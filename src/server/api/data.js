/**
 * @author sriram
 *
 * Add data handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { anonFilesBaseURL } from "../configuration";

import axiosInstance from "../../common/getAxios";

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
            pathname: "/filesystem/stat",
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

    logger.info("adding the POST /api/filesystem/rename handler");
    api.post(
        "/filesystem/rename",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filesystem/rename",
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

    logger.info("adding the POST /api/filesystem/path-list-creator");
    api.post(
        "/filesystem/path-list-creator",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/path-list-creator",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/filesystem/restore");
    api.post(
        "/filesystem/restore",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/restore",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /api/filesystem/trash");
    api.delete(
        "/filesystem/trash",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/filesystem/trash",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/filesystem/move");
    api.post(
        "/filesystem/move",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/move",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );
    logger.info("adding the POST /api/filesystem/:source_id/metadata/copy");
    api.post(
        "/filesystem/:source_id/metadata/copy",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filesystem/:source_id/metadata/copy",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the HEAD /api/filesystem/refresh-cache");
    api.get("/filesystem/refresh-cache", function (req, res) {
        axiosInstance
            .request({
                method: "HEAD",
                url: anonFilesBaseURL + req.query.path,
                headers: { "Cache-Control": "no-cache" },
            })
            .then((apiResponse) => {
                res.set(apiResponse.headers);
                res.status(apiResponse.status);
                res.send(apiResponse.data);
            })
            .catch(async (err) => {
                logger.error(err);
                const e = await err;

                res.status(e.response?.status || 500);
                res.send(e.response?.data);
            });
    });

    return api;
}
