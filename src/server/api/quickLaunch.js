/**
 * @author sriram
 *
 * Add Quick Launch handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function quickLaunchRouter() {
    const api = express.Router();

    logger.info("************ Adding Quick launch handlers **********");

    logger.info("adding the POST /quicklaunches handler");
    api.post(
        "/quicklaunches",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/quicklaunches",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /quicklaunches/apps/:appId handler");
    api.get(
        "/quicklaunches/apps/:appId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/quicklaunches/apps/:appId",
        })
    );

    logger.info("adding the DELETE /quicklaunches/:qId handler");
    api.delete(
        "/quicklaunches/:qId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/quicklaunches/:qId",
        })
    );

    logger.info("adding the GET /quicklaunches/:qId/app-info handler");
    api.get(
        "/quicklaunches/:qId/app-info",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/quicklaunches/:qId/app-info",
        })
    );

    logger.info("adding the GET /quicklaunches/defaults/global handler");
    api.get(
        "/quicklaunches/defaults/global",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/quicklaunches/default/global",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /quicklaunches/defaults/global handler");
    api.post(
        "/quicklaunches/default/global",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/quicklaunches/default/global",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /quicklaunches/defaults/global/:id handler");
    api.delete(
        "/quicklaunches/default/global/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/quicklaunches/default/global/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /quicklaunches/defaults/global/:id handler");
    api.get(
        "/quicklaunches/default/global/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/quicklaunches/default/global/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the PATCH /quicklaunches/defaults/global/:id handler");
    api.patch(
        "/quicklaunches/default/global/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/quicklaunches/default/global/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
