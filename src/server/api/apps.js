/**
 * @author sriram, psarando
 *
 * Add apps handler
 *
 */
import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function appsRouter() {
    const api = express.Router();

    logger.info("************ Adding Apps handlers **********");

    logger.info("adding the GET /apps/categories handler");
    api.get(
        "/apps/categories",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/categories",
        })
    );

    logger.info("adding the GET /apps handler");
    api.get(
        "/apps",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps",
        })
    );

    logger.info("adding the POST /apps/:systemId handler");
    api.post(
        "/apps/:systemId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/:systemId",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the GET /apps/categories/:systemId/:categoryId handler"
    );
    api.get(
        "/apps/categories/:systemId/:categoryId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/categories/:systemId/:categoryId",
        })
    );

    logger.info("adding the GET /apps/:systemId/:appId handler");
    api.get(
        "/apps/:systemId/:appId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId",
        })
    );

    logger.info("adding the PUT /apps/:systemId/:appId handler");
    api.put(
        "/apps/:systemId/:appId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/apps/:systemId/:appId",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /apps/:systemId/:appId/listing handler");
    api.get(
        "/apps/:systemId/:appId/listing",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/listing",
        })
    );

    logger.info("adding the GET /apps/:systemId/:appId/details handler");
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

    logger.info("adding the GET /apps/:systemId/:appId/ui handler");
    api.get(
        "/apps/:systemId/:appId/ui",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/ui",
        })
    );

    logger.info("adding the POST /apps/permission-lister handler");
    api.post(
        "/apps/permission-lister",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/permission-lister",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /apps/:systemId/:appId/documentation handler");
    api.get(
        "/apps/:systemId/:appId/documentation",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/documentation",
        })
    );

    logger.info(
        "adding the PATCH /apps/:systemId/:appId/documentation handler"
    );
    api.patch(
        "/apps/:systemId/:appId/documentation",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/apps/:systemId/:appId/documentation",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("************ Adding Admin Apps handlers **********");
    logger.info("adding the GET /admin/apps handler");
    api.get(
        "/admin/apps",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/apps",
        })
    );

    logger.info("adding the GET /admin/apps/:systemId/:appId/details handler");
    api.get(
        "/admin/apps/:systemId/:appId/details",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/apps/:systemId/:appId/details",
        })
    );

    logger.info("adding the PATCH /admin/apps/:systemId/:appId handler");
    api.patch(
        "/admin/apps/:systemId/:appId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/admin/apps/:systemId/:appId",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the POST /admin/apps/:systemId/:appId/documentation handler"
    );
    api.post(
        "/admin/apps/:systemId/:appId/documentation",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/apps/:systemId/:appId/documentation",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the PATCH /admin/apps/:systemId/:appId/documentation handler"
    );
    api.patch(
        "/admin/apps/:systemId/:appId/documentation",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/admin/apps/:systemId/:appId/documentation",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /admin/apps/:appId/metadata handler");
    api.get(
        "/admin/apps/:appId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/apps/:appId/metadata",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /admin/apps/:appId/metadata handler");
    api.post(
        "/admin/apps/:appId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/apps/:appId/metadata",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the PUT /admin/apps/:appId/metadata handler");
    api.put(
        "/admin/apps/:appId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/apps/:appId/metadata",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /admin/apps/publication-requests handler");
    api.get(
        "/admin/apps/publication-requests",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/apps/publication-requests",
        })
    );

    logger.info("adding the POST /admin/apps/:systemId/:appId/publish handler");
    api.post(
        "/admin/apps/:systemId/:appId/publish",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/apps/:systemId/:appId//publish",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
