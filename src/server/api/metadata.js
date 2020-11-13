/**
 * @author psarando
 *
 * Adds metadata handlers.
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function notificationsRouter() {
    const api = express.Router();

    logger.info("************ Adding Metadata handlers **********");

    logger.info("adding the GET /api/filesystem/:dataId/metadata handler");
    api.get(
        "/filesystem/:dataId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filesystem/:dataId/metadata",
        })
    );

    logger.info("adding the POST /api/filesystem/:dataId/metadata handler");
    api.post(
        "/filesystem/:dataId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filesystem/:dataId/metadata",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
