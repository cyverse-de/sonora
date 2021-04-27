/**
 * @author psarando
 *
 * The App Launch form for collecting analysis info, resource requirements,
 * and app parameter values. Also performs form validation and builds the final
 * config for the analyses submission endpoint, or for saving as a Quick Launch.
 */
import React from "react";

import { Formik, Form } from "formik";
import { useTranslation } from "i18n";

import useComponentHeight from "components/utils/useComponentHeight";

import GlobalConstants from "../../../constants";

import AppStepper, { StepperSkeleton } from "../AppStepper";
import AppStepDisplay, { BottomNavigationSkeleton } from "../AppStepDisplay";

import CreateQuickLaunchDialog from "../quickLaunch/CreateQuickLaunchDialog";

import { formatSubmission, initAppLaunchValues } from "./formatters";
import ids from "./ids";
import validate from "./validate";

import AnalysisInfoForm from "./AnalysisInfoForm";
import { ParamGroupForm, ParamsReview } from "./ParamGroups";
import {
    ResourceRequirementsForm,
    ResourceRequirementsReview,
} from "./ResourceRequirements";

import { build as buildDebugId, getFormError } from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import { ArrowBack, ArrowForward, PlayArrow, Save } from "@material-ui/icons";

const StepperNavigation = (props) => {
    const {
        formId,
        backDisabled,
        nextDisabled,
        showBackButton = true,
        showNextButton = true,
        showSaveQuickLaunchButton,
        showSubmitButton,
        handleBack,
        handleNext,
        handleSaveQuickLaunch,
        handleSubmit,
    } = props;

    const theme = useTheme();
    const { t } = useTranslation("launch");
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    return (
        <ButtonGroup
            fullWidth
            orientation={isMobile ? "vertical" : "horizontal"}
            variant="contained"
            color="primary"
            size={isMobile ? "small" : "large"}
        >
            {showBackButton && (
                <Button
                    id={buildDebugId(formId, ids.BUTTONS.STEP_BACK)}
                    disabled={backDisabled}
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    {t("back")}
                </Button>
            )}
            {showSaveQuickLaunchButton && (
                <Button
                    id={buildDebugId(formId, ids.BUTTONS.SAVE_AS_QUICK_LAUNCH)}
                    startIcon={<Save />}
                    onClick={handleSaveQuickLaunch}
                >
                    {t("saveAsQuickLaunch")}
                </Button>
            )}
            {showSubmitButton && (
                <Button
                    id={buildDebugId(formId, ids.BUTTONS.SUBMIT)}
                    startIcon={<PlayArrow />}
                    onClick={(event) => handleSubmit(event)}
                >
                    {t("launchAnalysis")}
                </Button>
            )}
            {showNextButton && (
                <Button
                    id={buildDebugId(formId, ids.BUTTONS.STEP_NEXT)}
                    disabled={nextDisabled}
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                >
                    {t("next")}
                </Button>
            )}
        </ButtonGroup>
    );
};

const displayStepError = (stepIndex, errors, touched, groups) => {
    if (stepIndex === 0) {
        return (
            getFormError("name", touched, errors) ||
            getFormError("output_dir", touched, errors)
        );
    }

    if (stepIndex === 1) {
        return anyParamErrorAndTouched(errors, touched, groups);
    }

    return false;
};

/**
 * For determining if the parameters step should display a validation error.
 *
 * @returns {boolean} True if any parameter was touched
 * and has validation errors.
 */
const anyParamErrorAndTouched = (errors, touched, groups) =>
    groups?.find((group, groupIndex) =>
        group.parameters.find((param, paramIndex) =>
            getFormError(
                `groups.${groupIndex}.parameters.${paramIndex}`,
                touched,
                errors
            )
        )
    );

const AppLaunchForm = (props) => {
    const { t } = useTranslation(["launch", "data"]);
    const [activeStep, setActiveStep] = React.useState(0);

    const [reviewShowAll, setReviewShowAll] = React.useState(true);

    const [quickLaunchDialogOpen, setQuickLaunchDialogOpen] = React.useState(
        false
    );
    const [quickLaunchSubmission, setQuickLaunchSubmission] = React.useState(
        null
    );

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const {
        baseId,
        defaultMaxCPUCores,
        defaultMaxMemory,
        defaultMaxDiskSpace,
        defaultOutputDir,
        saveQuickLaunch,
        submitAnalysis,
        app: { id: app_id, name: appName, app_type, groups, requirements },
    } = props;

    const formId = buildDebugId(baseId, ids.APP_LAUNCH_FORM);
    const stepIdParams = buildDebugId(formId, ids.TEMPLATE_GROUP);
    const stepIdResources = buildDebugId(
        formId,
        ids.APP_LAUNCH_RESOURCE_REQUESTS
    );
    const stepIdReview = buildDebugId(formId, ids.APP_LAUNCH_REVIEW);

    const hasParams = groups?.find((group) => group.parameters?.length > 0);

    const stepperRef = React.useRef(null);
    const [stepperHeight, setStepperRef] = useComponentHeight();

    React.useEffect(() => {
        setStepperRef(stepperRef);
    }, [stepperRef, setStepperRef]);

    const hasAdvancedStep = requirements?.length > 0;

    const stepAnalysisInfo = {
        label: t("analysisInfo"),
        contentLabel: t("analysisInfo"),
    };
    const stepParameters = {
        label: t("parameters"),
        contentLabel: t("analysisParameters"),
    };
    const stepAdvanced = {
        label: t("advancedSettings"),
        contentLabel: t("advancedSettings"),
    };
    const stepReviewAndLaunch = {
        label: t("reviewAndLaunch"),
        contentLabel:
            app_type === GlobalConstants.APP_TYPE_EXTERNAL
                ? t("reviewAndLaunch")
                : t("launchOrSaveAsQL"),
    };

    const steps = [stepAnalysisInfo];

    if (hasParams) {
        steps.push(stepParameters);
    }

    if (hasAdvancedStep) {
        steps.push(stepAdvanced);
    }

    steps.push(stepReviewAndLaunch);

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

    const handleSaveQuickLaunch = (quickLaunch, onSuccess, onError) => {
        saveQuickLaunch(
            quickLaunch,
            () => {
                onSuccess();
                setQuickLaunchDialogOpen(false);
                setQuickLaunchSubmission(null);
            },
            onError
        );
    };

    const activeStepInfo = steps[activeStep];

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initAppLaunchValues(t, props)}
                validate={validate(t)}
                onSubmit={(values, { setSubmitting }) => {
                    submitAnalysis(
                        formatSubmission(defaultOutputDir, values),
                        () => setSubmitting(false),
                        (errorMsg) => setSubmitting(false)
                    );
                }}
            >
                {({ values, errors, touched, handleSubmit, isSubmitting }) => (
                    <Form id={formId}>
                        {isSubmitting ? (
                            <StepperSkeleton baseId={formId} ref={stepperRef} />
                        ) : (
                            <AppStepper
                                baseId={formId}
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
                                        touched,
                                        groups
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
                                !isSubmitting && (
                                    <StepperNavigation
                                        formId={formId}
                                        backDisabled={!activeStep}
                                        nextDisabled={isLastStep()}
                                        showBackButton={!isMobile}
                                        showNextButton={!isMobile}
                                        showSubmitButton={false}
                                        showSaveQuickLaunchButton={false}
                                        handleBack={handleBack}
                                        handleNext={handleNext}
                                    />
                                )
                            }
                            bottomNavigation={
                                isSubmitting ? (
                                    <BottomNavigationSkeleton />
                                ) : (
                                    <StepperNavigation
                                        formId={formId}
                                        backDisabled={!activeStep}
                                        showBackButton={!isMobile}
                                        showNextButton={
                                            !(isMobile || isLastStep())
                                        }
                                        showSubmitButton={isLastStep()}
                                        showSaveQuickLaunchButton={
                                            isLastStep() &&
                                            app_type !==
                                                GlobalConstants.APP_TYPE_EXTERNAL
                                        }
                                        handleBack={handleBack}
                                        handleNext={handleNext}
                                        handleSubmit={handleSubmit}
                                        handleSaveQuickLaunch={() => {
                                            setQuickLaunchDialogOpen(true);
                                            setQuickLaunchSubmission(
                                                formatSubmission(
                                                    defaultOutputDir,
                                                    values
                                                )
                                            );
                                        }}
                                    />
                                )
                            }
                        >
                            {activeStepInfo === stepAnalysisInfo ? (
                                <AnalysisInfoForm
                                    formId={formId}
                                    appType={app_type}
                                />
                            ) : activeStepInfo === stepParameters ? (
                                values.groups?.map((group, index) => (
                                    <ParamGroupForm
                                        key={group.id}
                                        index={index + 1}
                                        noOfGroups={groups.length}
                                        baseId={buildDebugId(
                                            stepIdParams,
                                            index + 1
                                        )}
                                        fieldName={`groups.${index}`}
                                        group={group}
                                    />
                                ))
                            ) : activeStepInfo === stepAdvanced ? (
                                values.limits && (
                                    <ResourceRequirementsForm
                                        baseId={stepIdResources}
                                        limits={values.limits}
                                        defaultMaxCPUCores={defaultMaxCPUCores}
                                        defaultMaxMemory={defaultMaxMemory}
                                        defaultMaxDiskSpace={
                                            defaultMaxDiskSpace
                                        }
                                    />
                                )
                            ) : activeStepInfo === stepReviewAndLaunch ? (
                                <>
                                    <ParamsReview
                                        baseId={formId}
                                        appType={app_type}
                                        groups={values.groups}
                                        errors={errors}
                                        touched={touched}
                                        showAll={reviewShowAll}
                                        setShowAll={setReviewShowAll}
                                    />

                                    {values.requirements && (
                                        <ResourceRequirementsReview
                                            baseId={stepIdReview}
                                            requirements={values.requirements}
                                            showAll={reviewShowAll}
                                        />
                                    )}
                                </>
                            ) : null}
                        </AppStepDisplay>
                    </Form>
                )}
            </Formik>

            <CreateQuickLaunchDialog
                appName={appName}
                dialogOpen={quickLaunchDialogOpen}
                onHide={() => {
                    setQuickLaunchDialogOpen(false);
                    setQuickLaunchSubmission(null);
                }}
                createQuickLaunch={(
                    name,
                    description,
                    is_public,
                    onSuccess,
                    onError
                ) => {
                    handleSaveQuickLaunch(
                        {
                            name,
                            description,
                            is_public,
                            app_id,
                            submission: quickLaunchSubmission,
                        },
                        onSuccess,
                        onError
                    );
                }}
            />
        </>
    );
};

export default AppLaunchForm;
