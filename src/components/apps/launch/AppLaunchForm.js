/**
 * @author psarando
 *
 * The App Launch form for collecting analysis info, resource requirements,
 * and app parameter values. Also performs form validation and builds the final
 * config for the analyses submission endpoint, or for saving as a Quick Launch.
 */
import React from "react";

import { Formik, Form } from "formik";
import { injectIntl } from "react-intl";

import GlobalConstants from "../../../constants";

import CreateQuickLaunchDialog from "../quickLaunch/CreateQuickLaunchDialog";

import constants from "./constants";
import ids from "./ids";
import messages from "./messages";
import styles from "./styles";
import validate from "./validate";

import AnalysisInfoForm from "./AnalysisInfoForm";
import {
    StepperSkeleton,
    BottomNavigationSkeleton,
} from "./AppLaunchFormSkeleton";
import { ParamGroupForm, ParamsReview } from "./ParamGroups";
import {
    ResourceRequirementsForm,
    ResourceRequirementsReview,
} from "./ResourceRequirements";

import { getReferenceGenomes } from "../../../serviceFacades/referenceGenomes";

import {
    build as buildDebugId,
    getMessage,
    formatMessage,
    stableSort,
    getFormError,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    Container,
    BottomNavigation,
    BottomNavigationAction,
    Hidden,
    Stepper,
    Step,
    StepButton,
    StepLabel,
    Typography,
    makeStyles,
} from "@material-ui/core";

import { ArrowBack, ArrowForward, PlayArrow, Save } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const ReferenceGenomeParamTypes = [
    constants.PARAM_TYPE.REFERENCE_GENOME,
    constants.PARAM_TYPE.REFERENCE_SEQUENCE,
    constants.PARAM_TYPE.REFERENCE_ANNOTATION,
];

const StepContent = ({ id, hidden, step, label, children }) => (
    <fieldset id={id} hidden={hidden}>
        <legend>
            <Typography variant="caption">
                {getMessage("stepLabel", { values: { step: step + 1, label } })}
            </Typography>
        </legend>
        {children}
    </fieldset>
);

const StepperBottomNavigation = ({
    formId,
    showSaveQuickLaunchButton,
    showSubmitButton,
    handleBack,
    handleNext,
    handleSaveQuickLaunch,
    handleSubmit,
}) => (
    <BottomNavigation
        showLabels
        value={showSubmitButton ? "submit" : "next"}
        onChange={(event, value) => {
            switch (value) {
                case "submit":
                    handleSubmit(event);
                    break;
                case "saveQL":
                    handleSaveQuickLaunch();
                    break;
                case "next":
                    handleNext();
                    break;
                default:
                    handleBack();
                    break;
            }
        }}
    >
        <BottomNavigationAction
            id={buildDebugId(formId, ids.BUTTONS.STEP_BACK)}
            label={getMessage("back")}
            value="back"
            icon={<ArrowBack />}
        />
        {showSaveQuickLaunchButton ? (
            <BottomNavigationAction
                id={buildDebugId(formId, ids.BUTTONS.SAVE_AS_QUICK_LAUNCH)}
                label={getMessage("saveAsQuickLaunch")}
                value="saveQL"
                icon={<Save />}
            />
        ) : (
            <BottomNavigationAction disabled={true} />
        )}
        {showSubmitButton ? (
            <BottomNavigationAction
                id={buildDebugId(formId, ids.BUTTONS.SUBMIT)}
                label={getMessage("launchAnalysis")}
                value="submit"
                icon={<PlayArrow />}
            />
        ) : (
            <BottomNavigationAction
                id={buildDebugId(formId, ids.BUTTONS.STEP_NEXT)}
                label={getMessage("next")}
                value="next"
                icon={<ArrowForward />}
            />
        )}
    </BottomNavigation>
);

/**
 * @param {string} name - The app name.
 * @returns {string} - Formatted app name as a new analysis name,
 * replacing spaces with underscores `_`.
 */
const formatAnalysisName = (intl, name) =>
    name
        ? formatMessage(intl, "newAnalysisName", { appName: name }).replace(
              / /g,
              "_"
          )
        : "";

/**
 * Initializes the submission and form values from the given props.
 *
 * Will initialize a `value` field in each app parameter,
 * populated by the parameter's `defaultValue` or an empty value.
 *
 * Will also initialize each step's resource requirements from any default
 * requirements provided.
 *
 * @param {Object} props
 * @param {boolean} props.notify
 * @param {string} props.defaultOutputDir
 * @param {Object} props.app
 * @param {string} props.app.id
 * @param {string} props.app.system_id
 * @param {string} props.app.name
 * @param {Object[]} props.app.requirements
 * @param {Object[]} props.app.groups
 *
 * @returns Initial form and submission values.
 */
const initValues = ({
    intl,
    notify,
    defaultOutputDir,
    app: { id, system_id, name, requirements, groups },
}) => {
    const groupInitValues = groups?.map((group) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const {
                arguments: paramArgs,
                defaultValue,
                type: paramType,
            } = param;

            let value = defaultValue || "";

            if (paramType === constants.PARAM_TYPE.MULTIFILE_SELECTOR) {
                value = defaultValue || [];
            }
            if (paramType === constants.PARAM_TYPE.FLAG) {
                value = defaultValue && defaultValue !== "false";
            }
            if (paramArgs?.length > 0) {
                const defaultArg = paramArgs.find(
                    (arg) => arg.isDefault || defaultValue?.id === arg.id
                );
                value = defaultArg || "";
            }

            return {
                ...param,
                value,
            };
        }),
    }));

    const reqInitValues = requirements?.map(
        ({
            step_number,
            default_cpu_cores = 0,
            default_memory = 0,
            default_disk_space = 0,
        }) => ({
            step_number,
            min_cpu_cores: default_cpu_cores,
            min_memory_limit: default_memory,
            min_disk_space: default_disk_space,
        })
    );

    return {
        debug: false,
        notify,
        output_dir: defaultOutputDir,
        name: formatAnalysisName(intl, name),
        description: "",
        app_id: id,
        system_id,
        groups: groupInitValues,
        limits: requirements,
        requirements: reqInitValues || [],
    };
};

/**
 * Formats the analysis submission from props and the form values.
 *
 * @param {string} defaultOutputDir
 * @param {Object} formValues
 * @param {boolean} formValues.notify
 * @param {boolean} formValues.debug
 * @param {string} formValues.name
 * @param {string} formValues.description
 * @param {string} formValues.output_dir
 * @param {string} formValues.system_id
 * @param {string} formValues.app_id
 * @param {Object[]} formValues.requirements
 * @param {Object[]} formValues.groups
 *
 * @returns The formatted submission for launching or saving as a quick launch.
 */
const formatSubmission = (
    defaultOutputDir,
    {
        notify,
        debug,
        name,
        description,
        output_dir,
        system_id,
        app_id,
        requirements,
        groups,
    }
) => ({
    notify,
    debug,
    create_output_subdir: output_dir === defaultOutputDir,
    name: name.trim(),
    description,
    output_dir,
    system_id,
    app_id,
    requirements,
    config: groups?.reduce(paramConfigsReducer, {}),
});

/**
 * Appends the given group's parameter values to the given submission config.
 *
 * @param {Object} configs - Mapping of parameter IDs to parameter values.
 * @param {Object} group
 * @param {Object[]} group.parameters
 *
 * @returns The formatted submission config
 * including the given group's parameter IDs to values.
 */
const paramConfigsReducer = (configs, group) => {
    group.parameters.forEach((param) => {
        const { id, type } = param;

        if (type !== constants.PARAM_TYPE.INFO) {
            let { value } = param;

            switch (type) {
                case constants.PARAM_TYPE.TEXT_SELECTION:
                case constants.PARAM_TYPE.INTEGER_SELECTION:
                case constants.PARAM_TYPE.DOUBLE_SELECTION:
                case constants.PARAM_TYPE.REFERENCE_GENOME:
                case constants.PARAM_TYPE.REFERENCE_SEQUENCE:
                case constants.PARAM_TYPE.REFERENCE_ANNOTATION:
                    if (!value) {
                        return;
                    }
                    break;

                case constants.PARAM_TYPE.FILE_OUTPUT:
                case constants.PARAM_TYPE.FOLDER_OUTPUT:
                case constants.PARAM_TYPE.MULTIFILE_OUTPUT:
                    if (value) {
                        value = value.trim();
                    }
                    break;

                default:
                    break;
            }

            configs[id] = value;
        }
    });

    return configs;
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
    const [activeStep, setActiveStep] = React.useState(0);

    const [referenceGenomes, setReferenceGenomes] = React.useState([]);
    const [
        referenceGenomesLoading,
        setReferenceGenomesLoading,
    ] = React.useState(false);

    const [reviewShowAll, setReviewShowAll] = React.useState(true);

    const [quickLaunchDialogOpen, setQuickLaunchDialogOpen] = React.useState(
        false
    );
    const [quickLaunchSubmission, setQuickLaunchSubmission] = React.useState(
        null
    );

    const classes = useStyles();

    const {
        baseId,
        defaultMaxCPUCores,
        defaultMaxMemory,
        defaultMaxDiskSpace,
        defaultOutputDir,
        saveQuickLaunch,
        startingPath,
        submitAnalysis,
        intl,
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

    const hasReferenceGenomes =
        hasParams &&
        groups?.find((group) =>
            group.parameters?.find((param) =>
                ReferenceGenomeParamTypes.includes(param.type)
            )
        );

    React.useEffect(() => {
        let unmounted = false;

        if (hasReferenceGenomes) {
            setReferenceGenomesLoading(true);
            getReferenceGenomes()
                .then((resp) => {
                    if (!unmounted) {
                        const genomes = resp?.genomes || [];
                        setReferenceGenomes(
                            stableSort(genomes, (a, b) =>
                                a.name.localeCompare(b.name)
                            )
                        );
                        setReferenceGenomesLoading(false);
                    }
                })
                .catch((error) => {
                    error?.isAxiosError
                        ? console.error(
                              error.response.status,
                              error.response.data
                          )
                        : console.error(error);
                    setReferenceGenomesLoading(false);
                });
        }

        return () => {
            unmounted = true;
        };
    }, [props.app, hasReferenceGenomes]);

    const hasAdvancedStep = requirements?.length > 0;

    const stepAnalysisInfo = {
        label: formatMessage(intl, "analysisInfo"),
        step: 0,
    };
    const stepParameters = {
        label: formatMessage(intl, "parameters"),
        step: 1,
    };
    const stepAdvanced = {
        label: formatMessage(intl, "advancedSettings"),
        step: 2,
    };
    const stepReviewAndLaunch = {
        label: formatMessage(intl, "reviewAndLaunch"),
        step: 3,
    };

    const steps = [stepAnalysisInfo];

    if (hasParams) {
        steps.push(stepParameters);
    } else {
        stepAdvanced.step--;
        stepReviewAndLaunch.step--;
    }

    if (hasAdvancedStep) {
        steps.push(stepAdvanced);
    } else {
        stepReviewAndLaunch.step--;
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

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initValues(props)}
                validate={validate}
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
                            <StepperSkeleton baseId={formId} />
                        ) : (
                            <Stepper
                                alternativeLabel
                                nonLinear
                                activeStep={activeStep}
                            >
                                {steps.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepButton
                                            id={buildDebugId(
                                                formId,
                                                ids.BUTTONS.STEP,
                                                index + 1
                                            )}
                                            onClick={handleStep(index)}
                                        >
                                            <StepLabel
                                                error={
                                                    !!displayStepError(
                                                        index,
                                                        errors,
                                                        touched,
                                                        groups
                                                    )
                                                }
                                            >
                                                <Hidden xsDown>
                                                    {step.label}
                                                </Hidden>
                                            </StepLabel>
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>
                        )}
                        <Container
                            component="div"
                            className={classes.stepContent}
                            maxWidth="md"
                        >
                            <StepContent
                                id={buildDebugId(
                                    formId,
                                    ids.LAUNCH_ANALYSIS_GROUP
                                )}
                                step={stepAnalysisInfo.step}
                                label={getMessage("analysisInfo")}
                                hidden={activeStep !== stepAnalysisInfo.step}
                            >
                                <AnalysisInfoForm
                                    formId={formId}
                                    appType={app_type}
                                    startingPath={startingPath}
                                />
                            </StepContent>

                            <StepContent
                                id={stepIdParams}
                                step={stepParameters.step}
                                label={getMessage("analysisParameters")}
                                hidden={
                                    !hasParams ||
                                    activeStep !== stepParameters.step
                                }
                            >
                                {values.groups?.map((group, index) => (
                                    <ParamGroupForm
                                        key={group.id}
                                        baseId={buildDebugId(
                                            stepIdParams,
                                            index + 1
                                        )}
                                        fieldName={`groups.${index}`}
                                        group={group}
                                        startingPath={startingPath}
                                        referenceGenomes={referenceGenomes}
                                        referenceGenomesLoading={
                                            referenceGenomesLoading
                                        }
                                    />
                                ))}
                            </StepContent>

                            <StepContent
                                id={stepIdResources}
                                step={stepAdvanced.step}
                                label={getMessage("advancedSettings")}
                                hidden={
                                    !hasAdvancedStep ||
                                    activeStep !== stepAdvanced.step
                                }
                            >
                                {values.limits && (
                                    <ResourceRequirementsForm
                                        baseId={stepIdResources}
                                        limits={values.limits}
                                        defaultMaxCPUCores={defaultMaxCPUCores}
                                        defaultMaxMemory={defaultMaxMemory}
                                        defaultMaxDiskSpace={
                                            defaultMaxDiskSpace
                                        }
                                    />
                                )}
                            </StepContent>

                            <StepContent
                                id={stepIdReview}
                                step={stepReviewAndLaunch.step}
                                label={
                                    app_type ===
                                    GlobalConstants.APP_TYPE_EXTERNAL
                                        ? getMessage("reviewAndLaunch")
                                        : getMessage("launchOrSaveAsQL")
                                }
                                hidden={activeStep !== stepReviewAndLaunch.step}
                            >
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
                            </StepContent>
                        </Container>
                        {isSubmitting ? (
                            <BottomNavigationSkeleton />
                        ) : (
                            <StepperBottomNavigation
                                formId={formId}
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
                        )}
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

export default withI18N(injectIntl(AppLaunchForm), messages);
