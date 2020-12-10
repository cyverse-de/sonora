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
    )

    return api;
}
