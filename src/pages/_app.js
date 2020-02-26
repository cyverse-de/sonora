import React from "react";

import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";

import { ThemeProvider } from "@material-ui/core/styles";

import CyverseAppBar from "../components/layout/CyVerseAppBar";
import Navigation from "../components/layout/Navigation";
import NavigationConstants from "../components/layout/NavigationConstants";
import theme from "../components/theme/default";

import { UploadTrackingProvider } from "../contexts/uploadTracking";
import { UserProfileProvider } from "../contexts/userProfile";

import "./styles.css";

function MyApp({ Component, pageProps, intercomAppId, intercomEnabled }) {
    const router = useRouter();
    const pathname = router.pathname
        ? router.pathname.slice(1)
        : NavigationConstants.DASHBOARD;

    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        if (intercomEnabled) {
            (function() {
                var w = window;
                var ic = w.Intercom;
                w.intercomSettings = {
                    app_id: intercomAppId,
                    alignment: "right",
                    horizontal_padding: 20,
                    vertical_padding: 45,
                    custom_launcher_selector: "#help_menu_intercom_link",
                };
                if (typeof ic === "function") {
                    ic("reattach_activator");
                    ic("update", w.intercomSettings);
                } else {
                    var d = document;
                    var i = function() {
                        i.c(arguments);
                    };
                    i.q = [];
                    i.c = function(args) {
                        i.q.push(args);
                    };
                    w.Intercom = i;

                    function l() {
                        var s = d.createElement("script");
                        s.type = "text/javascript";
                        s.async = true;
                        s.src =
                            "https://widget.intercom.io/widget/" +
                            intercomAppId;
                        var x = d.getElementsByTagName("script")[0];
                        x.parentNode.insertBefore(s, x);
                    }

                    if (w.attachEvent) {
                        w.attachEvent("onload", l);
                    } else {
                        w.addEventListener("load", l, false);
                    }
                }
            })();
        }
    }, [intercomAppId, intercomEnabled]);
    return (
        <ThemeProvider theme={theme}>
            <UserProfileProvider>
                <UploadTrackingProvider>
                    <CyverseAppBar>
                        <Head>
                            <title>Discovery Environment</title>
                        </Head>
                        <Navigation activeView={pathname} />
                        <Component {...pageProps} />
                    </CyverseAppBar>
                </UploadTrackingProvider>
            </UserProfileProvider>
        </ThemeProvider>
    );
}

MyApp.getInitialProps = async (ctx) => {
    const { serverRuntimeConfig } = getConfig();
    return {
        intercomAppId: serverRuntimeConfig.INTERCOM_APP_ID,
        intercomEnabled: serverRuntimeConfig.INTERCOM_ENABLED,
    };
};

export default MyApp;
