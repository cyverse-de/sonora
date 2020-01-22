import React from "react";
import App from "next/app";
import CyverseAppBar from "../components/appBar/CyVerseAppBar";
import theme from "../components/theme/default";
import { ThemeProvider } from "@material-ui/core/styles";

export default class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        if (ctx.req && ctx.req.user) {
            pageProps.user = ctx.req.user.profile;
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
                <CyverseAppBar>
                    <Component {...props} />
                </CyverseAppBar>
            </ThemeProvider>
        );
    }
}
