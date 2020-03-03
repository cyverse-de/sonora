import React from "react";

import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";

import { ThemeProvider } from "@material-ui/core/styles";

import CyverseAppBar from "../components/layout/CyVerseAppBar";
import Navigation from "../components/layout/Navigation";
import NavigationConstants from "../components/layout/NavigationConstants";
import UploadManager from "../components/uploads/manager";
import theme from "../components/theme/default";

import { UploadTrackingProvider } from "../contexts/uploadTracking";
import { UserProfileProvider } from "../contexts/userProfile";

import "./styles.css";

const setupIntercom = (intercomAppId) => {
    window.intercomSettings = {
        app_id: intercomAppId,
        alignment: "right",
        horizontal_padding: 20,
        vertical_padding: 45,
        custom_launcher_selector: "#help_menu_intercom_link",
    };

    if (typeof window.Intercom === "function") {
        window.Intercom("reattach_activator");
        window.Intercom("update", window.intercomSettings);
    } else {
        window.Intercom = (...args) => {
            if (!window.Intercom.q) {
                window.Intercom.q = [];
            }
            window.Intercom.q.push(args);
        };

        function loadWidget() {
            const s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = `https://widget.intercom.io/widget/${intercomAppId}`;

            const x = document.getElementsByTagName("script")[0];
            x.parentNode.insertBefore(s, x);
        }

        if (window.attachEvent) {
            window.attachEvent("onload", loadWidget);
        } else {
            window.addEventListener("load", loadWidget, false);
        }
    }
};

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
            setupIntercom(intercomAppId);
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
                        <UploadManager />
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
