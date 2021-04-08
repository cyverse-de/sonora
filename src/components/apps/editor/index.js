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
import ParamGroups from "./ParamGroups";
import ParametersPreview from "./ParametersPreview";

import AppStepper, { StepperSkeleton } from "../AppStepper";
import AppStepDisplay, { BottomNavigationSkeleton } from "../AppStepDisplay";

import { getAppEditPath } from "../utils";

import BackButton from "components/utils/BackButton";
import ComingSoonInfo from "components/utils/ComingSoonInfo";
import SaveButton from "components/utils/SaveButton";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";

import useComponentHeight from "components/utils/useComponentHeight";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { addApp, updateApp } from "serviceFacades/apps";

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
    const {
        baseId,
        backDisabled,
        nextDisabled,
        handleBack,
        handleNext,
    } = props;

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

const AppEditor = (props) => {
    const {
        baseId,
        appDescription,
        cosmeticOnly,
        loading,
        loadingError,
        showErrorAnnouncer,
    } = props;

    const [activeStep, setActiveStep] = React.useState(0);

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

    const [saveApp] = useMutation(
        ({ app }) => {
            const { system_id: systemId, id: appId } = app;

            return appId
                ? updateApp({ systemId, appId, app })
                : addApp({ systemId, app });
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

    return loading ? (
        <AppStepperFormSkeleton baseId={baseId} header />
    ) : loadingError ? (
        <WrappedErrorHandler baseId={baseId} errorObject={loadingError} />
    ) : cosmeticOnly ? (
        <ComingSoonInfo>{t("publicAppEditingNotSupported")}</ComingSoonInfo>
    ) : (
        <Formik
            initialValues={initAppValues(appDescription)}
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
                const app = formatSubmission(values);

                const onSuccess = (app) => {
                    if (!values.id) {
                        // A new app was saved, so update address to new URL
                        router.replace(getAppEditPath(app.system_id, app.id));
                    }

                    // Note that enableReinitialize should not be used when
                    // using resetForm with new values.
                    actions.resetForm({ values: initAppValues(app) });

                    announce({
                        text: t("appSaved"),
                        variant: AnnouncerConstants.SUCCESS,
                    });
                };

                const onError = (errorMessage) => {
                    showErrorAnnouncer(t("appSaveErr"), errorMessage);
                    actions.setSubmitting(false);
                };

                saveApp({ app, onSuccess, onError });
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
                    <Paper className={classes.formContainer}>
                        <Grid
                            ref={scrollOnEditEl}
                            container
                            justify="space-between"
                            alignItems="flex-start"
                            wrap="nowrap"
                        >
                            <BackButton />
                            <Typography variant="h6">
                                {t(values.id ? "editApp" : "createApp", {
                                    name: values.name,
                                })}
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
                                <AppInfo baseId={baseId} />
                            ) : activeStepInfo === stepParameters ? (
                                <ParamGroups
                                    baseId={baseId}
                                    values={values}
                                    keyCount={keyCount}
                                    setKeyCount={setKeyCount}
                                    scrollOnEdit={scrollOnEdit}
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

export default withErrorAnnouncer(AppEditor);
