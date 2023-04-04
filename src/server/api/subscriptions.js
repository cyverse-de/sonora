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

    // Get plan names
    logger.info("adding the GET /qms/plans handler");
    api.get(
        "/qms/plans",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/qms/plans",
        })
    );

    // Get resource types
    logger.info("adding the GET /qms/resource-types");
    api.get(
        "/qms/resource-types",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/qms/resource-types",
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

    // Get all available add-ons
    logger.info("adding the GET /admin/qms/addons handler");
    api.get(
        "/admin/qms/addons",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/qms/addons",
        })
    );

    // Get add-ons of a user's subscription
    logger.info(
        "adding the GET /admin/qms/subscriptions/:subscription_uuid/addons handler"
    );
    api.get(
        "/admin/qms/subscriptions/:subscription_uuid/addons",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/qms/subscriptions/:subscription_uuid/addons",
        })
    );

    // Administrators can add an add-on to a subscription
    logger.info(
        "adding the POST /admin/qms/subscriptions/:subscription_uuid/addons handler"
    );
    api.post(
        "/admin/qms/subscriptions/:subscription_uuid/addons",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/qms/subscriptions/:subscription_uuid/addons",
            headers: {
                "Content-Type": "application/json",
            },
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

    // Administrators can update an available add-on
    logger.info("adding the PUT /admin/qms/addons handler");
    api.put(
        "/admin/qms/addons",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/qms/addons",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );
    // Administrators can update user quotas for a specified resource type
    logger.info(
        "adding the POST /admin/qms/users/:username/plan/:resource_type/quota handler"
    );
    api.post(
        "/admin/qms/users/:username/plan/:resource_type/quota",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/qms/users/:username/plan/:resource_type/quota",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    // Administrators can create an available add-on
    logger.info("adding the POST /admin/qms/addons/ handler");
    api.post(
        "/admin/qms/addons",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/qms/addons",
            headers: { "Content-Type": "application/json" },
        })
    );

    // Administrators can delete an available add-on
    logger.info("adding the DELETE /admin/qms/addons/:uuid handler");
    api.delete(
        "/admin/qms/addons/:uuid",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/admin/qms/addons/:uuid",
        })
    );
    return api;
}
