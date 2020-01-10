import CASAuthentication from "express-auth-cas";
import express from "express";
import next from "next";
import session from "express-session";

import * as config from "./configuration";

import { ApolloServer } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";

import typeDefs from "./graphql/typesDefs";
import resolvers from "./graphql/resolvers";
import camelCaseMiddleware from "./graphql/middleware/camelCase";
import TerrainDataSource from "./graphql/dataSources/TerrainDataSource";

config.validate();

const app = next({
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
});

app.prepare()

    .then(() => {
        const server = express();

        // Add Apollo as middleware to Express.
        apolloServer.applyMiddleware({
            app: server,
        });

        // Configure Express sessions.
        server.use(session({
            secret: config.sessionKey,
            resave: false,
            saveUninitialized: true
        }));

        // Configure CAS authentication.
        var cas = new CASAuthentication({
            cas_url: config.casURL,
            service_url: config.serviceURL
        });

        // All requests will be authenticated for now.
        server.get("*", cas.bounce, (req, res) => {
            console.log("%O", req.session);
            return nextHandler(req, res);
        });

        // Handle logout requests.
        server.get("/logout", cas.logout);

        // Handle single logout notifications from CAS.
        server.post("/single_logout", cas.handle_single_logout);

        server.listen(config.listenPort, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${config.listenPort}`);
        });
    })

    .catch((exception) => {
        console.error(exception.stack);
        process.exit(1);
    });
