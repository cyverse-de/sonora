import express from "express";
import next from "next";
import passport from "passport";
import session from "express-session";
import pgsimple from "connect-pg-simple";
import { ensureLoggedIn } from "connect-ensure-login";

import * as config from "./configuration";
import * as authStrategy from "./authStrategy";
import apiRouter from "./apiRouter";

import logger, { errorLogger, requestLogger } from "./logging";

export const app = next({
    dev: config.isDevelopment,
});
const nextHandler = app.getRequestHandler();

// Configure passport.
passport.use(authStrategy.strategy);
passport.serializeUser(authStrategy.serializeUser);
passport.deserializeUser(authStrategy.deserializeUser);

// Configure the session store.
const pgSession = pgsimple(session);
const sessionStore = new pgSession({
    conString: config.dbURI,
    tableName: "session",
    ttl: config.sessionTTL,
});

app.prepare()

    .then(() => {
        logger.info("preparing express server");

        const server = express();

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

        logger.info("configuring passport");
        server.use(passport.initialize());
        server.use(passport.session());

        logger.info("adding the /login handler");
        server.get(
            "/login",
            passport.authenticate("oauth2", {
                session: true,
                successReturnToOrRedirect: "/",
            })
        );

        logger.info("adding the /login/* handler");
        server.get("/login/*", ensureLoggedIn("/login"), (req, res) => {
            res.redirect(req.url.replace(/^\/login/, ""));
        });

        logger.info("adding the /logout handler");
        server.get("/logout", (req, res) => {
            req.session.destroy(() =>
                res.redirect(
                    `${config.oauth2LogoutURL}?service=${config.baseURL}`
                )
            );
        });

        logger.info("adding the api router to the express server");
        server.use("/api", apiRouter());

        logger.info(
            "adding the next.js fallthrough handler to the express server."
        );

        //map root to Dashboard
        server.get("/", (req, res) => {
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
