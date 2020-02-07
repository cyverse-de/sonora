import express from "express";
import next from "next";
import passport from "passport";
import session from "express-session";
import pgsimple from "connect-pg-simple";

import * as config from "./configuration";
import * as authStrategy from "./authStrategy";
import { terrain } from "./terrainHandler";

config.validate();

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
        const server = express();

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

        // Configure passport.
        server.use(passport.initialize());
        server.use(passport.session());

        server.get(
            "/login",
            passport.authenticate("oauth2", {
                session: true,
                successReturnToOrRedirect: "/",
            })
        );

        server.get("/logout", (req, res) => {
            req.session.destroy(() =>
                res.redirect(
                    `${config.oauth2LogoutURL}?service=${config.baseURL}`
                )
            );
        });

        const api = express.Router();
        api.post(
            "/upload",
            authStrategy.authnTokenMiddleware,
            terrain({
                method: "POST",
                pathname: "/secured/fileio/upload",
            })
        );

        api.get(
            "/download",
            authStrategy.authnTokenMiddleware,
            terrain({
                method: "GET",
                pathname: "/secured/fileio/download",
            })
        );

        api.get(
            "/filesystem/paged-directory",
            authStrategy.authnTokenMiddleware,
            terrain({
                method: "GET",
                pathname: "/secured/filesystem/paged-directory",
            })
        );

        api.post(
            "/filesystem/stat",
            authStrategy.authnTokenMiddleware,
            terrain({
                method: "POST",
                pathname: "/secured/filesystem/stat",
                headers: {
                    "Content-Type": "application/json",
                },
            })
        );

        api.get(
            "/filesystem/root",
            authStrategy.authnTokenMiddleware,
            terrain({ method: "GET", pathname: "/secured/filesystem/root" })
        );

        server.use("/api", api);

        server.get("*", (req, res) => {
            return nextHandler(req, res);
        });

        server.listen(config.listenPort, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${config.listenPort}`);
        });
    })

    .catch((exception) => {
        console.error(exception.stack);
        process.exit(1);
    });
