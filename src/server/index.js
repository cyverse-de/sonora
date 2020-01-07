import express from "express";
import next from "next";

import { ApolloServer } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";

import typeDefs from "./graphql/typesDefs";
import resolvers from "./graphql/resolvers";
import camelCaseMiddleware from './graphql/middleware/camelCase';
import TerrainDataSource from "./graphql/dataSources/TerrainDataSource";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev });
const nextHandler = app.getRequestHandler();

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, camelCaseMiddleware);

const apolloServer = new ApolloServer({
    schema: schemaWithMiddleware,
    dataSources: () => ({
        terrain: new TerrainDataSource(),
    }),
});

app
    .prepare()

    .then(() => {
        const server = express();

        // Add Apollo as middleware to Express.
        apolloServer.applyMiddleware({ app: server });

        server.get("*", (req, res) => {
            return nextHandler(req, res);
        });

        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`> Read on http://localhost:${ port }`);
        });
    })

    .catch((exception) => {
        console.error(exception.stack);
        process.exit(1);
    });
