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

    // Lists all instant launch configurations.
    logger.info("adding the GET /instantlaunch handler");
    api.get("/instantlaunch", auth.authnTokenMiddleware, (req, res) => {});

    // Adds an instant launch configuration.
    logger.info("adding the POST /instantlaunch handler");
    api.post("/instantlaunch", auth.authnTokenMiddleware, (req, res) => {});

    // Deletes an instant launch configuration.
    logger.info("adding the DELETE /instantlaunch/:id handler");
    api.delete(
        "/instantlaunch/:id",
        auth.authnTokenMiddleware,
        (req, res) => {}
    );

    // Instantly launch an application
    logger.info("adding the POST /instantlaunch/go handler");
    api.post("/instantlaunch/go", auth.authnTokenMiddleware, (req, res) => {});

    return api;
};
