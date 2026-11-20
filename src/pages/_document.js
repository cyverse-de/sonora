import React from "react";
import publicConfig from "server/publicConfig";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { augmentDocumentWithEmotionCache } from "./_app";
import theme from "../components/theme/default";

class MyDocument extends Document {
    render() {
        const analyticsId =
            publicConfig.analytics?.enabled && publicConfig.analytics?.id;

        return (
            <Html lang="en">
                <Head>
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    {analyticsId && (
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
                                        window.gtag = gtag;
                                        gtag('js', new Date());

                                        gtag('config', '${analyticsId}', {
                                            page_location: window.location.href,
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
