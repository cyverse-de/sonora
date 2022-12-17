/**
 * @author sboleyn
 *
 * Add subscriptions to handler
 *
 */
import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function subscriptionsRouter() {
    const api = express.Router();

    logger.info("************ Adding subscription handlers **********");

    // Example
    // logger.info("adding the GET api/terrain/admin/qms/subscriptions");
    // api.get(
    //     "/terrain/admin/qms/subscriptions",
    //     auth.authnTokenMiddleware,
    //     terrainHandler({
    //         method: "GET",
    //         pathname: "/terrain/admin/qms/subscriptions",
    //     })
    // );

    // Requirements
    // Administrators can list existing subscriptions

    // Administrators can update a user's subscrption

    // Administrators can add new subscriptions for users who haven't logged into the DE yet

    logger.info("adding the GET /apps/categories/featured handler");
    api.get(
        // "/apps/categories/featured",
        "/admin/qms/subscriptions",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            // pathname: "/apps/categories/featured",
            pathname: "/admin/qms/subscriptions",
        })
    );
    return api;
}
