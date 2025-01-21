import express from "express";
import next from "next";

import analysesRouter from "./api/analyses";
import appsRouter from "./api/apps";
import bagsRouter from "./api/bags";
import dashboardRouter from "./api/dashboard";
import dataRouter from "./api/data";
import debugRouter from "./api/debug";
import doiRouter from "./api/doi";
import fileIORouter from "./api/fileio";
import groupsRouter from "./api/groups";
import metadataRouter from "./api/metadata";
import notificationsRouter from "./api/notifications";
import oauthRouter from "./api/oauth";
import pipelinesRouter from "./api/pipelines";
import quickLaunchRouter from "./api/quickLaunch";
import instantlaunchRouter from "./api/instantlaunches";
import refGenomeRouter from "./api/referenceGenomes";
import sharingRouter from "./api/sharing";
import subscriptionsRouter from "./api/subscriptions";
import supportRouter from "./api/support";
import tagsRouter from "./api/tags";
import toolsRouter from "./api/tools";
import userRouter from "./api/user";
import viceRouter from "./api/vice";

import * as authn from "./auth";
import * as config from "./configuration";

import compression from "compression";

import logger, { errorLogger, requestLogger } from "./logging";

import NavigationConstants from "../common/NavigationConstants";
import {
    upgradeListener,
    notificationsHandler,
    setUpAmqpForNotifications,
} from "./notifications";

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
    return new RegExp(`^/(${routeAlternation})(/|$)`);
}

// Configure the Keycloak client.
const keycloakClient = authn.getKeycloakClient();

// Configure the Unleash SDK
const unleash = require("unleash-client");

unleash.initialize({
    url: config.unleashApiURL,
    appName: "de",
    customHeaders: {
        Authorization: config.unleashClientSecret,
    },
});

app.prepare()

    .then(() => {
        logger.info("preparing express server");

        const server = express();
        server.enable("trust proxy");

        logger.info("configuring the express logging middleware");
        server.use(errorLogger);
        server.use(requestLogger);
        server.use(express.json());

        logger.info("DEBUG: adding middleware to log cookies");
        server.use(authn.logSessionCookie);

        logger.info("configuring express sessions");
        server.use(authn.sessionMiddleware());

        logger.info("DEBUG: adding middleware to log session info");
        server.use(authn.logSessionInfo);

        logger.info("configuring keycloak");
        server.use(keycloakClient.middleware());

        server.get("/", keycloakClient.checkSso(), async (req, res, next) => {
            try {
                const userProfile = authn.getUserProfile(req);

                if (userProfile) {
                    return res.redirect(`/${NavigationConstants.DASHBOARD}`);
                }

                return nextHandler(req, res);
            } catch (error) {
                return next(error);
            }
        });

        logger.info("adding the /login handler");
        server.get("/login", keycloakClient.protect(), (req, res) => {
            res.redirect("/");
        });

        logger.info("adding the /login/* handler");
        server.get("/login/*", keycloakClient.protect(), (req, res) => {
            // Remove login from the url
            // Remove paths specific to the anonymous user, like the anonymous user's
            // home folder, to prevent sign-in from redirecting the authenticated
            // user back to anonymous's folders again
            res.redirect(
                req.url
                    .replace(/^\/login/, "")
                    .replace(`${config.iRodsHome}/anonymous`, "")
                    .replace(`${config.iRodsTrash}/anonymous`, "")
            );
        });

        //get notifications from amqp
        logger.info("Set up notification queue and websocket");
        setUpAmqpForNotifications();
        server.get(NavigationConstants.NOTIFICATION_WS, notificationsHandler);

        logger.info(
            "$$$$$$$$ adding the api router to the express server $$$$$$$$$"
        );
        server.use("/api", compression());
        server.use("/api", appsRouter());
        server.use("/api", analysesRouter());
        server.use("/api", bagsRouter());
        server.use("/api", dashboardRouter());
        server.use("/api", dataRouter());
        server.use("/api", debugRouter());
        server.use("/api", fileIORouter());
        server.use("/api", groupsRouter());
        server.use("/api", metadataRouter());
        server.use("/api", notificationsRouter());
        server.use("/api", oauthRouter());
        server.use("/api", pipelinesRouter());
        server.use("/api", quickLaunchRouter());
        server.use("/api", instantlaunchRouter());
        server.use("/api", sharingRouter());
        server.use("/api", subscriptionsRouter());
        server.use("/api", supportRouter());
        server.use("/api", refGenomeRouter());
        server.use("/api", tagsRouter());
        server.use("/api", toolsRouter());
        server.use("/api", userRouter());
        server.use("/api", viceRouter());
        server.use("/api", doiRouter());
        logger.info("$$$$$$$$$$$$$$ finished adding handlers $$$$$$$$$$$$$");

        logger.info(
            "adding the next.js fallthrough handler to the express server."
        );

        logger.info("mapping / to /dashboard in the app");
        server.use("/", compression());

        logger.info("Adding the unleash handler");
        server.use(express.static("public"));
        server.use((req, res, next) => {
            if (unleash.isEnabled(config.unleashMaintenanceFlag)) {
                res.sendFile("maintenance.html", { root: "public" });
            } else {
                next();
            }
        });

        // URL paths that might appear in the browser address bar should match this route.
        const userRouteRegexp = buildNavigationRouteRegexp();
        server.get(userRouteRegexp, keycloakClient.checkSso(), (req, res) => {
            return nextHandler(req, res);
        });

        server.get("*", (req, res) => {
            return nextHandler(req, res);
        });

        const httpServer = server.listen(config.listenPort, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${config.listenPort}`);
        });

        httpServer.on("upgrade", upgradeListener(server));
    })

    .catch((exception) => {
        logger.error(exception);
        process.exit(1);
    });
