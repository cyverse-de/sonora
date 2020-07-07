import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function tagsRouter() {
    const api = express.Router();

    logger.info("adding the GET /api/tags/suggestions handler");
    api.get(
        "/tags/suggestions",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/tags/suggestions",
        })
    );

    logger.info("adding the POST /api/tags/user handler");
    api.post(
        "/tags/user",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/tags/user",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
