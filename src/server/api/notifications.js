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

    logger.info("adding the POST /notifications/mark-all-seen handler");
    api.post(
        "/notifications/mark-all-seen",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/notifications/mark-all-seen",
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

    logger.info("************ Adding Alerts handlers **********");
    logger.info("adding the GET /alerts/all handler");
    api.get(
        "/alerts/all",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/alerts/all",
        })
    );

    logger.info("adding the GET /alerts/active handler");
    api.get(
        "/alerts/active",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/alerts/active",
        })
    );

    logger.info("adding the POST /admin/alerts handler");
    api.post(
        "/admin/alerts",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/alerts",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /admin/alerts handler");
    api.delete(
        "/admin/alerts",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/admin/alerts",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
