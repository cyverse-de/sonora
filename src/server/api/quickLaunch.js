/**
 * @author sriram
 *
 * Add Quick Launch handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function quickLaunchRouter() {
    const api = express.Router();

    logger.info("************ Adding Quick launch handlers **********");

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

    logger.info("adding the GET /quicklaunches/apps/:appId handler");
    api.get(
        "/quicklaunches",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/quicklaunches/apps/:appId",
        })
    );

    return api;
}
