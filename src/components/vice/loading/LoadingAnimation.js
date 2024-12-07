/**
 * Loading animation for the VICE page from Mariah
 */
import React, { useEffect, useRef } from "react";

import { makeStyles } from "tss-react/mui";
import animation from "./vice_loading.json";

import styles from "./styles";

const useStyles = makeStyles()(styles);

function LoadingAnimation() {
    let animationContainer = useRef();

    const { classes } = useStyles();

    useEffect(() => {
        const loadAnimation = async () => {
            const lottie = (await import("lottie-web")).default;
            lottie.loadAnimation({
                container: animationContainer.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: animation,
            });
        };
        loadAnimation();
    }, []);

    return <div className={classes.animationBox} ref={animationContainer} />;
}

export default LoadingAnimation;
