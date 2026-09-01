/**
 * Express router for admin resource preset endpoints.
 * Proxies requests to Terrain's /admin/resource-presets API.
 */
import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function resourcePresetsRouter() {
    const api = express.Router();

    logger.info("************ Adding resource preset handlers **********");

    logger.info("adding the GET /resource-presets handler");
    api.get(
        "/resource-presets",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/resource-presets",
        })
    );

    logger.info("adding the GET /admin/resource-presets handler");
    api.get(
        "/admin/resource-presets",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/resource-presets",
        })
    );

    logger.info("adding the POST /admin/resource-presets handler");
    api.post(
        "/admin/resource-presets",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/resource-presets",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /admin/resource-presets/:id handler");
    api.get(
        "/admin/resource-presets/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/resource-presets/:id",
        })
    );

    logger.info("adding the PATCH /admin/resource-presets/:id handler");
    api.patch(
        "/admin/resource-presets/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/admin/resource-presets/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /admin/resource-presets/:id handler");
    api.delete(
        "/admin/resource-presets/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/admin/resource-presets/:id",
        })
    );

    logger.info("adding the PUT /admin/resource-presets/:id/default handler");
    api.put(
        "/admin/resource-presets/:id/default",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/resource-presets/:id/default",
        })
    );

    return api;
}
