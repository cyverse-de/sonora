/**
 * @author sriram
 * A custom nextjs app.
 *
 */

import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import { appWithTranslation } from "../i18n";
import "./styles.css";
import { ConfigProvider } from "../contexts/config";
import CyverseAppBar from "../components/layout/CyVerseAppBar";
import NavigationConstants from "../common/NavigationConstants";
import UploadManager from "../components/uploads/manager";
import theme from "../components/theme/default";
import ids from "../components/layout/ids";

import { UploadTrackingProvider } from "../contexts/uploadTracking";
import { UserProfileProvider } from "../contexts/userProfile";

import { NotificationsProvider } from "../contexts/pushNotifications";
import PageWrapper from "../components/layout/PageWrapper";
import useComponentHeight from "../components/utils/useComponentHeight";
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
        const irods = {
            home_path: publicRuntimeConfig.IRODS_HOME_PATH,
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

        if (intercom || admin || irods || tools) {
            setConfig({ intercom, admin, irods, tools });
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
                                <CyverseAppBar
                                    setAppBarRef={setAppBarRef}
                                    activeView={pathname}
                                    intercomUnreadCount={unReadCount}
                                    clientConfig={config}
                                >
                                    <Head>
                                        <title>{t("deTitle")}</title>
                                    </Head>
                                    <ReactQueryDevtools initialIsOpen={false} />
                                    <PageWrapper appBarHeight={appBarHeight}>
                                        <Component {...pageProps} />
                                    </PageWrapper>
                                    <UploadManager />
                                </CyverseAppBar>
                            </ConfigProvider>
                        </NotificationsProvider>
                    </ReactQueryConfigProvider>
                </UploadTrackingProvider>
            </UserProfileProvider>
        </ThemeProvider>
    );
}

export default appWithTranslation(MyApp);
