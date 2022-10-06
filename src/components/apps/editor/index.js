/**
 * A component for creating and editing Apps.
 *
 * @author psarando
 */
import React from "react";

import { Formik } from "formik";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

import { useTranslation } from "i18n";

import { formatSubmission, initAppValues } from "./formatters";
import ids from "./ids";
import styles from "./styles";

import AppInfo from "./AppInfo";
import AppStepperFormSkeleton from "../AppStepperFormSkeleton";
import CmdLineOrderForm from "./CmdLineOrderForm";
import CompletionHelp from "./CompletionHelp";
import GroupPropertyForm from "./GroupPropertyForm";
import ParametersPreview from "./ParametersPreview";
import ParamGroups from "./ParamGroups";
import ParamPropertyForm from "./ParamPropertyForm";

import AppStepper, { StepperSkeleton } from "../AppStepper";
import AppStepDisplay, { BottomNavigationSkeleton } from "../AppStepDisplay";

import { getAppEditPath, getAppLaunchPath } from "../utils";

import VersionSelection from "components/apps/VersionSelection";

import BackButton from "components/utils/BackButton";
import SaveButton from "components/utils/SaveButton";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";

import useComponentHeight from "components/utils/useComponentHeight";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import {
    addApp,
    addAppVersion,
    updateApp,
    updateAppLabels,
} from "serviceFacades/apps";

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

const displayStepError = (stepIndex, errors, touched) => {
    if (stepIndex === 0) {
        return ["name", "description", "version"].find((fieldName) =>
            getFormError(fieldName, touched, errors)
        );
    }

    return false;
};

const StepperNavigation = (props) => {
    const {
        baseId,
        backDisabled,
        nextDisabled,
        handleBack,
        handleNext,
        dirty,
        hasTool,
        showLastStepActions,
        onExit,
        onLaunch,
        onSaveAndExit,
        onSaveAndLaunch,
    } = props;

    const { t } = useTranslation(["app_editor", "common"]);

    const showSaveAndExit = showLastStepActions && dirty;
    const showSaveAndLaunch = showLastStepActions && dirty && hasTool;
    const showExit = showLastStepActions && !dirty;
    const showLaunch = showLastStepActions && !dirty && hasTool;

    const showNext = !(
        showSaveAndExit ||
        showSaveAndLaunch ||
        showExit ||
        showLaunch
    );

    return (
        <ButtonGroup fullWidth color="primary">
            <Button
                id={buildID(baseId, ids.BUTTONS.BACK)}
                disabled={backDisabled}
                startIcon={<ArrowBack />}
                onClick={handleBack}
            >
                {t("common:back")}
            </Button>
            {showSaveAndExit && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.BACK)}
                    variant="contained"
                    startIcon={<ExitToApp />}
                    onClick={onSaveAndExit}
                >
                    {t("saveAndExit")}
                </Button>
            )}
            {showSaveAndLaunch && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.LAUNCH_BTN)}
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={onSaveAndLaunch}
                >
                    {t("saveAndLaunch")}
                </Button>
            )}
            {showExit && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.BACK)}
                    variant="contained"
                    startIcon={<ExitToApp />}
                    onClick={onExit}
                >
                    {t("exitEditor")}
                </Button>
            )}
            {showLaunch && (
                <Button
                    id={buildID(baseId, ids.BUTTONS.LAUNCH_BTN)}
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={onLaunch}
                >
                    {t("launchApp")}
                </Button>
            )}
            {showNext && (
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

const AppEditor = (props) => {
    const {
        baseId,
        appDescription,
        cosmeticOnly,
        isPublic,
        loading,
        loadingError,
        showErrorAnnouncer,
    } = props;

    const [activeStep, setActiveStep] = React.useState(0);
    const [exitOnSave, setExitOnSave] = React.useState(false);
    const [launchOnSave, setLaunchOnSave] = React.useState(false);
    const [editGroupField, setEditGroupField] = React.useState();
    const [editParamField, setEditParamField] = React.useState();
    const [scrollToField, setScrollToField] = React.useState();

    // Keeps track of the next available globally unique
    // `key` count for groups and parameters.
    // Required so React doesn't mix up elements when groups are rearranged.
    const [keyCount, setKeyCount] = React.useState(0);

    React.useEffect(() => {
        const groups = appDescription?.groups;
        if (groups?.length > 0) {
            setKeyCount(
                groups.reduce(
                    (count, group) => count + (group.parameters?.length || 0),
                    groups.length
                )
            );
        }
    }, [appDescription]);

    const stepperRef = React.useRef(null);
    const [stepperHeight, setStepperRef] = useComponentHeight();

    React.useEffect(() => {
        setStepperRef(stepperRef);
    }, [stepperRef, setStepperRef]);

    const scrollOnEditEl = React.useRef();
    const scrollOnEdit = React.useCallback(() => {
        if (scrollOnEditEl) {
            scrollOnEditEl.current.scrollIntoView();
        }
    }, [scrollOnEditEl]);

    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);
    const classes = useStyles();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const onExit = () => router.back();

    const onLaunch = (app) =>
        app.id &&
        router.push(getAppLaunchPath(app.system_id, app.id, app.version_id));

    const onRedirectToEditPage = (app) =>
        app.id &&
        router.replace(getAppEditPath(app.system_id, app.id, app.version_id));

    const { mutate: saveApp } = useMutation(
        ({ app }) => {
            const {
                system_id: systemId,
                id: appId,
                version_id: versionId,
            } = app;

            const request = { systemId, appId, versionId, app };

            return appId
                ? versionId
                    ? cosmeticOnly
                        ? updateAppLabels(request)
                        : updateApp(request)
                    : addAppVersion(request)
                : addApp(request);
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
        label: t("appInfo"),
        contentLabel: t("appInfo"),
        helpText: t("app_editor_help:StepHelpInfo"),
        errorText: t("app_editor_help:StepErrorInfo"),
    };
    const stepParameters = {
        label: t("parameters"),
        contentLabel: t("appParameters"),
        helpText: null,
        errorText: null,
    };
    const stepPreview = {
        label: t("previewApp"),
        contentLabel: t("previewApp"),
        helpText: null,
        errorText: null,
    };
    const stepCmdLineOrder = {
        label: t("commandLineOrder"),
        contentLabel: t("commandLineOrder"),
        helpText: null,
        errorText: null,
    };
    const stepCompletion = {
        label: t("completionStepLabel"),
        contentLabel: t("completionStepLabel"),
        helpText: t("stepHelpCompletion"),
        errorText: null,
    };

    const steps = [stepAppInfo, stepParameters, stepPreview];

    if (!cosmeticOnly) {
        steps.push(stepCmdLineOrder);
    }

    steps.push(stepCompletion);

    const activeStepInfo = steps[activeStep];

    return loading ? (
        <AppStepperFormSkeleton baseId={baseId} header />
    ) : loadingError ? (
        <WrappedErrorHandler baseId={baseId} errorObject={loadingError} />
    ) : (
        <Formik
            initialValues={initAppValues(appDescription)}
            initialTouched={{
                editorSteps: [false, false, false, false, false],
            }}
            validate={(values) => {
                const errors = {};
                const editorStepErrors = [];

                ["name", "description", "version"].forEach((fieldName) => {
                    if (!values[fieldName]) {
                        errors.error = true;
                        errors[fieldName] = t("common:required");
                        editorStepErrors[0] = true;
                    }
                });

                if (
                    appDescription.versions?.find(
                        (versionInfo) =>
                            versionInfo.version === values.version &&
                            versionInfo.version_id !== values.version_id
                    )
                ) {
                    errors.error = true;
                    errors.version = t("versionDuplicateLabelError");
                    editorStepErrors[0] = true;
                }

                if (editorStepErrors.length > 0) {
                    errors.editorSteps = editorStepErrors;
                }

                return errors;
            }}
            onSubmit={(values, actions) => {
                const app = formatSubmission(values);

                const onSuccess = (app) => {
                    if (exitOnSave) {
                        onExit();
                    } else if (launchOnSave) {
                        onLaunch(app);
                    } else if (!values.id || !values.version_id) {
                        // A new app was saved, so update address to new URL
                        onRedirectToEditPage(app);
                    }

                    // Note that enableReinitialize should not be used when
                    // using resetForm with new values.
                    actions.resetForm({
                        values: initAppValues(app),
                        touched: {
                            editorSteps: [true, true, true, true, true],
                        },
                    });

                    announce({
                        text: t("appSaved"),
                        variant: SUCCESS,
                    });

                    setExitOnSave(false);
                    setLaunchOnSave(false);
                };

                const onError = (errorMessage) => {
                    showErrorAnnouncer(t("appSaveErr"), errorMessage);

                    actions.setSubmitting(false);
                    setExitOnSave(false);
                    setLaunchOnSave(false);
                };

                saveApp({ app, onSuccess, onError });
            }}
        >
            {({
                handleSubmit,
                isSubmitting,
                setFieldValue,
                setTouched,
                dirty,
                touched,
                errors,
                values,
            }) => {
                const hasTool = values.tools && values.tools[0];
                const hasErrors = errors.error;
                const saveDisabled = isSubmitting || !dirty || hasErrors;

                const stepCompleted = (stepIndex) => {
                    const stepTouched = touched.editorSteps[stepIndex];

                    // special check for final step
                    if (stepIndex === steps.length - 1) {
                        return stepTouched && !hasErrors && !dirty;
                    }

                    return (
                        stepTouched &&
                        !(errors.editorSteps && errors.editorSteps[stepIndex])
                    );
                };

                const handleStepVisited = () => {
                    const editorStepsTouched = [...touched.editorSteps];
                    editorStepsTouched[activeStep] = true;

                    setTouched(
                        { ...touched, editorSteps: editorStepsTouched },
                        true
                    );
                };

                const isLastStep = () => {
                    return activeStep === steps.length - 1;
                };

                const handleNext = () => {
                    const newActiveStep = isLastStep() ? 0 : activeStep + 1;

                    setActiveStep(newActiveStep);
                    handleStepVisited();
                };

                const handleBack = () => {
                    setActiveStep((prevActiveStep) =>
                        activeStep ? prevActiveStep - 1 : steps.length - 1
                    );
                    handleStepVisited();
                };

                const handleStep = (step) => () => {
                    setActiveStep(step);
                    setEditGroupField(null);
                    setEditParamField(null);
                    handleStepVisited();
                };

                const showLastStepActions = isLastStep() && !hasErrors;

                return (
                    <Paper className={classes.formContainer}>
                        <Grid
                            ref={scrollOnEditEl}
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
                                                ? "editApp"
                                                : "createAppVersion"
                                            : "createApp",
                                        { name: values.name }
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

                        {cosmeticOnly && (
                            <>
                                <Typography variant="h6" color="error">
                                    {t("editingPublicApp")}
                                </Typography>
                                <Typography variant="body2">
                                    {t("editPublicAppHelp")}
                                </Typography>
                            </>
                        )}

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
                                stepCompleted={stepCompleted}
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
                            helpText={activeStepInfo.helpText}
                            errorText={
                                displayStepError(activeStep, errors, touched) &&
                                activeStepInfo.errorText
                            }
                            bottomOffset={isMobile && stepperHeight}
                            actions={
                                !isMobile &&
                                !editGroupField &&
                                !editParamField && (
                                    <StepperNavigation
                                        baseId={buildID(
                                            baseId,
                                            ids.BUTTONS.NAV_TOP
                                        )}
                                        backDisabled={!activeStep}
                                        nextDisabled={isLastStep()}
                                        handleBack={handleBack}
                                        handleNext={handleNext}
                                        showLastStepActions={false}
                                    />
                                )
                            }
                            bottomNavigation={
                                isSubmitting ? (
                                    <BottomNavigationSkeleton />
                                ) : (
                                    !isMobile &&
                                    !editGroupField &&
                                    !editParamField && (
                                        <StepperNavigation
                                            baseId={buildID(
                                                baseId,
                                                ids.BUTTONS.NAV_BOTTOM
                                            )}
                                            backDisabled={!activeStep}
                                            nextDisabled={isLastStep()}
                                            handleBack={handleBack}
                                            handleNext={handleNext}
                                            dirty={dirty}
                                            hasTool={hasTool}
                                            showLastStepActions={
                                                showLastStepActions
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
                                )
                            }
                        >
                            {editGroupField ? (
                                <GroupPropertyForm
                                    baseId={baseId}
                                    fieldName={editGroupField}
                                    onDone={() => {
                                        setScrollToField(editGroupField);
                                        setEditGroupField(null);
                                    }}
                                />
                            ) : editParamField ? (
                                <ParamPropertyForm
                                    baseId={buildID(
                                        baseId,
                                        ids.PROPERTY_EDITOR
                                    )}
                                    onClose={() => {
                                        setScrollToField(editParamField);
                                        setEditParamField(null);
                                    }}
                                    fieldName={editParamField}
                                    cosmeticOnly={cosmeticOnly}
                                    keyCount={keyCount}
                                    setKeyCount={setKeyCount}
                                    values={values}
                                />
                            ) : activeStepInfo === stepAppInfo ? (
                                <AppInfo
                                    baseId={baseId}
                                    cosmeticOnly={cosmeticOnly}
                                    isPublic={isPublic}
                                />
                            ) : activeStepInfo === stepParameters ? (
                                <ParamGroups
                                    baseId={baseId}
                                    cosmeticOnly={cosmeticOnly}
                                    values={values}
                                    keyCount={keyCount}
                                    setKeyCount={setKeyCount}
                                    scrollOnEdit={scrollOnEdit}
                                    scrollToField={scrollToField}
                                    setScrollToField={setScrollToField}
                                    setEditGroupField={setEditGroupField}
                                    setEditParamField={setEditParamField}
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
                            ) : activeStepInfo === stepCompletion ? (
                                <CompletionHelp
                                    dirty={dirty}
                                    hasErrors={hasErrors}
                                    hasTool={hasTool}
                                />
                            ) : null}
                        </AppStepDisplay>
                    </Paper>
                );
            }}
        </Formik>
    );
};

export default withErrorAnnouncer(AppEditor);
