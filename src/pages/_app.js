import React from "react";
import CyverseAppBar from "../components/appBar/CyVerseAppBar";
import theme from "../components/theme/default";
import { ThemeProvider } from "@material-ui/core/styles";
import "./styles.css";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { pathname } = router.pathname;

    React.useEffect(() => {
        //map / to dashboard
        if (!pathname) {
            console.log("pushing to router==>" + pathname);
            router.push("/dashboard");
        }
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <CyverseAppBar>
                <Component {...pageProps} />
            </CyverseAppBar>
        </ThemeProvider>
    );
}

export default MyApp;
