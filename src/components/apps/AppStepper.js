/**
 * A component for displaying a stepper in Apps Launch and Editor forms.
 *
 * @author psarando, sriram
 */
import React from "react";

import { useTranslation } from "i18n";

import ids from "./ids";
import UtilIds from "../utils/ids";

import buildID from "components/utils/DebugIDUtil";

import {
    Button,
    MobileStepper,
    Step,
    StepButton,
    StepLabel,
    Stepper,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import { Skeleton } from "@mui/material";

export const StepperSkeleton = React.forwardRef(function StepperSkeleton(
    { baseId },
    ref
) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (isMobile) {
        return (
            <Skeleton
                id={buildID(baseId, UtilIds.LOADING_SKELETON)}
                width="100%"
                ref={ref}
            >
                <MobileStepper
                    activeStep={0}
                    ref={ref}
                    steps={4}
                    position="bottom"
                    nextButton={<Button size="small">&nbsp;</Button>}
                    backButton={<Button size="small">&nbps;</Button>}
                />
            </Skeleton>
        );
    }

    return (
        <Skeleton
            id={buildID(baseId, UtilIds.LOADING_SKELETON)}
            width="100%"
            ref={ref}
        >
            <Stepper style={{ padding: 24 }} alternativeLabel nonLinear>
                <Step>
                    <StepButton>&nbsp;</StepButton>
                </Step>
            </Stepper>
        </Skeleton>
    );
});

const AppStepper = React.forwardRef(function AppStepper(props, ref) {
    const {
        baseId,
        steps,
        handleStep,
        handleNext,
        handleBack,
        isLastStep,
        activeStep,
        stepCompleted,
        stepError,
    } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { t } = useTranslation("common");

    if (isMobile) {
        return (
            <MobileStepper
                ref={ref}
                activeStep={activeStep}
                steps={steps?.length}
                position="bottom"
                nextButton={
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleNext}
                        disabled={isLastStep()}
                        id={buildID(baseId, ids.APP_STEPPER.STEP_NEXT)}
                        color="primary"
                    >
                        {t("next")}
                        {theme.direction === "rtl" ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        id={buildID(baseId, ids.APP_STEPPER.STEP_BACK)}
                    >
                        {theme.direction === "rtl" ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        {t("back")}
                    </Button>
                }
            />
        );
    }

    return (
        <Stepper
            style={{ padding: 24 }}
            ref={ref}
            alternativeLabel
            nonLinear
            activeStep={activeStep}
        >
            {steps.map((step, index) => {
                const completed = stepCompleted && stepCompleted(index);
                const hasError = stepError && stepError(index);

                return (
                    <Step key={step.label} completed={completed}>
                        <StepButton
                            id={buildID(
                                baseId,
                                ids.APP_STEPPER.STEP_BTN,
                                index + 1
                            )}
                            onClick={handleStep(index)}
                        >
                            <StepLabel error={hasError}>{step.label}</StepLabel>
                        </StepButton>
                    </Step>
                );
            })}
        </Stepper>
    );
});

export default AppStepper;
