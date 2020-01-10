import express from "express";
import next from "next";

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
