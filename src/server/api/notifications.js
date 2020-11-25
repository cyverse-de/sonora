/**
 * @author psarando, flynn
 *
 * Adds notifications handlers.
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function notificationsRouter() {
    const api = express.Router();

    logger.info("************ Adding Notifications handlers **********");

    logger.info("adding the GET /notifications/messages handler");
    api.get(
        "/notifications/messages",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/notifications/messages",
        })
    );

    logger.info("adding the POST /notifications/seen handler");
    api.post(
        "/notifications/seen",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/notifications/seen",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /notifications/delete handler");
    api.post(
        "/notifications/delete",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/notifications/delete",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
