/**
 * @author johnworth
 *
 * Add handlers for instant launches. Likely orchestrates calls to the terrain endpoints.
 */

import express from "express";

import { handler as terrainHandler } from "./terrain";
import * as auth from "../auth";
import logger from "../logging";

export default () => {
    const api = express.Router();

    logger.info("************ Adding Instant Launch handlers **********");

    // Get the default instant launch mapping.
    logger.info("adding the GET /instantlaunches/mappings/defaults/latest");
    api.get(
        "/instantlaunches/mappings/defaults/latest",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/instantlaunches/mappings/defaults/latest",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
};
