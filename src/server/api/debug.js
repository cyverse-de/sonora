import express from "express";

import logger from "../logging";
import c from "cookie";

export default function debugRouter() {
    const api = express.Router();

    logger.info("************ Adding Debug handlers **********");

    logger.info("adding the GET /apps/categories handler");
    api.get("/debug/auth", (req, res) => {
        let body = {};

        // Add the session information.
        body["sessionId"] = null;
        let header = req?.headers?.cookie;
        if (header) {
            body["sessionId"] = c.parse(header)["connect.sid"];
        }
        body["session"] = req?.session;

        // Add the auth token.
        body["grant"] = req?.kauth?.grant;

        return res.json(body);
    });

    return api;
}
