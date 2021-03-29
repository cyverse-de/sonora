/**
 * @author sarahr
 */

import express from "express";
import * as auth from "../auth";

import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function oauthRouter() {
    const api = express.Router();

    logger.info("************ Adding OAuth handlers **********");

    logger.info("adding the GET /oauth/access-code/:apiName handler");
    api.get(
        "/oauth/access-code/:apiName",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/oauth/access-code/:apiName",
        })
    );

    return api;
}
