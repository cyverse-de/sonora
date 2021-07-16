/**
 * Pipelines handlers
 *
 * @author psarando
 */
import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function pipelinesRouter() {
    const api = express.Router();

    logger.info("************ Adding Pipelines handlers **********");

    logger.info("adding the POST /apps/pipelines handler");
    api.post(
        "/apps/pipelines",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/pipelines",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the PUT /apps/pipelines/:appId handler");
    api.put(
        "/apps/pipelines/:appId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/apps/pipelines/:appId",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /apps/pipelines/:appId/copy handler");
    api.post(
        "/apps/pipelines/:appId/copy",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/pipelines/:appId/copy",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /apps/pipelines/:appId/ui handler");
    api.get(
        "/apps/pipelines/:appId/ui",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/pipelines/:appId/ui",
        })
    );

    return api;
}
