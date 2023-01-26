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

    // This info is also all returned after getting all subscriptions
    // Administrators can list existing subscriptions for a user
    logger.info("adding the GET /admin/qms/users/:username/plan handler");
    api.get(
        "/admin/qms/users/:username/plan",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/qms/users/:username/plan",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    // Administrators can update a user's subscrption
    logger.info(
        "adding the PUT /admin/qms/users/:username/plan/:plan-name handler"
    );
    api.put(
        "/admin/qms/users/:username/plan/:plan-name",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/qms/users/:username/plan/:plan-name",
        })
    );

    // Administrators can add new subscriptions for users who haven't logged into the DE yet
    // POST /terrain/admin/qms/subscriptions (one or multiple subscriptions) -- has more details after
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

    // User lookup
    // logger.info("adding the GET /subjects handler");
    // api.get(
    //     "/subjects",
    //     auth.authnTokenMiddleware,
    //     terrainHandler({
    //         method: "GET",
    //         pathname: "/subjects",
    //     })
    // );
    return api;
}
