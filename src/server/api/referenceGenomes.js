/**
 * @author sriram
 *
 * Add tags handler
 *
 */

import express from "express";

import * as auth from "../auth";
import logger from "../logging";

import { handler as terrainHandler } from "./terrain";

export default function refGenomeRouter() {
    const api = express.Router();

    logger.info("************ Add Reference Genome handlers **********");

    logger.info("adding the GET /api/reference-genomes handler");
    api.get(
        "/reference-genomes",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "GET",
            pathname: "/reference-genomes",
        })
    );

    logger.info("adding the Admin POST /admin/reference-genomes");
    api.post(
        "/admin/reference-genomes",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "POST",
            pathname: "/admin/reference-genomes",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    logger.info("adding the Admin PATCH /admin/reference-genomes/:id");
    api.patch(
        "/admin/reference-genomes/:id",
        auth.authnTokenMiddleware,
        terrainHandler({
            method: "PATCH",
            pathname: "/admin/reference-genomes/:id",
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    return api;
}
