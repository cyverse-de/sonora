/**
 * @author sriram, psarando
 *
 * Adds analyses handlers.
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function analysesRouter() {
    const api = express.Router();

    logger.info("************ Adding Analyses handlers **********");

    logger.info("adding the GET /analyses handler");
    api.get(
        "/analyses",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/analyses",
        })
    );

    logger.info("adding the POST /analyses handler");
    api.post(
        "/analyses",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /analyses/relauncher handler");
    api.post(
        "/analyses/relauncher",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses/relauncher",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /analyses/shredder handler");
    api.post(
        "/analyses/shredder",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses/shredder",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the PATCH /analyses/:id handler");
    api.patch(
        "/analyses/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/analyses/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /analyses/:id/history");
    api.get(
        "/analyses/:id/history",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/analyses/:id/history",
        })
    );

    logger.info("adding the GET /analyses/:id/parameters");
    api.get(
        "/analyses/:id/parameters",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/analyses/:id/parameters",
        })
    );

    logger.info("adding the GET /analyses/:id/relaunch-info handler");
    api.get(
        "/analyses/:id/relaunch-info",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/analyses/:id/relaunch-info",
        })
    );

    logger.info("adding the POST /analyses/:id/stop handler");
    api.post(
        "/analyses/:id/stop",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses/:id/stop",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /analyses/permission-lister handler");
    api.post(
        "/analyses/permission-lister",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses/permission-lister",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /analyses/:id/time-limit handler");
    api.post(
        "/analyses/:id/time-limit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses/:id/time-limit",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /analyses/:id/time-limit handler");
    api.get(
        "/analyses/:id/time-limit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/analyses/:id/time-limit",
        })
    );

    return api;
}
