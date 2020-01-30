/**
 * @author aramsey
 *
 * This is intended to wrap the root of our app with the Apollo client so all our components
 * can run graphQL queries.
 *
 * There are 2 ways to do this - with apollo-boost and apollo-client.
 * apollo-boost supposedly "configures your client with recommended settings... like our
 * in memory cache, local state management, and error handling."
 */

import React, { Component } from "react";

import ApolloClient from "apollo-boost";
import fetch from "node-fetch";
import { ApolloProvider } from "react-apollo";

const initClient = (user) => {
    const userToken = user?.accessToken;

    return new ApolloClient({
        request: (operation) => {
            operation.setContext({
                headers: {
                    authorization: userToken ? `Bearer ${userToken}` : "",
                },
            });
        },
        uri: "http://localhost:3000/graphql",
        fetch: fetch,
    });
};

const withApolloClient = (App) => {
    return class extends Component {
        render() {
            const { pageProps, ...rest } = this.props;
            const apolloClient = initClient(pageProps?.user);

            return (
                <ApolloProvider client={apolloClient}>
                    <App pageProps={pageProps} {...rest} />
                </ApolloProvider>
            );
        }
    };
};

export default withApolloClient;
