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

    logger.info("adding the PUT /instantlaunches");
    api.put(
        "/instantlaunches",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/instant-launches",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /instantlaunches handler");
    api.get(
        "/instantlaunches",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/instant-launches",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /instantlaunches/:id/metadata handler");
    api.get(
        "/instantlaunches/:id/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/instant-launches/:id/metadata",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("Adding the POST /instantlaunches/:id/metadata handler");
    api.post(
        "/instantlaunches/:id/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/instant-launches/:id/metadata",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("Add the PUT /instantlaunches:id/metadata handler");
    api.put(
        "/instantlaunches/:id/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/instant-launches/:id/metadata",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
};
