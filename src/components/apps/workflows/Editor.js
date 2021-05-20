/**
 * A component for creating and editing App Pipeline Workflows.
 *
 * @author psarando
 */
import React from "react";

import { Formik } from "formik";

import { useTranslation } from "i18n";

import AppOrder from "./AppOrder";
import WorkflowInfo from "./WorkflowInfo";

import ids from "./ids";
import styles from "../commonStyles";

import AppStepper, { StepperSkeleton } from "../AppStepper";
import AppStepperFormSkeleton from "../AppStepperFormSkeleton";
import AppStepDisplay, { BottomNavigationSkeleton } from "../AppStepDisplay";

import BackButton from "components/utils/BackButton";
import SaveButton from "components/utils/SaveButton";
import useComponentHeight from "components/utils/useComponentHeight";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import {
    AnnouncerConstants,
    announce,
    build as buildID,
    getFormError,
} from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    Grid,
    makeStyles,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import { ArrowBack, ArrowForward } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const StepperNavigation = (props) => {
    const { baseId, backDisabled, nextDisabled, handleBack, handleNext } =
        props;

    const { t } = useTranslation("common");

    return (
        <ButtonGroup fullWidth variant="contained" color="primary">
            <Button
                id={buildID(baseId, ids.BUTTONS.BACK)}
                disabled={backDisabled}
                startIcon={<ArrowBack />}
                onClick={handleBack}
            >
                {t("back")}
            </Button>
            <Button
                id={buildID(baseId, ids.BUTTONS.NEXT)}
                disabled={nextDisabled}
                endIcon={<ArrowForward />}
                onClick={handleNext}
            >
                {t("next")}
            </Button>
        </ButtonGroup>
    );
};

const WorkflowEditor = (props) => {
    const {
        baseId,
        appDescription,
        loading,
        loadingError,
        showErrorAnnouncer,
    } = props;

    const [activeStep, setActiveStep] = React.useState(0);

    const stepperRef = React.useRef(null);
    const [stepperHeight, setStepperRef] = useComponentHeight();

    React.useEffect(() => {
        setStepperRef(stepperRef);
    }, [stepperRef, setStepperRef]);

    const { t } = useTranslation(["workflows", "common"]);
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const saveApp = ({ workflow, onSuccess }) => {
        console.log(workflow);
        onSuccess(workflow);
    };

    const stepAppInfo = {
        label: t("workflowInfo"),
        contentLabel: t("workflowInfo"),
        helpText: t("stepHelpInfo"),
        errorText: t("stepErrorInfo"),
    };
    const stepOrderApps = {
        label: t("selectAndOrderApps"),
        contentLabel: t("selectAndOrderApps"),
        helpText: t("stepHelpSelectAndOrder"),
        errorText: t("stepErrorSelectAndOrder"),
    };
    const stepIOMapping = {
        label: t("mapOutputsToInputs"),
        contentLabel: t("mapOutputsToInputs"),
        helpText: t("stepHelpMapping"),
        errorText: t("stepErrorMapping"),
    };

    const workflowSteps = [stepAppInfo, stepOrderApps, stepIOMapping];

    const activeStepInfo = workflowSteps[activeStep];

    if (loading) {
        return <AppStepperFormSkeleton baseId={baseId} header />;
    }

    if (loadingError) {
        return (
            <WrappedErrorHandler baseId={baseId} errorObject={loadingError} />
        );
    }

    return (
        <Formik
            initialValues={appDescription}
            initialTouched={{ workflowSteps: [false, false, false] }}
            validate={(values) => {
                const errors = {};
                const workflowSteps = [];

                if (!values.name) {
                    workflowSteps[0] = true;
                    errors.error = true;
                    errors.name = t("common:required");
                }
                if (!values.description) {
                    workflowSteps[0] = true;
                    errors.error = true;
                    errors.description = t("common:required");
                }

                if (values.steps.length < 2) {
                    workflowSteps[1] = stepOrderApps.errorText;
                    errors.error = true;
                }

                if (workflowSteps.length > 0) {
                    errors.workflowSteps = workflowSteps;
                }

                return errors;
            }}
            onSubmit={(values, actions) => {
                const workflow = values;

                const onSuccess = (workflow) => {
                    // Note that enableReinitialize should not be used when
                    // using resetForm with new values.
                    actions.resetForm({
                        values: workflow,
                        touched: { workflowSteps: [true, true, true] },
                    });

                    announce({
                        text: t("workflowSaved"),
                        variant: AnnouncerConstants.SUCCESS,
                    });
                    console.log("onSuccess", workflow);
                };

                const onError = (errorMessage) => {
                    showErrorAnnouncer(t("workflowSaveErr"), errorMessage);
                    actions.setSubmitting(false);
                };

                saveApp({ workflow, onSuccess, onError });
            }}
        >
            {({
                handleSubmit,
                setTouched,
                isSubmitting,
                dirty,
                touched,
                errors,
                values,
            }) => {
                const saveDisabled = isSubmitting || !dirty || errors.error;

                const stepCompleted = (stepIndex) => {
                    return (
                        touched.workflowSteps[stepIndex] &&
                        !(
                            errors.workflowSteps &&
                            errors.workflowSteps[stepIndex]
                        )
                    );
                };

                const displayStepError = (stepIndex) => {
                    if (stepIndex === 0) {
                        return (
                            getFormError("name", touched, errors) ||
                            getFormError("description", touched, errors)
                        );
                    }

                    return getFormError(
                        `workflowSteps[${stepIndex}]`,
                        touched,
                        errors
                    );
                };

                const handleStepVisited = () => {
                    const workflowStepsTouched = [...touched.workflowSteps];
                    workflowStepsTouched[activeStep] = true;

                    setTouched(
                        { ...touched, workflowSteps: workflowStepsTouched },
                        true
                    );
                };

                const isLastStep = () => {
                    return activeStep === workflowSteps.length - 1;
                };

                const handleNext = () => {
                    const newActiveStep = isLastStep() ? 0 : activeStep + 1;
                    setActiveStep(newActiveStep);
                    handleStepVisited();
                };

                const handleBack = () => {
                    const newActiveStep = activeStep
                        ? activeStep - 1
                        : workflowSteps.length - 1;
                    setActiveStep(newActiveStep);
                    handleStepVisited();
                };

                const handleStep = (step) => () => {
                    handleStepVisited();
                    setActiveStep(step);
                };

                return (
                    <Paper className={classes.formContainer}>
                        <Grid
                            container
                            justify="space-between"
                            alignItems="flex-start"
                            wrap="nowrap"
                        >
                            <BackButton />
                            <Typography variant="h6">
                                {t(
                                    values.id
                                        ? "editWorkflow"
                                        : "createWorkflow",
                                    {
                                        name: values.name,
                                    }
                                )}
                            </Typography>
                            <SaveButton
                                id={buildID(baseId, ids.BUTTONS.SAVE_BTN)}
                                type="submit"
                                disabled={saveDisabled}
                                onSave={handleSubmit}
                            />
                        </Grid>

                        {isSubmitting ? (
                            <StepperSkeleton baseId={baseId} ref={stepperRef} />
                        ) : (
                            <AppStepper
                                baseId={baseId}
                                steps={workflowSteps}
                                handleStep={handleStep}
                                handleNext={handleNext}
                                handleBack={handleBack}
                                activeStep={activeStep}
                                isLastStep={isLastStep}
                                stepCompleted={stepCompleted}
                                stepError={(stepIndex) =>
                                    !!displayStepError(stepIndex)
                                }
                                ref={stepperRef}
                            />
                        )}

                        <AppStepDisplay
                            step={activeStep + 1}
                            label={activeStepInfo.contentLabel}
                            helpText={activeStepInfo.helpText}
                            errorText={
                                displayStepError(activeStep) &&
                                activeStepInfo.errorText
                            }
                            bottomOffset={isMobile && stepperHeight}
                            actions={
                                !isMobile && (
                                    <StepperNavigation
                                        baseId={buildID(
                                            baseId,
                                            ids.BUTTONS.NAV_TOP
                                        )}
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
                                            baseId={buildID(
                                                baseId,
                                                ids.BUTTONS.NAV_BOTTOM
                                            )}
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
                                <WorkflowInfo baseId={baseId} />
                            ) : activeStepInfo === stepOrderApps ? (
                                <AppOrder
                                    baseId={baseId}
                                    steps={values.steps}
                                />
                            ) : activeStepInfo === stepIOMapping ? (
                                <Typography>
                                    {t("common:comingSoon")}
                                </Typography>
                            ) : null}
                        </AppStepDisplay>
                    </Paper>
                );
            }}
        </Formik>
    );
};

export default withErrorAnnouncer(WorkflowEditor);
