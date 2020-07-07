import express from "express";
import expressWs from "express-ws";
import next from "next";

import analysesRouter from "./api/analyses";
import appsRouter from "./api/apps";
import dataRouter from "./api/data";
import fileIORouter from "./api/fileio";
import tagsRouter from "./api/tags";
import toolsRouter from "./api/tools";
import userRouter from "./api/user";
import viceRouter from "./api/vice";

import * as authn from "./auth";
import * as config from "./configuration";

import logger, { errorLogger, requestLogger } from "./logging";

import NavigationConstants from "../common/NavigationConstants";
import { getNotifications, setUpAmqpForNotifications } from "./amqp";

export const app = next({
    dev: config.isDevelopment,
});
const nextHandler = app.getRequestHandler();

// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

// buildNavigationRouteRegexp builds a regular expression that can be used to detect one of the
// navigation routes that isn't explicitly handled elsewhere.
function buildNavigationRouteRegexp() {
    // Build the alternation expression for each of the navigation routes.
    let routeAlternation = Object.entries(NavigationConstants)
        .filter(([k]) => k !== "LOGIN" && k !== "LOGOUT")
        .map(([_, v]) => escapeRegExp(v))
        .join("|");

    // Build and compile the full regular expression.
    return new RegExp(`^/(${routeAlternation})`);
}

// Configure the Keycloak client.
const keycloakClient = authn.getKeycloakClient();

app.prepare()

    .then(() => {
        logger.info("preparing express server");

        const server = express();
        server.enable("trust proxy");

        logger.info("configuring the express logging middleware");
        server.use(errorLogger);
        server.use(requestLogger);

        logger.info("configuring express sessions");
        server.use(authn.sessionMiddleware());

        logger.info("configuring keycloak");
        server.use(keycloakClient.middleware());

        logger.info("adding the /login handler");
        server.get("/login", keycloakClient.protect());

        logger.info("adding the /login/* handler");
        server.get("/login/*", keycloakClient.protect(), (req, res) => {
            res.redirect(req.url.replace(/^\/login/, ""));
        });

        //get notifications from amqp
        logger.info("Set up notification queue and websocket");
        setUpAmqpForNotifications();
        expressWs(server);
        server.ws(NavigationConstants.NOTIFICATION_WS, function (ws, request) {
            getNotifications(authn.getUserID(request), ws);
        });

        logger.info("adding the api router to the express server");
        server.use("/api", appsRouter());
        server.use("/api", analysesRouter());
        server.use("/api", dataRouter());
        server.use("/api", fileIORouter());
        server.use("/api", tagsRouter());
        server.use("/api", toolsRouter());
        server.use("/api", userRouter());
        server.use("/api", viceRouter());

        logger.info(
            "adding the next.js fallthrough handler to the express server."
        );

        logger.info("mapping / to /dashboard in the app");
        server.get("/", (req, res) => {
            app.render(req, res, "/dashboard", undefined);
        });

        // URL paths that might appear in the browser address bar should match this route.
        const userRouteRegexp = buildNavigationRouteRegexp();
        server.get(userRouteRegexp, keycloakClient.checkSso(), (req, res) => {
            return nextHandler(req, res);
        });

        server.get("*", (req, res) => {
            return nextHandler(req, res);
        });

        server.listen(config.listenPort, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${config.listenPort}`);
        });
    })

    .catch((exception) => {
        logger.error(exception);
        process.exit(1);
    });
