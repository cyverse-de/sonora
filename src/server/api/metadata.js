/**
 * @author psarando
 *
 * Adds metadata handlers.
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";
import axiosInstance from "../../common/getAxios";

import { handler as terrainHandler } from "./terrain";

export default function notificationsRouter() {
    const api = express.Router();

    logger.info("************ Adding Metadata handlers **********");

    logger.info("adding the GET /api/filesystem/metadata/templates handler");
    api.get(
        "/filesystem/metadata/templates",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filesystem/metadata/templates",
        })
    );

    logger.info(
        "adding the GET /api/filesystem/metadata/template/:templateId handler"
    );
    api.get(
        "/filesystem/metadata/template/:templateId",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filesystem/metadata/template/:templateId",
        })
    );

    logger.info(
        "adding the GET /api/filesystem/metadata/template/:templateId/zip-csv handler"
    );
    api.get(
        "/filesystem/metadata/template/:templateId/zip-csv",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname:
                "/secured/filesystem/metadata/template/:templateId/zip-csv",
        })
    );

    logger.info("adding the GET /api/filesystem/:dataId/metadata handler");
    api.get(
        "/filesystem/:dataId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/secured/filesystem/:dataId/metadata",
        })
    );

    logger.info("adding the POST /api/filesystem/:dataId/metadata handler");
    api.post(
        "/filesystem/:dataId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filesystem/:dataId/metadata",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info(
        "adding the POST /api/filesystem/:dataId/metadata/save handler"
    );
    api.post(
        "/filesystem/:dataId/metadata/save",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/secured/filesystem/:dataId/metadata/save",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /api/ontology-lookup-service handler");
    api.get("/ontology-lookup-service", (req, res) => {
        axiosInstance
            .get("https://www.ebi.ac.uk/ols/api/select")
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse.data);
            });
    });

    logger.info("adding the GET /api/unified-astronomy-thesaurus handler");
    api.get("/unified-astronomy-thesaurus", (req, res) => {
        axiosInstance
            .get(
                "https://vocabs.ands.org.au/repository/api/lda/aas/the-unified-astronomy-thesaurus/current/concept.json"
            )
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse.data);
            });
    });

    return api;
}
