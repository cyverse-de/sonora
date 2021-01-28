/**
 * @author sriram
 *
 * Add doi handler
 *
 */
import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function doiRouter() {
    const api = express.Router();

    logger.info("************ Adding DOI handlers **********");

    logger.info("adding the GET /admin/permanent-id-requests handler");

    api.get(
        "/admin/permanent-id-requests",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/permanent-id-requests",
        })
    );

    return api;
}
