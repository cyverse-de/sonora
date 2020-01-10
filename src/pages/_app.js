import React from "react";
import App from "next/app";
import CyverseAppBar from "../components/appBar/CyVerseAppBar";

export default class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;

        return (
            <CyverseAppBar>
                <Component {...pageProps} />
            </CyverseAppBar>
        );
    }
}
