/**
 * @author sriram
 *
 * Add doi handler
 *
 */
import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function doiRouter() {
    const api = express.Router();

    logger.info("************ Adding DOI handlers **********");

    logger.info("adding the GET /admin/permanent-id-requests handler");
    api.get(
        "/admin/permanent-id-requests",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/permanent-id-requests",
        })
    );

    logger.info("adding the GET /admin/permanent-id-requests/:id handler");
    api.get(
        "/admin/permanent-id-requests/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/permanent-id-requests/:id",
        })
    );

    logger.info(
        "adding the POST /admin/permanent-id-requests/:id/status handler"
    );
    api.post(
        "/admin/permanent-id-requests/:id/status",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/permanent-id-requests/:id/status",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the POST /admin/permanent-id-requests/:id/ezid handler"
    );
    api.post(
        "/admin/permanent-id-requests/:id/ezid",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/permanent-id-requests/:id/ezid",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /permanent-id-requests handler");
    api.post(
        "/permanent-id-requests",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/permanent-id-requests",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
