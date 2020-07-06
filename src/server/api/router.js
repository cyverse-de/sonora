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

    logger.info("adding the /api/dashboard handler");
    api.get(
        "/dashboard",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/dashboard",
            headers: {
                "Content-Type": "application/json",
            },
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

    logger.info("adding the /api/fileio/urlupload handler");
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

    logger.info("adding the /apps/categories/:systemId/:categoryId handler");
    api.get(
        "/apps/categories/:systemId/:categoryId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/categories/:systemId/:categoryId",
        })
    );

    logger.info("adding the /apps/:systemId/:appId handler");
    api.get(
        "/apps/:systemId/:appId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId",
        })
    );

    logger.info("adding the /apps/:systemId/:appId/details handler");
    api.get(
        "/apps/:systemId/:appId/details",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/details",
        })
    );

    logger.info("adding the PUT /apps/:systemId/:appId/favorite handler");
    api.put(
        "/apps/:systemId/:appId/favorite",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/apps/:systemId/:appId/favorite",
        })
    );

    logger.info("adding the DELETE /apps/:systemId/:appId/favorite handler");
    api.delete(
        "/apps/:systemId/:appId/favorite",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/apps/:systemId/:appId/favorite",
        })
    );

    logger.info("adding the POST /apps/:systemId/:appId/rating handler");
    api.post(
        "/apps/:systemId/:appId/rating",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/:systemId/:appId/rating",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /apps/:systemId/:appId/rating handler");
    api.delete(
        "/apps/:systemId/:appId/rating",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/apps/:systemId/:appId/rating",
        })
    );

    logger.info("adding the GET /analyses handler");
    api.get(
        "/analyses",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/analyses",
        })
    );

    logger.info("adding the POST /analyses handler");
    api.post(
        "/analyses",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding /analyses/:id/history");
    api.get(
        "/analyses/:id/history",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/analyses/:id/history",
        })
    );

    logger.info("adding /analyses/:id/parameters");
    api.get(
        "/analyses/:id/parameters",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/analyses/:id/parameters",
        })
    );

    logger.info("adding the POST /quicklaunches handler");
    api.post(
        "/quicklaunches",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/quicklaunches",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /tools handler");
    api.get(
        "/tools",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/tools",
        })
    );

    logger.info("add the GET /admin/vice/resources handler");
    api.get(
        "/admin/vice/resources",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/vice/resources",
        })
    );

    logger.info("add the GET /admin/vice/async-data handler");
    api.get(
        "/admin/vice/async-data",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/vice/async-data",
        })
    );

    logger.info(
        "add the GET /admin/vice/analyses/:analysisID/time-limit handler"
    );
    api.get(
        "/admin/vice/analyses/:analysisID/time-limit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/vice/analyses/:analysisID/time-limit",
        })
    );

    logger.info(
        "add the POST /admin/vice/analyses/:analysisID/time-limit handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/time-limit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/time-limit",
        })
    );

    logger.info(
        "add the GET /admin/vice/analyses/:analysisID/external-id handler"
    );
    api.get(
        "/admin/vice/analyses/:analysisID/external-id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/vice/analyses/:analysisID/external-id",
        })
    );

    logger.info("add the POST /admin/vice/analyses/:analysisID/exit handler");
    api.post(
        "/admin/vice/analyses/:analysisID/exit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/exit",
        })
    );

    logger.info(
        "add the POST /admin/vice/analyses/:analysisID/save-and-exit handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/save-and-exit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/save-and-exit",
        })
    );

    logger.info(
        "add the POST /admin/vice/analyses/:analysisID/save-output-files handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/save-output-files",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/save-output-files",
        })
    );

    logger.info(
        "add the POST /admin/vice/analyses/:analysisID/download-input-files handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/download-input-files",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/download-input-files",
        })
    );

    logger.info(
        "add the GET /admin/vice/concurrent-job-limits/:username handler"
    );
    api.get(
        "/admin/vice/concurrent-job-limits/:username",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/settings/concurrent-job-limits/:username",
        })
    );

    logger.info(
        "add the PUT /admin/vice/concurrent-job-limits/:username handler"
    );
    api.put(
        "/admin/vice/concurrent-job-limits/:username",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/settings/concurrent-job-limits/:username",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
