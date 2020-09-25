/**
 * Adds support endpoint handlers
 *
 * @author psarando
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function supportRouter() {
    const api = express.Router();

    logger.info("************ Adding Support handlers **********");

    logger.info("adding the POST /support-email handler");
    api.post(
        "/support-email",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/support-email",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
