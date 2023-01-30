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

    // List of plan names
    logger.info("adding the GET /qms/plans handler");
    api.get(
        "/qms/plans",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/qms/plans",
        })
    );

    // Get all subscriptions
    logger.info("adding the GET /admin/qms/subscriptions handler");
    api.get(
        "/admin/qms/subscriptions",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/qms/subscriptions",
        })
    );

    // Administrators can update a user's subscrption
    // Administrators can add new subscriptions for users who haven't logged into the DE yet
    logger.info("adding the POST /admin/qms/subscriptions handler");
    api.post(
        "/admin/qms/subscriptions",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/qms/subscriptions",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    // Administrators can update user quotas for a specified resource type
    logger.info(
        "adding the POST /admin/qms/users/:username/plan/:resource-type/quota"
    );
    api.post(
        "/admin/qms/users/:username/plan/:resource-type/quota",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/qms/users/:username/plan/:resource-type/quota",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
