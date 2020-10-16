/**
 * @author flynn
 *
 * Add notification handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function notificationsRouter() {
    const api = express.Router();

    logger.info("************ Adding Notification handlers **********");

    logger.info("adding the GET /api/notifications/last-ten-messages");
    api.get(
        "/notifications/last-ten-messages",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/notifications/last-ten-messages",
        })
    );

    return api;
}
