import React from "react";
import getConfig from "next/config";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { augmentDocumentWithEmotionCache } from "./_app";
import theme from "../components/theme/default";

class MyDocument extends Document {
    render() {
        const { publicRuntimeConfig = {} } = getConfig() || {};
        const analyticsEnabled = publicRuntimeConfig.ANALYTICS_ENABLED;
        const analyticsId = publicRuntimeConfig.ANALYTICS_ID;
        return (
            <Html lang="en">
                <Head>
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    {analyticsEnabled && (
                        <>
                            <script
                                async
                                src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
                            />
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());

                                    gtag('config', '${analyticsId}', {
                                    page_path: window.location.pathname,
                                    });
                             `,
                                }}
                            />
                        </>
                    )}
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
