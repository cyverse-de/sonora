/**
 * @author sriram
 * A custom nextjs app.
 *
 */

import React, { useEffect, useState } from "react";

import { appWithTranslation, useTranslation } from "i18n";
import "./styles.css";

import * as gtag from "../gtag";

import CyverseAppBar from "components/layout/CyVerseAppBar";
import NavigationConstants from "common/NavigationConstants";
import UploadManager from "components/uploads/manager";
import theme from "components/theme/default";
import ids from "components/layout/ids";

import { ConfigProvider } from "contexts/config";
import { UploadTrackingProvider } from "contexts/uploadTracking";
import { UserProfileProvider } from "contexts/userProfile";
import { NotificationsProvider } from "contexts/pushNotifications";
import { PreferencesProvider } from "contexts/userPreferences";

import PageWrapper from "components/layout/PageWrapper";
import useComponentHeight from "components/utils/useComponentHeight";
import constants from "../constants";

import Head from "next/head";
import { useRouter } from "next/router";
import getConfig from "next/config";

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

// will be automatically called by nextjs
// https://nextjs.org/docs/advanced-features/measuring-performance
export function reportWebVitals({ id, name, label, value }) {
    const { publicRuntimeConfig = {} } = getConfig() || {};
    const analyticsEnabled = publicRuntimeConfig.ANALYTICS_ENABLED;
    if (analyticsEnabled && window.gtag) {
        console.log(
            "Logging event id=>" +
                id +
                " name=>" +
                name +
                " label" +
                label +
                " value=>" +
                value
        );
        window.gtag("event", name, {
            event_category:
                label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
            value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
            event_label: id, // id unique to current page load
            non_interaction: true, // avoids affecting bounce rate.
        });
    }
}

function MyApp({ Component, pageProps }) {
    const { t } = useTranslation("common");
    const { publicRuntimeConfig = {} } = getConfig() || {};

    const [appBarHeight, setAppBarRef] = useComponentHeight();
    const router = useRouter();
    const [config, setConfig] = useState();
    const pathname = router.pathname
        ? router.pathname.split(constants.PATH_SEPARATOR)[1]
        : NavigationConstants.DASHBOARD;
    const [unReadCount, setUnReadCount] = useState(0);

    const queryConfig = {
        queries: { refetchOnWindowFocus: false, retry: false },
    };

    useEffect(() => {
        const analytics_id = publicRuntimeConfig.ANALYTICS_ID;
        const handleRouteChange = (url) => {
            gtag.pageview(analytics_id, url);
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [publicRuntimeConfig.ANALYTICS_ID, router.events]);

    React.useEffect(() => {
        const intercom = {
            appId: publicRuntimeConfig.INTERCOM_APP_ID,
            enabled: publicRuntimeConfig.INTERCOM_ENABLED,
            companyId: publicRuntimeConfig.INTERCOM_COMPANY_ID,
            companyName: publicRuntimeConfig.INTERCOM_COMPANY_NAME,
        };
        const admin = {
            groups: publicRuntimeConfig.ADMIN_GROUPS,
            group_attribute_name: publicRuntimeConfig.ADMIN_GROUP_ATTRIBUTE,
        };
        const analysis = {
            supportUser: {
                id: publicRuntimeConfig.ANALYSIS_SUPPORT_USER,
                source_id: publicRuntimeConfig.ANALYSIS_SUPPORT_SOURCE_ID,
            },
        };
        const irods = {
            home_path: publicRuntimeConfig.IRODS_HOME_PATH,
        };
        const sessions = {
            poll_interval_ms: publicRuntimeConfig.SESSION_POLL_INTERVAL_MS,
        };
        const tools = {
            private: {
                max_cpu_limit: publicRuntimeConfig.TOOLS_PRIVATE_MAX_CPU_LIMIT,
                max_memory_limit:
                    publicRuntimeConfig.TOOLS_PRIVATE_MAX_MEMORY_LIMIT,
                max_disk_limit:
                    publicRuntimeConfig.TOOLS_PRIVATE_MAX_DISK_LIMIT,
            },
        };
        const fileIdentifiers = {
            htPathList: publicRuntimeConfig.HT_PATH_LIST_IDENTIFIER,
            multiInputPathList:
                publicRuntimeConfig.MULTI_INPUT_PATH_LIST_IDENTIFIER,
        };

        if (
            intercom ||
            admin ||
            analysis ||
            irods ||
            sessions ||
            tools ||
            fileIdentifiers
        ) {
            setConfig({
                intercom,
                admin,
                analysis,
                irods,
                sessions,
                tools,
                fileIdentifiers,
            });
        }

        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        if (intercom.enabled) {
            setupIntercom(intercom.appId);
            if (window.Intercom) {
                window.Intercom("onUnreadCountChange", function (
                    newUnreadCount
                ) {
                    setUnReadCount(newUnreadCount);
                });
            }
        }
    }, [publicRuntimeConfig, setConfig, unReadCount]);

    return (
        <ThemeProvider theme={theme}>
            <UserProfileProvider>
                <UploadTrackingProvider>
                    <ReactQueryConfigProvider config={queryConfig}>
                        <CssBaseline />
                        <NotificationsProvider>
                            <ConfigProvider>
                                <PreferencesProvider>
                                    <CyverseAppBar
                                        setAppBarRef={setAppBarRef}
                                        activeView={pathname}
                                        intercomUnreadCount={unReadCount}
                                        clientConfig={config}
                                    >
                                        <Head>
                                            <title>{t("deTitle")}</title>
                                        </Head>
                                        <ReactQueryDevtools
                                            initialIsOpen={false}
                                        />
                                        <PageWrapper
                                            appBarHeight={appBarHeight}
                                        >
                                            <Component {...pageProps} />
                                        </PageWrapper>
                                        <UploadManager />
                                    </CyverseAppBar>
                                </PreferencesProvider>
                            </ConfigProvider>
                        </NotificationsProvider>
                    </ReactQueryConfigProvider>
                </UploadTrackingProvider>
            </UserProfileProvider>
        </ThemeProvider>
    );
}

export default appWithTranslation(MyApp);

MyApp.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["common"] };
};
