import React from "react";
import CyverseAppBar from "../components/appBar/CyVerseAppBar";
import theme from "../components/theme/default";
import { ThemeProvider } from "@material-ui/core/styles";
import { UploadTrackingProvider } from "../contexts/uploadTracking";
import { UserProfileProvider } from "../contexts/userProfile";
import getConfig from "next/config";

function MyApp({ Component, pageProps, intercomAppId, intercomEnabled }) {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        const APP_ID = intercomAppId;
        const enabled = intercomEnabled;
        if (enabled) {
            (function() {
                var w = window;
                var ic = w.Intercom;
                if (typeof ic === "function") {
                    ic("reattach_activator");
                    ic("update", intercomSettings);
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
                        s.src = "https://widget.intercom.io/widget/" + APP_ID;
                        var x = d.getElementsByTagName("script")[0];
                        x.parentNode.insertBefore(s, x);
                    }

                    if (w.attachEvent) {
                        w.attachEvent("onload", l);
                    } else {
                        w.addEventListener("load", l, false);
                    }
                    w.intercomSettings = {
                        app_id: APP_ID,
                        alignment: "right",
                        horizontal_padding: 20,
                        vertical_padding: 45,
                        custom_launcher_selector: "#help_menu_intercom_link",
                    };
                }
            })();
        }
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <UserProfileProvider>
                <UploadTrackingProvider>
                    <CyverseAppBar>
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
