/**
 * @author sriram
 *
 * Add tools handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function toolsRouter() {
    const api = express.Router();

    logger.info("************ Adding Tools handlers **********");

    logger.info("adding the GET /tools handler");
    api.get(
        "/tools",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/tools",
        })
    );

    logger.info("adding the POST /tools/permission-lister handler");
    api.post(
        "/tools/permission-lister",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/tools/permission-lister",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /tools/:id handler");
    api.get(
        "/tools/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/tools/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /tools/:id/apps handler");
    api.get(
        "/tools/:id/apps",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/tools/:id/apps",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /api/apps/elements/tool-types handler");
    api.get(
        "/apps/elements/tool-types",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/elements/tool-types",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/tools handler");
    api.post(
        "/tools",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/tools",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the PATCH /api/tools/:id handler");
    api.patch(
        "/tools/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/tools/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/tool-requests handler");
    api.post(
        "/tool-requests",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/tool-requests",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /api/tools/:id handler");
    api.delete(
        "/tools/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/tools/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /admin/tools handler");
    api.get(
        "/admin/tools",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/tools",
        })
    );

    logger.info("adding the GET /admin/tools/:id handler");
    api.get(
        "/admin/tools/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/tools/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the PATCH /api/admin/tools/:id handler");
    api.patch(
        "/admin/tools/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/admin/tools/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/admin/tools handler");
    api.post(
        "/admin/tools",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/tools",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /admin/tool-requests handler");
    api.get(
        "/admin/tool-requests",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/tool-requests",
        })
    );

    logger.info("adding the GET /api/admin/tool-requests/:id handler");
    api.get(
        "/admin/tool-requests/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/tool-requests/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
