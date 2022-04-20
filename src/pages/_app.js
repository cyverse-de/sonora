/**
 * @author sriram
 * A custom nextjs app.
 *
 */

import React, { useEffect, useState } from "react";

import { appWithTranslation, useTranslation } from "i18n";
import "./styles.css";

import * as gtag from "../gtag";

import DEAppBar from "components/layout/AppBar";
import NavigationConstants from "common/NavigationConstants";
import UploadManager from "components/uploads/manager";
import theme from "components/theme/default";
import ids from "components/layout/ids";

import { ConfigProvider } from "contexts/config";
import { UploadTrackingProvider } from "contexts/uploadTracking";
import { UserProfileProvider } from "contexts/userProfile";
import { NotificationsProvider } from "contexts/pushNotifications";
import { BootstrapInfoProvider } from "contexts/bootstrap";
import { BagInfoProvider } from "contexts/bagInfo";

import PageWrapper from "components/layout/PageWrapper";
import useComponentHeight from "components/utils/useComponentHeight";
import constants from "../constants";

import Head from "next/head";
import { useRouter } from "next/router";
import getConfig from "next/config";

import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";

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
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { refetchOnWindowFocus: false, retry: false },
                },
            })
    );

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
            userProfileUrl: publicRuntimeConfig.INTERCOM_USER_PROFILE_URL,
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
            trash_path: publicRuntimeConfig.IRODS_TRASH_PATH,
            community_path: publicRuntimeConfig.IRODS_COMMUNITY_PATH,
        };
        const sessions = {
            poll_interval_ms: publicRuntimeConfig.SESSION_POLL_INTERVAL_MS,
        };
        const tools = {
            admin: {
                max_cpu_limit: publicRuntimeConfig.TOOLS_ADMIN_MAX_CPU_LIMIT,
                max_memory_limit:
                    publicRuntimeConfig.TOOLS_ADMIN_MAX_MEMORY_LIMIT,
                max_disk_limit: publicRuntimeConfig.TOOLS_ADMIN_MAX_DISK_LIMIT,
            },
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

        const vice = {
            defaultImage: publicRuntimeConfig.VICE_DEFAULT_IMAGE,
            defaultName: publicRuntimeConfig.VICE_DEFAULT_NAME,
            defaultCasUrl: publicRuntimeConfig.VICE_DEFAULT_CAS_URL,
            defaultCasValidate: publicRuntimeConfig.VICE_DEFAULT_CAS_VALIDATE,
            concurrentJobs: publicRuntimeConfig.VICE_CONCURRENT_JOBS,
            useCaseMinChars: publicRuntimeConfig.VICE_USE_CASE_MIN_CHARS,
            initContainerName: publicRuntimeConfig.VICE_INIT_CONTAINER_NAME,
            inputFilesContainerName:
                publicRuntimeConfig.VICE_INPUT_FILES_CONTAINER_NAME,
            viceProxyContainerName:
                publicRuntimeConfig.VICE_VICE_PROXY_CONTAINER_NAME,
            analysisContainerName:
                publicRuntimeConfig.VICE_ANALYSIS_CONTAINER_NAME,
            deploymentTimeoutMs: publicRuntimeConfig.VICE_DEPLOYMENT_TIMEOUT_MS,
        };

        const grouper = {
            allUsers: publicRuntimeConfig.GROUPER_ALL_USERS,
            admin: publicRuntimeConfig.GROUPER_ADMIN,
        };

        const subscriptions = {
            checkout_url: publicRuntimeConfig.SUBSCRIPTIONS_CHECKOUT_URL,
        };

        const legacyDeUrl = publicRuntimeConfig.LEGACY_DE_URL;
        const usernameSuffix = publicRuntimeConfig.USERNAME_SUFFIX;
        const userPortalURL = publicRuntimeConfig.USER_PORTAL_URL;

        console.log(publicRuntimeConfig);

        setConfig({
            intercom,
            admin,
            analysis,
            irods,
            sessions,
            tools,
            fileIdentifiers,
            vice,
            grouper,
            subscriptions,
            legacyDeUrl,
            usernameSuffix,
            userPortalURL,
        });

        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        if (intercom.enabled) {
            setupIntercom(intercom.appId);
            if (window.Intercom) {
                window.Intercom(
                    "onUnreadCountChange",
                    function (newUnreadCount) {
                        setUnReadCount(newUnreadCount);
                    }
                );
            }
        }
    }, [publicRuntimeConfig, setConfig, unReadCount]);

    return (
        <ThemeProvider theme={theme}>
            <UserProfileProvider>
                <UploadTrackingProvider>
                    <QueryClientProvider
                        client={queryClient}
                        contextSharing={true}
                    >
                        <CssBaseline />
                        <NotificationsProvider>
                            <ConfigProvider>
                                <BootstrapInfoProvider>
                                    <BagInfoProvider>
                                        <DEAppBar
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
                                        </DEAppBar>
                                    </BagInfoProvider>
                                </BootstrapInfoProvider>
                            </ConfigProvider>
                        </NotificationsProvider>
                    </QueryClientProvider>
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

    // merge the two always-needed namespaces into the pageProps namespacesRequired array
    return {
        pageProps: {
            ...pageProps,
            namespacesRequired: [
                ...(pageProps?.namespacesRequired ?? []),
                "common",
                "bags",
            ],
        },
    };
};
