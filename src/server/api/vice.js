/**
 * @author sriram
 *
 * Add vice handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function viceRouter() {
    const api = express.Router();

    logger.info("************ Adding VICE handlers **********");

    logger.info("adding the GET /admin/vice/resources handler");
    api.get(
        "/admin/vice/resources",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/vice/resources",
        })
    );

    logger.info("adding the GET /admin/vice/async-data handler");
    api.get(
        "/admin/vice/async-data",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/vice/async-data",
        })
    );

    logger.info(
        "adding the GET /admin/vice/analyses/:analysisID/time-limit handler"
    );
    api.get(
        "/admin/vice/analyses/:analysisID/time-limit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/vice/analyses/:analysisID/time-limit",
        })
    );

    logger.info(
        "adding the POST /admin/vice/analyses/:analysisID/time-limit handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/time-limit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/time-limit",
        })
    );

    logger.info(
        "adding the GET /admin/vice/analyses/:analysisID/external-id handler"
    );
    api.get(
        "/admin/vice/analyses/:analysisID/external-id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/vice/analyses/:analysisID/external-id",
        })
    );

    logger.info(
        "adding the POST /admin/vice/analyses/:analysisID/exit handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/exit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/exit",
        })
    );

    logger.info(
        "adding the POST /admin/vice/analyses/:analysisID/save-and-exit handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/save-and-exit",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/save-and-exit",
        })
    );

    logger.info(
        "adding the POST /admin/vice/analyses/:analysisID/save-output-files handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/save-output-files",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/save-output-files",
        })
    );

    logger.info(
        "adding the POST /admin/vice/analyses/:analysisID/download-input-files handler"
    );
    api.post(
        "/admin/vice/analyses/:analysisID/download-input-files",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/vice/analyses/:analysisID/download-input-files",
        })
    );

    logger.info(
        "adding the GET /admin/vice/concurrent-job-limits/:username handler"
    );
    api.get(
        "/admin/vice/concurrent-job-limits/:username",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/settings/concurrent-job-limits/:username",
        })
    );

    logger.info(
        "adding the PUT /admin/vice/concurrent-job-limits/:username handler"
    );
    api.put(
        "/admin/vice/concurrent-job-limits/:username",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/admin/settings/concurrent-job-limits/:username",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /vice/resources handler");
    api.get(
        "/vice/resources",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/vice/resources",
        })
    );

    logger.info("adding the GET /vice/:host/description handler");
    api.get(
        "/vice/:host/description",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/vice/:host/description",
        })
    );

    logger.info("adding the GET /vice/:host/url-ready handler");
    api.get(
        "/vice/:host/url-ready",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/vice/:host/url-ready",
        })
    );

    return api;
}
