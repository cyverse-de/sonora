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

    logger.info("adding the GET /apps/elements/info-types handler");
    api.get(
        "/apps/elements/info-types",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/elements/info-types",
        })
    );

    logger.info("adding the DELETE /apps/:appId/communities handler");
    api.delete(
        "/apps/:appId/communities",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/apps/:appId/communities",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /apps/:appId/communities handler");
    api.post(
        "/apps/:appId/communities",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/:appId/communities",
            headers: {
                "Content-Type": "application/json",
            },
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

    logger.info("adding the GET /apps/categories/featured handler");
    api.get(
        "/apps/categories/featured",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/categories/featured",
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

    logger.info("adding the DELETE /apps/:systemId/:appId handler");
    api.delete(
        "/apps/:systemId/:appId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/apps/:systemId/:appId",
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

    logger.info("adding the GET /apps/:systemId/:appId/tasks handler");
    api.get(
        "/apps/:systemId/:appId/tasks",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/tasks",
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

    logger.info("adding the POST /apps/:systemId/:appId/versions handler");
    api.post(
        "/apps/:systemId/:appId/versions",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/:systemId/:appId/versions",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the GET /apps/:systemId/:appId/versions/:versionId handler"
    );
    api.get(
        "/apps/:systemId/:appId/versions/:versionId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/versions/:versionId",
        })
    );

    logger.info(
        "adding the PATCH /apps/:systemId/:appId/versions/:versionId handler"
    );
    api.patch(
        "/apps/:systemId/:appId/versions/:versionId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/apps/:systemId/:appId/versions/:versionId",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the PUT /apps/:systemId/:appId/versions/:versionId handler"
    );
    api.put(
        "/apps/:systemId/:appId/versions/:versionId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/apps/:systemId/:appId/versions/:versionId",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the POST /apps/:systemId/:appId/versions/:versionId/copy handler"
    );
    api.post(
        "/apps/:systemId/:appId/versions/:versionId/copy",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/:systemId/:appId/versions/:versionId/copy",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the GET /apps/:systemId/:appId/versions/:versionId/details handler"
    );
    api.get(
        "/apps/:systemId/:appId/versions/:versionId/details",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/versions/:versionId/details",
        })
    );

    logger.info(
        "adding the GET /apps/:systemId/:appId/versions/:versionId/ui handler"
    );
    api.get(
        "/apps/:systemId/:appId/versions/:versionId/ui",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/versions/:versionId/ui",
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

    logger.info(
        "adding the GET /apps/:systemId/:appId/versions/:versionId/documentation handler"
    );
    api.get(
        "/apps/:systemId/:appId/versions/:versionId/documentation",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname:
                "/apps/:systemId/:appId/versions/:versionId/documentation",
        })
    );

    logger.info(
        "adding the PATCH /apps/:systemId/:appId/versions/:versionId/documentation handler"
    );
    api.patch(
        "/apps/:systemId/:appId/versions/:versionId/documentation",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname:
                "/apps/:systemId/:appId/versions/:versionId/documentation",
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

    logger.info("adding the POST /apps/:systemId/:appId/publish handler");
    api.post(
        "/apps/:systemId/:appId/publish",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/:systemId/:appId/publish",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
