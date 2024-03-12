/**
 * @author psarando
 *
 * Adds metadata handlers.
 */

import express from "express";

import * as auth from "../auth";
import { localContextsURL, olsURL, uatURL } from "../configuration";
import logger from "../logging";

import { handler as externalHandler } from "./external";
import { handler as terrainHandler } from "./terrain";
import { metadataTemplateCSVhandler } from "./downloads";

export default function metadataRouter() {
    const api = express.Router();

    logger.info("************ Adding Metadata handlers **********");

    logger.info("adding the GET /api/filesystem/metadata/templates handler");
    api.get(
        "/filesystem/metadata/templates",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/filesystem/metadata/templates",
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
            pathname: "/filesystem/metadata/template/:templateId",
        })
    );

    logger.info(
        "adding the GET /api/filesystem/metadata/template/:templateId/zip-csv handler"
    );
    api.get(
        "/filesystem/metadata/template/:templateId/zip-csv",
        auth.authnTokenMiddleware,
        metadataTemplateCSVhandler
    );

    logger.info("adding the GET /api/filesystem/:dataId/metadata handler");
    api.get(
        "/filesystem/:dataId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/filesystem/:dataId/metadata",
        })
    );

    logger.info("adding the POST /api/filesystem/:dataId/metadata handler");
    api.post(
        "/filesystem/:dataId/metadata",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/:dataId/metadata",
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
            pathname: "/filesystem/:dataId/metadata/save",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the POST /api/filesystem/metadata/csv-parser handler");
    api.post(
        "/filesystem/metadata/csv-parser",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/filesystem/metadata/csv-parser",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the GET /api/ontology-lookup-service handler");
    api.get(
        "/ontology-lookup-service",
        externalHandler({
            method: "GET",
            url: olsURL,
        })
    );

    logger.info("adding the GET /api/unified-astronomy-thesaurus handler");
    api.get(
        "/unified-astronomy-thesaurus",
        externalHandler({
            method: "GET",
            url: uatURL,
        })
    );

    logger.info("adding the GET /api/local-contexts/projects/:id handler");
    api.get("/local-contexts/projects/:id", async (req, res) => {
        const localContextsHandler = externalHandler({
            method: "GET",
            url: `${localContextsURL}/projects/${req.params.id}`,
        });

        return localContextsHandler(req, res);
    });

    return api;
}
