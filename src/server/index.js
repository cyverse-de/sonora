import express from "express";
import keycloak from "keycloak-connect";
import next from "next";
import pgsimple from "connect-pg-simple";
import session from "express-session";

import * as config from "./configuration";
import apiRouter from "./api/router";
import NavigationConstants from "../components/layout/NavigationConstants";

import logger, { errorLogger, requestLogger } from "./logging";

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
    let routeAlternation = "";
    for (let k in NavigationConstants) {
        if (k !== "LOGIN" && k !== "LOGOUT") {
            let v = escapeRegExp(NavigationConstants[k]);
            if (routeAlternation === "") {
                routeAlternation = v;
            } else {
                routeAlternation = `${routeAlternation}|${NavigationConstants[k]}`;
            }
        }
    }

    // Build and compile the full regular expression.
    return new RegExp(`^/(${routeAlternation})`);
}

// Configure the session store.
const pgSession = pgsimple(session);
const sessionStore = new pgSession({
    conString: config.dbURI,
    tableName: "session",
    ttl: config.sessionTTL,
});

// Configure the Keycloak client.
const keycloakClient = new keycloak(
    {
        store: sessionStore,
    },
    {
        serverUrl: config.keycloakServerURL,
        realm: config.keycloakRealm,
        clientId: config.keycloakClientID,
        secret: config.keycloakClientSecret,
    }
);

app.prepare()

    .then(() => {
        logger.info("preparing express server");

        const server = express();
        server.enable("trust proxy");

        logger.info("configuring the express logging middleware");
        server.use(errorLogger);
        server.use(requestLogger);

        logger.info("configuring express sessions");
        // Configure sessions.
        server.use(
            session({
                store: sessionStore,
                secret: config.sessionSecret,
                resave: false,
                saveUninitialized: true,
                cookie: {
                    secure: config.sessionSecureCookie,
                },
            })
        );

        logger.info("configuring keycloak");
        server.use(keycloakClient.middleware());

        logger.info("adding the /login handler");
        server.get("/login", keycloakClient.protect());

        logger.info("adding the /login/* handler");
        server.get("/login/*", keycloakClient.protect(), (req, res) => {
            res.redirect(req.url.replace(/^\/login/, ""));
        });

        logger.info("adding the api router to the express server");
        server.use("/api", apiRouter());

        logger.info(
            "adding the next.js fallthrough handler to the express server."
        );

        //map root to Dashboard
        server.get("/", keycloakClient.checkSso(), (req, res) => {
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
