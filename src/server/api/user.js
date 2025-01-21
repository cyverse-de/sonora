/**
 * @author sriram
 *
 * Add user handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import axiosInstance from "../../common/getAxios";
import { handler as terrainHandler } from "./terrain";
import { handler as cyRealmHandler } from "./cyverseRealm";
import { userPortalAPIURL } from "../configuration";

const WEBHOOK_TEST_BODY = { text: "This is a test message from DE." };

export default function userRouter() {
    const api = express.Router();

    logger.info("************ Adding User handlers **********");

    logger.info("adding the GET /api/profile handler");
    api.get("/profile", (req, res) => res.json(auth.getUserProfile(req)));

    logger.info("adding the GET /api/user-info handler");
    api.get(
        "/user-info",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/user-info",
        })
    );

    logger.info("adding the GET /bootstrap handler");
    api.get(
        "/bootstrap",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/bootstrap",
        })
    );

    logger.info("adding the GET /logins handler");
    api.get(
        "/logins",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/logins",
        })
    );

    logger.info("adding the POST /preferences handler");
    api.post(
        "/preferences",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/preferences",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the DELETE /token-info handler");
    api.delete(
        "/token-info/:systemId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "DELETE",
            pathname: "/secured/oauth/token-info/:systemId",
        })
    );

    logger.info("adding the GET /redirect-uris handler");
    api.get(
        "/redirect-uris",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/oauth/redirect-uris",
        })
    );

    logger.info("adding the GET /workspaces handler");
    api.get(
        "/workspaces",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/admin/workspaces",
        })
    );

    logger.info("adding the POST /support-email");
    api.post(
        "/support-email",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/support-email",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /webhooks/types handler");
    api.get(
        "/webhooks/types",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/webhooks/types",
        })
    );

    logger.info("adding the GET /webhooks/topics handler");
    api.get(
        "/webhooks/topics",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/webhooks/topics",
        })
    );

    logger.info("adding the PUT /webhooks handler");
    api.put(
        "/webhooks",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PUT",
            pathname: "/webhooks",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    api.get("/testWebhook", function (req, res) {
        axiosInstance
            .request({
                method: "POST",
                url: req.query.url,
                data: WEBHOOK_TEST_BODY,
            })
            .then((apiResponse) => {
                res.set(apiResponse.headers);
                res.status(apiResponse.status);
                res.send(apiResponse.data);
            })
            .catch(async (err) => {
                logger.error(err);
                const e = await err;

                res.status(e.response?.status || 500);
                res.send(e.response?.data);
            });
    });

    logger.info("adding the User Portal's GET /users/:user/status handler");
    api.get(
        "/users/:user/status",
        auth.authnTokenMiddleware,
        cyRealmHandler({
            method: "GET",
            url: userPortalAPIURL,
            pathname: "/users/:user/status",
        })
    );

    logger.info("adding the User Portal's GET /users/:user/ handler");
    api.get(
        "/users/:username",
        auth.authnTokenMiddleware,
        cyRealmHandler({
            method: "GET",
            url: userPortalAPIURL,
            pathname: "/users/:username",
        })
    );

    return api;
}
