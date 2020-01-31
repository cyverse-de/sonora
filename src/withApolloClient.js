/**
 * @author sarahr
 *
 * This is intended to wrap the root of our app with the Apollo client so all our components
 * can run graphQL queries.
 *
 * There are 2 ways to do this - with apollo-boost and apollo-client.
 * apollo-boost supposedly "configures your client with recommended settings... like our
 * in memory cache, local state management, and error handling."
 *
 * apollo-client however allows you to customize links, and with our implementation
 * we need a custom link with `credentials: 'same-origin'` set.
 */
import React, { Component } from "react";
import ApolloClient from "apollo-client";
import fetch from "node-fetch";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const withApolloClient = (App) => {
    return class extends Component {
        render() {
            const link = createHttpLink({
                uri: "/graphql",
                credentials: "same-origin",
                fetch: fetch,
            });
            const apolloClient = new ApolloClient({
                cache: new InMemoryCache(),
                link,
            });
            return (
                <ApolloProvider client={apolloClient}>
                    <App {...this.props} />
                </ApolloProvider>
            );
        }
    };
};

export default withApolloClient;
