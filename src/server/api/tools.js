import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function toolsRouter() {
    const api = express.Router();

    logger.info("adding the GET /tools handler");
    api.get(
        "/tools",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/tools",
        })
    );

    return api;
}
