/**
 * @author johnworth
 *
 * Handlers for the bags portion of the API.
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrain } from "./terrain";

export default function bagsRouter() {
    const api = express.Router();

    logger.info("************ Adding Apps handlers **********");

    logger.info("adding the HEAD /bags handler");
    api.head(
        "/bags",
        auth.authnTokenMiddleware,
        terrain({
            method: "HEAD",
            pathname: "/bags",
        })
    );

    logger.info("adding the GET /bags handler");
    api.get(
        "/bags",
        auth.authnTokenMiddleware,
        terrain({
            method: "GET",
            pathname: "/bags",
        })
    );

    logger.info("adding the PUT /bags handler");
    api.put(
        "/bags",
        auth.authnTokenMiddleware,
        terrain({
            method: "PUT",
            pathname: "/bags",
        })
    );

    logger.info("adding the DELETE /bags handler");
    api.delete(
        "/bags",
        auth.authnTokenMiddleware,
        terrain({
            method: "DELETE",
            pathname: "/bags",
        })
    );

    logger.info("adding the GET /bags/default handler");
    api.get(
        "/bags/default",
        auth.authnTokenMiddleware,
        terrain({
            method: "GET",
            pathname: "/bags/default",
        })
    );

    logger.info("adding the POST /bags/default handler");
    api.post(
        "/bags/default",
        auth.authnTokenMiddleware,
        terrain({
            method: "POST",
            pathname: "/bags/default",
        })
    );

    logger.info("adding the DELETE /bags/default handler");
    api.delete(
        "/bags/default",
        auth.authnTokenMiddleware,
        terrain({
            method: "DELETE",
            pathname: "/bags/default",
        })
    );

    logger.info("adding the GET /bags/:id handler");
    api.get(
        "/bags/:id",
        auth.authnTokenMiddleware,
        terrain({
            method: "GET",
            pathname: "/bags/:id",
        })
    );

    logger.info("adding the POST /bags/:id handler");
    api.post(
        "/bags/:id",
        auth.authnTokenMiddleware,
        terrain({
            method: "POST",
            pathname: "/bags/:id",
        })
    );

    logger.info("adding the DELETE /bags/:id handler");
    api.delete(
        "/bags/:id",
        auth.authnTokenMiddleware,
        terrain({
            method: "DELETE",
            pathname: "/bags/:id",
        })
    );

    return api;
}
