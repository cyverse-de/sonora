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

    return api;
}
