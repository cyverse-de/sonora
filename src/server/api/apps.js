/**
 * @author sriram
 *
 * Add apps handler
 *
 */
import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function appsRouter() {
    const api = express.Router();

    logger.info("************ Adding Apps handlers **********");

    logger.info("adding the GET /apps/categories handler");
    api.get(
        "/apps/categories",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/categories",
        })
    );

    logger.info("adding the GET /apps handler");
    api.get(
        "/apps",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps",
        })
    );

    logger.info("adding the GET /apps/:systemId/:appId handler");
    api.get(
        "/apps/:systemId/:appId/listing",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/listing",
        })
    );

    logger.info(
        "adding the GET /apps/categories/:systemId/:categoryId handler"
    );
    api.get(
        "/apps/categories/:systemId/:categoryId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/categories/:systemId/:categoryId",
        })
    );

    logger.info("adding the GET /apps/:systemId/:appId handler");
    api.get(
        "/apps/:systemId/:appId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId",
        })
    );

    logger.info("adding the GET /apps/:systemId/:appId/details handler");
    api.get(
        "/apps/:systemId/:appId/details",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/details",
        })
    );

    logger.info("adding the PUT /apps/:systemId/:appId/favorite handler");
    api.put(
        "/apps/:systemId/:appId/favorite",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/apps/:systemId/:appId/favorite",
        })
    );

    logger.info("adding the DELETE /apps/:systemId/:appId/favorite handler");
    api.delete(
        "/apps/:systemId/:appId/favorite",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/apps/:systemId/:appId/favorite",
        })
    );

    logger.info("adding the POST /apps/:systemId/:appId/rating handler");
    api.post(
        "/apps/:systemId/:appId/rating",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/:systemId/:appId/rating",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /apps/:systemId/:appId/rating handler");
    api.delete(
        "/apps/:systemId/:appId/rating",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/apps/:systemId/:appId/rating",
        })
    );

    logger.info("adding the POST /apps/permission-lister handler");
    api.post(
        "/apps/permission-lister",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/permission-lister",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );


    logger.info("adding the GET /apps/:systemId/:appId/documentation handler");
    api.get(
        "/apps/:systemId/:appId/documentation",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/apps/:systemId/:appId/documentation",
        })
    );



    return api;
}
