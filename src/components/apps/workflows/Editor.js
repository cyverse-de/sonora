/**
 * A component for creating and editing App Workflows.
 *
 * @author psarando
 */
import React from "react";

import { Formik } from "formik";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

import { useTranslation } from "i18n";

import AppOrder from "./AppOrder";
import InputOutputMapping from "./InputOutputMapping";
import WorkflowInfo from "./WorkflowInfo";

import ids from "./ids";
import styles from "../commonStyles";

import { formatWorkflowSubmission, initWorkflowValues } from "./formatters";

import AppStepper, { StepperSkeleton } from "../AppStepper";
import AppStepperFormSkeleton from "../AppStepperFormSkeleton";
import AppStepDisplay, {
    BottomNavigationSkeleton as StepperNavSkeleton,
} from "../AppStepDisplay";

import { getAppEditPath } from "components/apps/utils";

import BackButton from "components/utils/BackButton";
import SaveButton from "components/utils/SaveButton";
import useComponentHeight from "components/utils/useComponentHeight";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { addPipeline, updatePipeline } from "serviceFacades/pipelines";

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
    const {
        baseId,
        backDisabled,
        nextDisabled,
        handleBack,
        handleNext,
        loading,
    } = props;

    const { t } = useTranslation("common");

    return loading ? (
        <StepperNavSkeleton />
    ) : (
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
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const [savePipeline] = useMutation(
        ({ workflow }) => {
            const { id: appId } = workflow;
            const request = { appId, workflow };

            return appId ? updatePipeline(request) : addPipeline(request);
        },
        {
            onSuccess: (resp, { onSuccess }) => {
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
            },
        }
    );

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
            initialValues={initWorkflowValues(appDescription)}
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

                const tooFewSteps = values.steps.length < 2;
                if (tooFewSteps) {
                    workflowSteps[1] = stepOrderApps.errorText;
                    errors.error = true;
                }

                const stepWithoutIOMapping = values.steps.find(
                    (step, target_step) => {
                        if (!target_step) {
                            // The first step will never have an output mapping.
                            return false;
                        }

                        return !step.task?.inputs?.find(({ output }) => output);
                    }
                );

                if (stepWithoutIOMapping || tooFewSteps) {
                    workflowSteps[2] = stepIOMapping.errorText;
                    errors.error = true;
                }

                if (workflowSteps.length > 0) {
                    errors.workflowSteps = workflowSteps;
                }

                return errors;
            }}
            onSubmit={(values, actions) => {
                const workflow = formatWorkflowSubmission(values);

                const onSuccess = (workflow) => {
                    if (!values.id) {
                        // A new workflow was saved, so redirect to new URL
                        router.replace(
                            getAppEditPath(workflow.system_id, workflow.id)
                        );
                    }

                    // Note that enableReinitialize should not be used when
                    // using resetForm with new values.
                    actions.resetForm({
                        values: initWorkflowValues(workflow),
                        touched: { workflowSteps: [true, true, true] },
                    });

                    announce({
                        text: t("workflowSaved"),
                        variant: AnnouncerConstants.SUCCESS,
                    });
                };

                const onError = (errorMessage) => {
                    showErrorAnnouncer(t("workflowSaveErr"), errorMessage);
                    actions.setSubmitting(false);
                };

                savePipeline({ workflow, onSuccess, onError });
            }}
        >
            {({
                handleSubmit,
                setTouched,
                setFieldValue,
                isSubmitting,
                dirty,
                touched,
                errors,
                values,
            }) => {
                const saveDisabled = isSubmitting || !dirty || errors.error;
                const stepperLoading =
                    isSubmitting || values.steps?.find((step) => !step.task);
                const hasDeprecatedStep = values.steps?.find(
                    (step) => step.task?.tool?.container?.image?.deprecated
                );

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

                        {hasDeprecatedStep && (
                            <Typography variant="body2" color="error">
                                {t("workflowDeprecatedTasksWarning")}
                            </Typography>
                        )}

                        {stepperLoading ? (
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
                                        loading={stepperLoading}
                                    />
                                )
                            }
                            bottomNavigation={
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
                                        loading={stepperLoading}
                                    />
                                )
                            }
                        >
                            {activeStepInfo === stepAppInfo ? (
                                <WorkflowInfo baseId={baseId} />
                            ) : activeStepInfo === stepOrderApps ? (
                                <AppOrder
                                    baseId={baseId}
                                    steps={values.steps}
                                    setFieldValue={setFieldValue}
                                />
                            ) : activeStepInfo === stepIOMapping ? (
                                <InputOutputMapping
                                    baseId={baseId}
                                    steps={values.steps}
                                />
                            ) : null}
                        </AppStepDisplay>
                    </Paper>
                );
            }}
        </Formik>
    );
};

export default withErrorAnnouncer(WorkflowEditor);
