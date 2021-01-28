/**
 * @author aramsey
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function groupsRouter() {
    const api = express.Router();

    logger.info("************ Adding Groups Handlers **********");

    logger.info("adding the GET /teams handler");
    api.get(
        "/teams",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/teams",
        })
    );

    logger.info("adding the POST /teams handler");
    api.post(
        "/teams",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/teams",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /teams/:name/privileges handler");
    api.get(
        "/teams/:name/privileges",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/teams/:name/privileges",
        })
    );

    logger.info("adding the GET /teams/:name/members handler");
    api.get(
        "/teams/:name/members",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/teams/:name/members",
        })
    );

    logger.info("adding the POST /api/teams/:name handler");
    api.post(
        "/teams/:name",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/teams/:name",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the PATCH /api/teams/:name handler");
    api.patch(
        "/teams/:name",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/teams/:name",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /api/teams/:name handler");
    api.delete(
        "/teams/:name",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/teams/:name",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/teams/:name/members handler");
    api.post(
        "/teams/:name/members",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/teams/:name/members",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/teams/:name/members/deleter handler");
    api.post(
        "/teams/:name/members/deleter",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/teams/:name/members/deleter",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/teams/:name/privileges handler");
    api.post(
        "/teams/:name/privileges",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/teams/:name/privileges",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
