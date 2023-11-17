import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "i18n";

import { getSteps } from "./steps";

import { useMediaQuery, useTheme } from "@mui/material";

// only new users
const Joyride = dynamic(() => import("react-joyride"));

export default function ProductTour(props) {
    const { onTourExit, runTour } = props;
    const theme = useTheme();
    const [tourStepIndex, setTourStepIndex] = useState(0);
    const { t: i18nTour } = useTranslation("intro");
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleJoyrideCallback = (callbackData) => {
        const realCallback = async (callbackData) => {
            const { action, index, type, status } = callbackData;
            const { ACTIONS, EVENTS, STATUS } = await import("react-joyride");

            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                setTourStepIndex(0);
                onTourExit();
            } else if (
                [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)
            ) {
                const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
                setTourStepIndex(stepIndex);
            }
        };
        realCallback(callbackData);
    };

    return (
        <Joyride
            steps={getSteps(i18nTour, isMobile)}
            run={runTour}
            showProgress={true}
            showSkipButton={true}
            continuous={true}
            disableOverlayClose={true}
            callback={handleJoyrideCallback}
            stepIndex={tourStepIndex}
            styles={{
                options: {
                    arrowColor: theme.palette.error.main,
                    backgroundColor: theme.palette.error.contrastText,
                    overlayColor: theme.palette.silver,
                    primaryColor: theme.palette.error.main,
                    textColor: theme.palette.info.main,
                    zIndex: 10000000,
                },
                tooltipContainer: {
                    textAlign: "left",
                },
                buttonSkip: {
                    color: theme.palette.error.main,
                },
            }}
        />
    );
}
