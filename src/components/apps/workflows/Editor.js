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
import CompletionHelp from "./CompletionHelp";
import WorkflowInfo from "./WorkflowInfo";

import ids from "./ids";
import styles from "../commonStyles";

import { formatWorkflowSubmission, initWorkflowValues } from "./formatters";

import AppStepper, { StepperSkeleton } from "../AppStepper";
import AppStepperFormSkeleton from "../AppStepperFormSkeleton";
import AppStepDisplay, {
    BottomNavigationSkeleton as StepperNavSkeleton,
} from "../AppStepDisplay";

import VersionSelection from "components/apps/VersionSelection";
import { getAppEditPath, getAppLaunchPath } from "components/apps/utils";

import BackButton from "components/utils/BackButton";
import SaveButton from "components/utils/SaveButton";
import useComponentHeight from "components/utils/useComponentHeight";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import {
    addPipeline,
    addPipelineVersion,
    updatePipeline,
} from "serviceFacades/pipelines";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";
import buildID from "components/utils/DebugIDUtil";
import getFormError from "components/forms/getFormError";

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

import {
    ArrowBack,
    ArrowForward,
    ExitToApp,
    PlayArrow,
} from "@material-ui/icons";

const useStyles = makeStyles(styles);

const StepperNavigation = (props) => {
    const {
        baseId,
        backDisabled,
        nextDisabled,
        handleBack,
        handleNext,
        dirty,
        loading,
        showLastStepActions,
        onSaveAndExit,
        onSaveAndLaunch,
        onExit,
        onLaunch,
    } = props;

    const { t } = useTranslation(["workflows", "common"]);

    return loading ? (
        <StepperNavSkeleton />
    ) : (
        <ButtonGroup fullWidth color="primary">
            <Button
                id={buildID(baseId, ids.BUTTONS.BACK)}
                disabled={backDisabled}
                startIcon={<ArrowBack />}
                onClick={handleBack}
            >
                {t("common:back")}
            </Button>
            {dirty && showLastStepActions && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.BACK)}
                    variant="contained"
                    startIcon={<ExitToApp />}
                    onClick={onSaveAndExit}
                >
                    {t("saveAndExit")}
                </Button>
            )}
            {dirty && showLastStepActions && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.LAUNCH_BTN)}
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={onSaveAndLaunch}
                >
                    {t("saveAndLaunch")}
                </Button>
            )}
            {!dirty && showLastStepActions && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.BACK)}
                    variant="contained"
                    startIcon={<ExitToApp />}
                    onClick={onExit}
                >
                    {t("exitEditor")}
                </Button>
            )}
            {!dirty && showLastStepActions && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.LAUNCH_BTN)}
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={onLaunch}
                >
                    {t("launchWorkflow")}
                </Button>
            )}
            {!showLastStepActions && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.NEXT)}
                    disabled={nextDisabled}
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                >
                    {t("common:next")}
                </Button>
            )}
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
    const [exitOnSave, setExitOnSave] = React.useState(false);
    const [launchOnSave, setLaunchOnSave] = React.useState(false);

    const stepperRef = React.useRef(null);
    const [stepperHeight, setStepperRef] = useComponentHeight();

    React.useEffect(() => {
        setStepperRef(stepperRef);
    }, [stepperRef, setStepperRef]);

    const { t } = useTranslation(["workflows", "app_editor", "common"]);
    const classes = useStyles();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const onExit = () => router.back();

    const onLaunch = (workflow) =>
        workflow.id &&
        router.push(getAppLaunchPath(workflow.system_id, workflow.id));

    const onRedirectToEditPage = (workflow) =>
        workflow.id &&
        router.replace(
            getAppEditPath(workflow.system_id, workflow.id, workflow.version_id)
        );

    const { mutate: savePipeline } = useMutation(
        ({ workflow }) => {
            const { id: appId, version_id: versionId } = workflow;
            const request = { appId, versionId, workflow };

            return appId
                ? versionId
                    ? updatePipeline(request)
                    : addPipelineVersion(request)
                : addPipeline(request);
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
    const stepCompletion = {
        label: t("completionStepLabel"),
        contentLabel: t("completionStepLabel"),
        helpText: t("stepHelpCompletion"),
        errorText: null,
    };

    const workflowSteps = [
        stepAppInfo,
        stepOrderApps,
        stepIOMapping,
        stepCompletion,
    ];

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
            initialTouched={{ workflowSteps: [false, false, false, false] }}
            validate={(values) => {
                const errors = {};
                const workflowSteps = [];

                ["name", "description", "version"].forEach((fieldName) => {
                    if (!values[fieldName]) {
                        workflowSteps[0] = true;
                        errors.error = true;
                        errors[fieldName] = t("common:required");
                    }
                });

                if (
                    appDescription.versions?.find(
                        (versionInfo) =>
                            versionInfo.version === values.version &&
                            versionInfo.version_id !== values.version_id
                    )
                ) {
                    workflowSteps[0] = true;
                    errors.error = true;
                    errors.version = t("app_editor:versionDuplicateLabelError");
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
                    if (exitOnSave) {
                        onExit();
                    } else if (launchOnSave) {
                        onLaunch(workflow);
                    } else if (!values.id || !values.version_id) {
                        // A new workflow was saved, so redirect to new URL
                        onRedirectToEditPage(workflow);
                    }

                    // Note that enableReinitialize should not be used when
                    // using resetForm with new values.
                    actions.resetForm({
                        values: initWorkflowValues(workflow),
                        touched: { workflowSteps: [true, true, true, true] },
                    });

                    announce({
                        text: t("workflowSaved"),
                        variant: SUCCESS,
                    });

                    setExitOnSave(false);
                    setLaunchOnSave(false);
                };

                const onError = (errorMessage) => {
                    showErrorAnnouncer(t("workflowSaveErr"), errorMessage);

                    actions.setSubmitting(false);
                    setExitOnSave(false);
                    setLaunchOnSave(false);
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
                const hasErrors = errors.error;
                const saveDisabled = isSubmitting || !dirty || hasErrors;
                const stepperLoading =
                    isSubmitting || values.steps?.find((step) => !step.task);
                const hasDeprecatedStep = values.steps?.find(
                    (step) => step.task?.tool?.container?.image?.deprecated
                );

                const stepCompleted = (stepIndex) => {
                    const stepTouched = touched.workflowSteps[stepIndex];

                    // special check for final step
                    if (stepIndex === workflowSteps.length - 1) {
                        return stepTouched && !hasErrors && !dirty;
                    }

                    return (
                        stepTouched &&
                        !(
                            errors.workflowSteps &&
                            errors.workflowSteps[stepIndex]
                        )
                    );
                };

                const displayStepError = (stepIndex) => {
                    if (stepIndex === 0) {
                        return ["name", "description", "version"].find(
                            (fieldName) =>
                                getFormError(fieldName, touched, errors)
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
                            justifyContent="space-between"
                            alignItems="flex-start"
                            wrap="nowrap"
                        >
                            <BackButton dirty={dirty} />
                            <Grid
                                container
                                direction="column"
                                alignItems="center"
                            >
                                <Typography variant="h6">
                                    {t(
                                        values.id
                                            ? values.version_id
                                                ? "editWorkflow"
                                                : "createWorkflowVersion"
                                            : "createWorkflow",
                                        {
                                            name: values.name,
                                        }
                                    )}
                                </Typography>
                                {values.version_id && (
                                    <VersionSelection
                                        baseId={baseId}
                                        version_id={values.version_id}
                                        versions={values.versions}
                                        dirty={dirty}
                                        onChange={(versionId) =>
                                            router.push(
                                                getAppEditPath(
                                                    appDescription.system_id,
                                                    appDescription.id,
                                                    versionId
                                                )
                                            )
                                        }
                                    />
                                )}
                            </Grid>
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
                                        dirty={dirty}
                                        showLastStepActions={
                                            isLastStep() && !hasErrors
                                        }
                                        onExit={onExit}
                                        onLaunch={() => onLaunch(values)}
                                        onSaveAndExit={(event) => {
                                            setExitOnSave(true);
                                            handleSubmit(event);
                                        }}
                                        onSaveAndLaunch={(event) => {
                                            setLaunchOnSave(true);
                                            handleSubmit(event);
                                        }}
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
                            ) : activeStepInfo === stepCompletion ? (
                                <CompletionHelp
                                    dirty={dirty}
                                    hasErrors={hasErrors}
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
