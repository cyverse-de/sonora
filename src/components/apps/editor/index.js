/**
 * A component for creating and editing Apps.
 *
 * @author psarando
 */
import React from "react";

import { Formik } from "formik";

import { useTranslation } from "i18n";

import { formatSubmission, initAppValues } from "./formatters";
import ids from "./ids";
import styles from "./styles";

import AppInfo from "./AppInfo";
import CmdLineOrderForm from "./CmdLineOrderForm";
import ParamGroups from "./ParamGroups";
import ParametersPreview from "./ParametersPreview";

import AppStepper, { StepperSkeleton } from "../AppStepper";
import AppStepDisplay, { BottomNavigationSkeleton } from "../AppStepDisplay";

import SaveButton from "components/utils/SaveButton";
import useComponentHeight from "components/utils/useComponentHeight";

import { build as buildID, getFormError } from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    makeStyles,
    Paper,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import { ArrowBack, ArrowForward } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const displayStepError = (stepIndex, errors, touched) => {
    if (stepIndex === 0) {
        return (
            getFormError("name", touched, errors) ||
            getFormError("description", touched, errors)
        );
    }

    return false;
};

const StepperNavigation = (props) => {
    const { backDisabled, nextDisabled, handleBack, handleNext } = props;

    const { t } = useTranslation("common");

    return (
        <ButtonGroup fullWidth variant="contained" color="primary">
            <Button
                disabled={backDisabled}
                startIcon={<ArrowBack />}
                onClick={handleBack}
            >
                {t("back")}
            </Button>
            <Button
                disabled={nextDisabled}
                endIcon={<ArrowForward />}
                onClick={handleNext}
            >
                {t("next")}
            </Button>
        </ButtonGroup>
    );
};

const AppEditor = (props) => {
    const { baseId, appDescription } = props;

    const [activeStep, setActiveStep] = React.useState(0);

    const stepperRef = React.useRef(null);
    const [stepperHeight, setStepperRef] = useComponentHeight();

    React.useEffect(() => {
        setStepperRef(stepperRef);
    }, [stepperRef, setStepperRef]);

    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);
    const classes = useStyles();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const stepAppInfo = {
        label: t("appInfo"),
        contentLabel: t("appInfo"),
    };
    const stepParameters = {
        label: t("parameters"),
        contentLabel: t("appParameters"),
    };
    const stepPreview = {
        label: t("previewApp"),
        contentLabel: t("previewApp"),
    };
    const stepCmdLineOrder = {
        label: t("commandLineOrder"),
        contentLabel: t("commandLineOrder"),
    };

    const steps = [stepAppInfo, stepParameters, stepPreview, stepCmdLineOrder];

    const isLastStep = () => {
        return activeStep === steps.length - 1;
    };

    const handleNext = () => {
        const newActiveStep = isLastStep() ? 0 : activeStep + 1;

        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) =>
            activeStep ? prevActiveStep - 1 : steps.length - 1
        );
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const activeStepInfo = steps[activeStep];

    return (
        <Formik
            initialValues={initAppValues({ ...appDescription })}
            validate={(values) => {
                const errors = {};

                if (!values.name) {
                    errors.error = true;
                    errors.name = t("common:required");
                }
                if (!values.description) {
                    errors.error = true;
                    errors.description = t("common:required");
                }

                // TODO add a flag for saveable-errors,
                // so user can save work-in-progress but get a warning
                return errors;
            }}
            onSubmit={(values, actions) => {
                // FIXME submit to service
                console.log(formatSubmission(values));
                // Note that enableReinitialize should not be used when using
                // resetForm with new values.
                actions.resetForm({ values });
            }}
        >
            {({
                handleSubmit,
                isSubmitting,
                setFieldValue,
                dirty,
                touched,
                errors,
                values,
            }) => {
                const saveDisabled = isSubmitting || !dirty || errors.error;

                return (
                    <Paper>
                        <Toolbar>
                            <Typography variant="h6" className={classes.flex}>
                                {t("appIntegrationPageHeader", {
                                    name: values.name || t("newApp"),
                                })}
                            </Typography>
                            <SaveButton
                                id={buildID(baseId, ids.BUTTONS.SAVE_BTN)}
                                type="submit"
                                disabled={saveDisabled}
                                onSave={handleSubmit}
                            />
                        </Toolbar>
                        {isSubmitting ? (
                            <StepperSkeleton baseId={baseId} ref={stepperRef} />
                        ) : (
                            <AppStepper
                                baseId={baseId}
                                steps={steps}
                                handleStep={handleStep}
                                handleNext={handleNext}
                                handleBack={handleBack}
                                activeStep={activeStep}
                                isLastStep={isLastStep}
                                stepError={(stepIndex) =>
                                    !!displayStepError(
                                        stepIndex,
                                        errors,
                                        touched
                                    )
                                }
                                ref={stepperRef}
                            />
                        )}
                        <AppStepDisplay
                            step={activeStep + 1}
                            label={activeStepInfo.contentLabel}
                            bottomOffset={isMobile && stepperHeight}
                            actions={
                                !isMobile && (
                                    <StepperNavigation
                                        backDisabled={!activeStep}
                                        nextDisabled={isLastStep()}
                                        handleBack={handleBack}
                                        handleNext={handleNext}
                                    />
                                )
                            }
                            bottomNavigation={
                                isSubmitting ? (
                                    <BottomNavigationSkeleton />
                                ) : (
                                    !isMobile && (
                                        <StepperNavigation
                                            backDisabled={!activeStep}
                                            nextDisabled={isLastStep()}
                                            handleBack={handleBack}
                                            handleNext={handleNext}
                                        />
                                    )
                                )
                            }
                        >
                            {activeStepInfo === stepAppInfo ? (
                                <AppInfo baseId={baseId} />
                            ) : activeStepInfo === stepParameters ? (
                                <ParamGroups
                                    baseId={baseId}
                                    groups={values.groups}
                                />
                            ) : activeStepInfo === stepPreview ? (
                                <ParametersPreview
                                    baseId={baseId}
                                    groups={values.groups}
                                />
                            ) : activeStepInfo === stepCmdLineOrder ? (
                                <CmdLineOrderForm
                                    baseId={baseId}
                                    toolName={values.tools[0]?.name}
                                    groups={values.groups}
                                    setFieldValue={setFieldValue}
                                />
                            ) : null}
                        </AppStepDisplay>
                    </Paper>
                );
            }}
        </Formik>
    );
};

export default AppEditor;
