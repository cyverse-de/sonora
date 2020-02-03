import express from "express";
import next from "next";
import passport from "passport";
import session from "express-session";
import pgsimple from "connect-pg-simple";

import * as config from "./configuration";
import * as authStrategy from "./authStrategy";
import { uploadHandler, downloadHandler } from "./fileio";

import { ApolloServer } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";

import typeDefs from "./graphql/typesDefs";
import resolvers from "./graphql/resolvers";
import camelCaseMiddleware from "./graphql/middleware/camelCase";
import TerrainDataSource from "./graphql/dataSources/TerrainDataSource";

config.validate();

export const app = next({
    dev: config.isDevelopment,
});
const nextHandler = app.getRequestHandler();

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
const schemaWithMiddleware = applyMiddleware(schema, camelCaseMiddleware);

const apolloServer = new ApolloServer({
    schema: schemaWithMiddleware,
    dataSources: () => ({
        terrain: new TerrainDataSource(),
    }),
    context: ({ req }) => ({
        user: req.user,
    }),
    playground: {
        settings: {
            "request.credentials": "include",
        },
    },
});

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

        // Add Apollo as middleware to Express.
        apolloServer.applyMiddleware({
            app: server,
        });

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
        api.post("/upload", authStrategy.authnTokenMiddleware, uploadHandler);
        api.get(
            "/download",
            authStrategy.authnTokenMiddleware,
            downloadHandler
        );

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
