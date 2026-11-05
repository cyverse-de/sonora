/**
 * @author sriram
 * A custom nextjs app.
 *
 */

import React, { useCallback, useEffect, useState } from "react";

import { appWithTranslation, useTranslation } from "i18n";
import "./styles.css";

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
import { useReportWebVitals } from "next/web-vitals";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createEmotionSsrAdvancedApproach } from "tss-react/next/pagesDir";

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
    const { t } = useTranslation("common");

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

    const { title } = pageProps;

    const reportWebVitals = useCallback((metric) => {
        if (!window.gtag) return;

        window.gtag("event", metric.name, {
            event_category:
                metric.label === "web-vital"
                    ? "Web Vitals"
                    : "Next.js custom metric",
            value: Math.round(
                metric.name === "CLS" ? metric.value * 1000 : metric.value
            ),
            event_label: metric.id,
            non_interaction: true,
        });
    }, []);

    useReportWebVitals(reportWebVitals);

    useEffect(() => {
        if (!config?.analytics?.id) return;

        const handleRouteChange = () => {
            if (window.gtag) {
                window.gtag("event", "page_view", {
                    page_location: window.location.href,
                });
            }
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [config?.analytics?.id, router.events]);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/config")
            .then((res) => {
                if (!res.ok)
                    throw new Error(`Config fetch failed: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (cancelled) return;

                setConfig(data);

                const jssStyles = document.querySelector("#jss-server-side");
                if (jssStyles) {
                    jssStyles.parentElement.removeChild(jssStyles);
                }
                if (data.intercom?.enabled) {
                    setupIntercom(data.intercom.appId);
                    if (window.Intercom) {
                        window.Intercom(
                            "onUnreadCountChange",
                            function (newUnreadCount) {
                                setUnReadCount(newUnreadCount);
                            }
                        );
                    }
                }

                if (data.analytics?.enabled && data.analytics?.id) {
                    const analyticsId = data.analytics.id;
                    const script = document.createElement("script");
                    script.async = true;
                    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
                    document.head.appendChild(script);

                    window.dataLayer = window.dataLayer || [];
                    function gtag() {
                        window.dataLayer.push(arguments);
                    }
                    window.gtag = gtag;
                    gtag("js", new Date());
                    gtag("config", analyticsId, {
                        page_location: window.location.href,
                    });
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error("Failed to load app configuration:", err);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <UserProfileProvider>
                    <UploadTrackingProvider>
                        <QueryClientProvider client={queryClient}>
                            <CssBaseline />
                            <NotificationsProvider>
                                <ConfigProvider>
                                    <BootstrapInfoProvider>
                                        <BagInfoProvider>
                                            <DEAppBar
                                                setAppBarRef={setAppBarRef}
                                                activeView={pathname}
                                                intercomUnreadCount={
                                                    unReadCount
                                                }
                                                clientConfig={config}
                                            >
                                                <Head>
                                                    <title>
                                                        {title
                                                            ? t("dePageTitle", {
                                                                  title,
                                                              })
                                                            : t("deTitle")}
                                                    </title>
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
        </StyledEngineProvider>
    );
}

const { augmentDocumentWithEmotionCache, withAppEmotionCache } =
    createEmotionSsrAdvancedApproach({ key: "css" });

export { augmentDocumentWithEmotionCache };

export default appWithTranslation(withAppEmotionCache(MyApp));
