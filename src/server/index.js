import express from "express";
import keycloak from "keycloak-connect";
import next from "next";
import pgsimple from "connect-pg-simple";
import session from "express-session";

import * as config from "./configuration";
import apiRouter from "./api/router";

import logger, { errorLogger, requestLogger } from "./logging";

export const app = next({
    dev: config.isDevelopment,
});
const nextHandler = app.getRequestHandler();

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
        server.use("/api", keycloakClient.checkSso(), apiRouter());

        logger.info(
            "adding the next.js fallthrough handler to the express server."
        );

        //map root to Dashboard
        server.get("/", keycloakClient.checkSso(), (req, res) => {
            app.render(req, res, "/dashboard", undefined);
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
