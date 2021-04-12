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
    logger.info(
        "adding the GET /instantlaunches/mappings/defaults/latest handler"
    );
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

    logger.info(
        "adding the POST /instantlaunches/mappings/defaults/latest handler"
    );
    api.post(
        "/instantlaunches/mappings/defaults/latest",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/instant-launches/mappings/defaults/latest",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the PUT /instantlaunches/mappings/defaults/latest handler"
    );
    api.put(
        "/instantlaunches/mappings/defaults/latest",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/instant-launches/mappings/defaults/latest",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the PUT /instantlaunches handler");
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
            pathname: "/instantlaunches",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /instantlaunches/full handler");
    api.get(
        "/instantlaunches/full",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/instantlaunches/full",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /instantlaunches/metadata/full handler");
    api.get(
        "/instantlaunches/metadata/full",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/instant-launches/metadata/full",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("add the DELETE /instantlaunches/:id handler");
    api.delete(
        "/instantlaunches/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/admin/instant-launches/:id",
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

    logger.info("Add the PUT /instantlaunches/:id/metadata handler");
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
