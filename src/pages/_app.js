import React from "react";
import CyverseAppBar from "../components/appBar/CyVerseAppBar";
import theme from "../components/theme/default";
import { ThemeProvider } from "@material-ui/core/styles";
import { UploadTrackingProvider } from "../contexts/uploadTracking";
import { UserProfileProvider } from "../contexts/userProfile";

function MyApp({ Component, pageProps }) {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
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

export default MyApp;
