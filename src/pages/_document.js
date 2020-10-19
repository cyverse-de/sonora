import React from "react";
import getConfig from "next/config";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
import theme from "../components/theme/default";

export default class MyDocument extends Document {
    render() {
        const { publicRuntimeConfig = {} } = getConfig() || {};
        const analyticsEnabled = publicRuntimeConfig.ANALYTICS_ENABLED;
        const analyticsId = publicRuntimeConfig.ANALYTICS_ID;
        return (
            <html lang="en">
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
            </html>
        );
    }
}

MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
            ...React.Children.toArray(initialProps.styles),
            sheets.getStyleElement(),
        ],
    };
};
