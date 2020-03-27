import React, { useState } from "react";

import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";

import { ThemeProvider } from "@material-ui/core/styles";
import "./styles.css";

import CyverseAppBar from "../components/layout/CyVerseAppBar";
import Navigation from "../components/layout/Navigation";
import NavigationConstants from "../common/NavigationConstants";
import UploadManager from "../components/uploads/manager";
import theme from "../components/theme/default";
import ids from "../components/layout/ids";

import { UploadTrackingProvider } from "../contexts/uploadTracking";
import { UserProfileProvider } from "../contexts/userProfile";
import { IntercomProvider } from "../contexts/intercom";

import constants from "../constants";
import { ReactQueryDevtools } from 'react-query-devtools';

const setupIntercom = (intercomAppId) => {
    window.intercomSettings = {
        app_id: intercomAppId,
        alignment: "right",
        horizontal_padding: 20,
        vertical_padding: 45,
        custom_launcher_selector: `#${ids.INTERCOM_WIDGET}`,
        hide_default_launcher: true,
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

function MyApp({
    Component,
    pageProps,
    intercomAppId,
    intercomEnabled,
    companyId,
    companyName,
}) {
    const router = useRouter();
    const pathname = router.pathname
        ? router.pathname.split(constants.PATH_SEPARATOR)[1]
        : NavigationConstants.DASHBOARD;
    const [intercomSettings, setIntercomSettings] = useState({
        appId: intercomAppId,
        enabled: intercomEnabled,
        companyId: companyId,
        companyName: companyName,
        unReadCount: 0,
    });

    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        if (intercomSettings.enabled) {
            setupIntercom(intercomSettings.appId);
            if (window.Intercom) {
                window.Intercom("onUnreadCountChange", function(unreadCount) {
                    if (intercomSettings.unReadCount !== unreadCount) {
                        const newSettings = {
                            ...intercomSettings,
                            unReadCount: unreadCount,
                        };
                        setIntercomSettings(newSettings);
                    }
                });
            }
        }
    }, [intercomSettings]);
    return (
        <ThemeProvider theme={theme}>
            <IntercomProvider value={intercomSettings}>
                <UserProfileProvider>
                    <UploadTrackingProvider>
                        <CyverseAppBar>
                            <Head>
                                <title>Discovery Environment</title>
                            </Head>
                            <ReactQueryDevtools initialIsOpen={false} />
                            <Navigation activeView={pathname} />
                            <Component {...pageProps} />
                            <UploadManager />
                        </CyverseAppBar>
                    </UploadTrackingProvider>
                </UserProfileProvider>
            </IntercomProvider>
        </ThemeProvider>
    );
}

MyApp.getInitialProps = async (ctx) => {
    const { serverRuntimeConfig } = getConfig();
    return {
        intercomAppId: serverRuntimeConfig.INTERCOM_APP_ID,
        intercomEnabled: serverRuntimeConfig.INTERCOM_ENABLED,
        companyId: serverRuntimeConfig.INTERCOM_COMPANY_ID,
        companyName: serverRuntimeConfig.INTERCOM_COMPANY_NAME,
    };
};

export default MyApp;
