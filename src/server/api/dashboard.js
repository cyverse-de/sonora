/**
 * @author sriram
 *
 * Add dashboard handler
 *
 */
import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function dashboardRouter() {
    const api = express.Router();

    logger.info("************ Adding Dashboard handlers **********");

    logger.info("adding the GET /api/dashboard handler");
    api.get(
        "/dashboard",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/dashboard",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /api/resource-usage/data/total handler");
    api.get(
        "/resource-usage/data/total",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/resource-usage/data/total",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );
    return api;
}
