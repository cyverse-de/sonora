/**
 * @author sriram
 * A custom nextjs app.
 *
 */

import React, { useState } from "react";

import "./styles.css";
import CyverseAppBar from "../components/layout/CyVerseAppBar";
import NavigationConstants from "../common/NavigationConstants";
import UploadManager from "../components/uploads/manager";
import theme from "../components/theme/default";
import ids from "../components/layout/ids";

import { UploadTrackingProvider } from "../contexts/uploadTracking";
import { UserProfileProvider } from "../contexts/userProfile";
import { IntercomProvider } from "../contexts/intercom";
import { NotificationsProvider } from "../contexts/pushNotifications";
import PageWrapper from "../components/layout/PageWrapper";
import useComponentHeight from "../components/utils/useComponentHeight";
import constants from "../constants";

import Head from "next/head";
import { useRouter } from "next/router";

import { ReactQueryDevtools } from "react-query-devtools";
import { ReactQueryConfigProvider } from "react-query";

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

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

function MyApp({ Component, pageProps }) {
    const [appBarHeight, setAppBarRef] = useComponentHeight();
    const router = useRouter();
    const pathname = router.pathname
        ? router.pathname.split(constants.PATH_SEPARATOR)[1]
        : NavigationConstants.DASHBOARD;
    const [intercomSettings, setIntercomSettings] = useState({
        appId: process.env.INTERCOM_APP_ID,
        enabled: process.env.INTERCOM_ENABLED,
        companyId: process.env.INTERCOM_COMPANY_ID,
        companyName: process.env.INTERCOM_COMPANY_NAME,
        unReadCount: 0,
    });

    const queryConfig = {
        refetchOnWindowFocus: false,
        retry: false,
    };

    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        if (intercomSettings.enabled) {
            setupIntercom(intercomSettings.appId);
            if (window.Intercom) {
                window.Intercom("onUnreadCountChange", function (unreadCount) {
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
                        <ReactQueryConfigProvider config={queryConfig}>
                            <CssBaseline />
                            <NotificationsProvider>
                                <CyverseAppBar
                                    setAppBarRef={setAppBarRef}
                                    activeView={pathname}
                                >
                                    <Head>
                                        <title>Discovery Environment</title>
                                    </Head>
                                    <ReactQueryDevtools initialIsOpen={false} />
                                    <PageWrapper appBarHeight={appBarHeight}>
                                        <Component {...pageProps} />
                                    </PageWrapper>
                                    <UploadManager />
                                </CyverseAppBar>
                            </NotificationsProvider>
                        </ReactQueryConfigProvider>
                    </UploadTrackingProvider>
                </UserProfileProvider>
            </IntercomProvider>
        </ThemeProvider>
    );
}

export default MyApp;
