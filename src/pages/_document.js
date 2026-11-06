import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { augmentDocumentWithEmotionCache } from "./_app";
import theme from "../components/theme/default";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta
                        name="theme-color"
                        content={theme.palette.primary.main}
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <link
                        rel="icon"
                        type="image/x-icon"
                        href="/cyverse_whitelogo.png"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

augmentDocumentWithEmotionCache(MyDocument);

export default MyDocument;
