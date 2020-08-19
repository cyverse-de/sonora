/**
 * @author sriram
 *
 * Add sharing handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function sharingRouter() {
    const api = express.Router();

    logger.info("************ Adding Sharing handlers **********");

    logger.info("adding the POST /share handler");
    api.post(
        "/share",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/share",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /unshare handler");
    api.post(
        "/unshare",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/unshare",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /apps/sharing handler");
    api.post(
        "/apps/sharing",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/sharing",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /apps/unsharing handler");
    api.post(
        "/apps/unsharing",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/apps/unsharing",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /analyses/sharing handler");
    api.post(
        "/analyses/sharing",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses/sharing",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /analyses/unsharing handler");
    api.post(
        "/analyses/unsharing",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/analyses/unsharing",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /tools/sharing handler");
    api.post(
        "/tools/sharing",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/tools/sharing",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /tools/unsharing handler");
    api.post(
        "/tools/unsharing",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/tools/unsharing",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /subjects handler");
    api.get(
        "/subjects",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/subjects",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
