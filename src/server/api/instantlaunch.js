/**
 * @author johnworth
 *
 * Add handlers for instant launches. Likely orchestrates calls to the terrain endpoints.
 */

import express from "express";

import * as auth from "server/auth";
import logger from "server/logging";

export default () => {
    const api = express.Router();

    logger.info("************ Adding Instant Launch handlers **********");

    // Get the default instant launch mapping.
    logger.info("adding the GET /instantlaunch/mappings/default/latest");
    api.get(
        "/instantlaunch/mappings/default/latest",
        auth.authnTokenMiddleware,
        (req, res) => {}
    );

    // Instantly launch an application
    logger.info("adding the POST /instantlaunch/go handler");
    api.post("/instantlaunch/go", auth.authnTokenMiddleware, (req, res) => {});

    return api;
};
