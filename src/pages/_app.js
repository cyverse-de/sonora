import React from "react";
import App from "next/app";
import CyVerseAppBar from "../components/appBar/CyVerseAppBar";
import theme from "../components/theme/default";
import { ThemeProvider } from "@material-ui/core/styles";
import withApolloClient from "../withApolloClient";

import Listing from "../components/data/Listing";

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        if (ctx.req && ctx.req.user) {
            pageProps.user = ctx.req.user;
        }
        return { pageProps };
    }

    constructor(props) {
        super(props);
        this.state = {
            user: props.pageProps.user,
        };
    }

    render() {
        const { Component, pageProps } = this.props;

        const props = {
            ...pageProps,
            user: this.state.user,
        };

        return (
            <ThemeProvider theme={theme}>
                <CyVerseAppBar>
                    <Listing path="/iplant/home/aramsey" {...props} />
                </CyVerseAppBar>
            </ThemeProvider>
        );
    }
}

export default withApolloClient(MyApp);
