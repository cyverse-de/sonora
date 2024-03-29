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

    logger.info("adding the GET /apps/pipelines/:appId/ui handler");
    api.get(
        "/apps/pipelines/:appId/ui",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/pipelines/:appId/ui",
        })
    );

    logger.info("adding the POST /apps/pipelines/:appId/versions handler");
    api.post(
        "/apps/pipelines/:appId/versions",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/pipelines/:appId/versions",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the PUT /apps/pipelines/:appId/versions/:versionId handler"
    );
    api.put(
        "/apps/pipelines/:appId/versions/:versionId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/apps/pipelines/:appId/versions/:versionId",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the POST /apps/pipelines/:appId/versions/:versionId/copy handler"
    );
    api.post(
        "/apps/pipelines/:appId/versions/:versionId/copy",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/pipelines/:appId/versions/:versionId/copy",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the GET /apps/pipelines/:appId/versions/:versionId/ui handler"
    );
    api.get(
        "/apps/pipelines/:appId/versions/:versionId/ui",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/pipelines/:appId/versions/:versionId/ui",
        })
    );

    return api;
}
