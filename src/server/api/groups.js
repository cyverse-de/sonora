/**
 * @author aramsey
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function groupsRouter() {
    const api = express.Router();

    logger.info("************ Adding Groups Handlers **********");

    logger.info("adding the GET /teams handler");
    api.get(
        "/teams",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/teams",
        })
    );

    return api;
}
