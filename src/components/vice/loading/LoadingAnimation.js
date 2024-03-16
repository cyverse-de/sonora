/**
 * Loading animation for the VICE page from Mariah
 */
import React, { useEffect, useRef } from "react";

import { makeStyles } from "tss-react/mui";
import lottie from "lottie-web";
import animation from "./vice_loading.json";

import styles from "./styles";

const useStyles = makeStyles()(styles);

function LoadingAnimation() {
    let animationContainer = useRef();

    const { classes } = useStyles();

    useEffect(() => {
        lottie.loadAnimation({
            container: animationContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animation,
        });
    }, []);

    return <div className={classes.animationBox} ref={animationContainer} />;
}

export default LoadingAnimation;
