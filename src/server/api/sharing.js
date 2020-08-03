/**
 * @author sriram
 *
 * Add sharing handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function sharingRouter() {
    const api = express.Router();

    logger.info("************ Adding Sharing handlers **********");

    logger.info("adding the POST /share handler");
    api.post(
        "/share",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/share",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /unshare handler");
    api.post(
        "/unshare",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/unshare",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
