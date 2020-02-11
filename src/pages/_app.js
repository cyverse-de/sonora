import React from "react";
import CyverseAppBar from "../components/appBar/CyVerseAppBar";
import theme from "../components/theme/default";
import { ThemeProvider } from "@material-ui/core/styles";
import Head from "next/head";
import "./styles.css";

function MyApp({ Component, pageProps }) {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <CyverseAppBar>
                <Head>
                    <title>Discovery Environment</title>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&display=swap" rel="stylesheet"/>
                    <link rel="icon" type="image/x-icon" href="/cyverse_whitelogo.png" />
                </Head>
                <Component {...pageProps} />
            </CyverseAppBar>
        </ThemeProvider>
    );
}

export default MyApp;
