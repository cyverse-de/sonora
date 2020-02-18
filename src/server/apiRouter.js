import request from "request";
import path from "path";
import querystring from "querystring";
import { terrainURL } from "./configuration";
import * as authStrategy from "./authStrategy";
import logger from "./logging";
import express from "express";

const terrain = ({ method, url, pathname, headers }) => {
    const baseURL = url || terrainURL;

    return (req, res) => {
        const apiURL = new URL(baseURL);
        apiURL.pathname = path.join(apiURL.pathname, pathname);
        apiURL.search = querystring.stringify(req.query);

        const requestOptions = {
            method: method,
            url: apiURL.href,
        };

        if (headers) {
            requestOptions.headers = headers;
        }

        logger.info(
            `TERRAIN ${req?.user?.profile?.id} ${method} ${apiURL.href}`
        );

        req.pipe(request(requestOptions)).pipe(res);
    };
};

export default function apiRouter() {
    logger.info("creating the api router");
    const api = express.Router();

    logger.info("adding the /api/upload handler ");
    api.post(
        "/upload",
        authStrategy.authnTokenMiddleware,
        terrain({
            method: "POST",
            pathname: "/secured/fileio/upload",
        })
    );

    logger.info("adding the /api/download handler");
    api.get(
        "/download",
        authStrategy.authnTokenMiddleware,
        terrain({
            method: "GET",
            pathname: "/secured/fileio/download",
        })
    );

    logger.info("adding the /api/filesystem/paged-directory handler");
    api.get(
        "/filesystem/paged-directory",
        authStrategy.authnTokenMiddleware,
        terrain({
            method: "GET",
            pathname: "/secured/filesystem/paged-directory",
        })
    );

    logger.info("adding the /api/filesystem/stat handler");
    api.post(
        "/filesystem/stat",
        authStrategy.authnTokenMiddleware,
        terrain({
            method: "POST",
            pathname: "/secured/filesystem/stat",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the /api/filesystem/root handler");
    api.get(
        "/filesystem/root",
        authStrategy.authnTokenMiddleware,
        terrain({ method: "GET", pathname: "/secured/filesystem/root" })
    );

    logger.info("adding the /api/profile handler");
    api.get("/profile", (req, res) => {
        if (req.user) {
            res.json({ ...req.user.profile, username: req.user.id });
        } else {
            res.json(null);
        }
    });

    return api;
}
