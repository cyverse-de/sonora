/**
 * @author psarando
 *
 * An App Launch Wizard for collecting and validating user input of app
 * parameters and resource requirements as an alaysis submission.
 */
import React from "react";

import { Formik, Form } from "formik";
import { injectIntl } from "react-intl";

import constants from "./constants";
import ids from "./ids";
import messages from "./messages";
import validate from "./validate";

import AnalysisInfoForm from "./AnalysisInfoForm";
import { ParamGroupForm, ParamsReview } from "./ParamGroups";

import {
    ResourceRequirementsForm,
    ResourceRequirementsReview,
} from "./ResourceRequirements";

import { getReferenceGenomes } from "../../endpoints/ReferenceGenomes";

import {
    build as buildDebugId,
    getMessage,
    formatMessage,
    stableSort,
    getFormError,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    BottomNavigation,
    BottomNavigationAction,
    Stepper,
    Step,
    StepButton,
    StepLabel,
} from "@material-ui/core";

import { ArrowBack, ArrowForward } from "@material-ui/icons";

const StepContent = ({ id, hidden, step, label, children }) => (
    <fieldset id={id} hidden={hidden}>
        <legend>
            {getMessage("stepLabel", { values: { step: step + 1, label } })}
        </legend>
        {children}
    </fieldset>
);

const formatAnalysisName = (intl, name) =>
    name
        ? formatMessage(intl, "newAnalysisName", { appName: name }).replace(
              / /g,
              "_"
          )
        : "";

const initValues = ({
    intl,
    notify,
    output_dir,
    app: { id, system_id, name, requirements, groups },
}) => {
    const groupInitValues = groups?.map((group) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const { arguments: paramArgs, defaultValue } = param;

            const value =
                paramArgs?.length > 0
                    ? paramArgs.find(
                          (arg) => arg.isDefault || defaultValue?.id === arg.id
                      )
                    : defaultValue || "";

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
        output_dir,
        name: formatAnalysisName(intl, name),
        description: "",
        app_id: id,
        system_id,
        groups: groupInitValues,
        limits: requirements,
        requirements: reqInitValues || [],
    };
};

const formatSubmission = ({
    notify,
    debug,
    name,
    description,
    output_dir,
    system_id,
    app_id,
    requirements,
    groups,
}) => ({
    notify,
    debug,
    name: name.trim(),
    description,
    output_dir,
    system_id,
    app_id,
    requirements,
    config: groups?.reduce(paramConfigsReducer, {}),
});

const paramConfigsReducer = (configs, group) => {
    group.parameters.forEach((param) => {
        const { id, type } = param;

        if (type !== constants.PARAM_TYPE.INFO) {
            let { value } = param;

            switch (type) {
                case constants.PARAM_TYPE.FLAG:
                    value = value && value !== "false";
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

const anyParamErrorAndTouched = (errors, touched, groups) =>
    groups?.reduce(
        (anyErrorAndTouched, group, groupIndex) =>
            anyErrorAndTouched ||
            group.parameters.reduce(
                (groupErrorAndTouched, param, paramIndex) => {
                    const fieldName = `groups.${groupIndex}.parameters.${paramIndex}`;

                    return (
                        groupErrorAndTouched ||
                        getFormError(fieldName, touched, errors)
                    );
                },
                false
            ),
        false
    );

const AppLaunchWizard = (props) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [referenceGenomes, setReferenceGenomes] = React.useState([]);
    const [
        referenceGenomesLoading,
        setReferenceGenomesLoading,
    ] = React.useState(false);

    const {
        baseId,
        defaultMaxCPUCores,
        defaultMaxMemory,
        defaultMaxDiskSpace,
        submitAnalysis,
        app: { app_type, groups, requirements },
    } = props;

    const formId = buildDebugId(baseId, ids.APP_LAUNCH_FORM);
    const stepIdParams = buildDebugId(formId, ids.TEMPLATE_GROUP);
    const stepIdResources = buildDebugId(
        formId,
        ids.APP_LAUNCH_RESOURCE_REQUESTS
    );
    const stepIdReview = buildDebugId(formId, ids.APP_LAUNCH_REVIEW);

    const hasParams = groups?.reduce(
        (hasParams, group) => hasParams || group.parameters?.length > 0,
        false
    );

    const hasReferenceGenomes =
        hasParams &&
        groups?.reduce(
            (hasReferenceGenomes, group) =>
                hasReferenceGenomes ||
                group.parameters?.find(
                    (param) =>
                        param.type === constants.PARAM_TYPE.REFERENCE_GENOME ||
                        param.type ===
                            constants.PARAM_TYPE.REFERENCE_SEQUENCE ||
                        param.type === constants.PARAM_TYPE.REFERENCE_ANNOTATION
                ),
            false
        );

    React.useEffect(() => {
        let unmounted = false;

        if (hasReferenceGenomes) {
            setReferenceGenomesLoading(true);
            getReferenceGenomes().then((resp) => {
                if (!unmounted) {
                    const genomes = resp?.genomes || [];
                    setReferenceGenomes(
                        stableSort(genomes, (a, b) =>
                            a.name.localeCompare(b.name)
                        )
                    );
                    setReferenceGenomesLoading(false);
                }
            });
        }

        return () => {
            unmounted = true;
        };
    }, [props.app, hasReferenceGenomes]);

    const hasParamsStep = hasParams || requirements?.length > 0;

    const stepAnalysisInfo = { label: getMessage("analysisInfo"), step: 0 };
    const stepParameters = { label: getMessage("parameters"), step: 1 };
    const stepReviewAndLaunch = {
        label: getMessage("reviewAndLaunch"),
        step: hasParamsStep ? 2 : 1,
    };

    const steps = hasParamsStep
        ? [stepAnalysisInfo, stepParameters, stepReviewAndLaunch]
        : [stepAnalysisInfo, stepReviewAndLaunch];

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

    return (
        <Formik
            enableReinitialize
            initialValues={initValues(props)}
            validate={validate}
            onSubmit={(values, { setSubmitting }) => {
                submitAnalysis(
                    formatSubmission(values),
                    () => setSubmitting(false),
                    (errorMsg) => setSubmitting(false)
                );
            }}
        >
            {({ values, errors, touched, handleSubmit, isSubmitting }) => (
                <Form id={formId}>
                    <Stepper alternativeLabel nonLinear activeStep={activeStep}>
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
                                        {step.label}
                                    </StepLabel>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>

                    <StepContent
                        id={buildDebugId(formId, ids.LAUNCH_ANALYSIS_GROUP)}
                        step={stepAnalysisInfo.step}
                        label={getMessage("analysisInfo")}
                        hidden={activeStep !== stepAnalysisInfo.step}
                    >
                        <AnalysisInfoForm formId={formId} appType={app_type} />
                    </StepContent>

                    <StepContent
                        id={stepIdParams}
                        step={stepParameters.step}
                        label={getMessage("analysisParameters")}
                        hidden={
                            !hasParamsStep || activeStep !== stepParameters.step
                        }
                    >
                        {values.groups?.map((group, index) => (
                            <ParamGroupForm
                                key={group.id}
                                baseId={buildDebugId(stepIdParams, index + 1)}
                                fieldName={`groups.${index}`}
                                group={group}
                                referenceGenomes={referenceGenomes}
                                referenceGenomesLoading={
                                    referenceGenomesLoading
                                }
                            />
                        ))}

                        {values.limits && (
                            <ResourceRequirementsForm
                                baseId={stepIdResources}
                                limits={values.limits}
                                defaultMaxCPUCores={defaultMaxCPUCores}
                                defaultMaxMemory={defaultMaxMemory}
                                defaultMaxDiskSpace={defaultMaxDiskSpace}
                            />
                        )}
                    </StepContent>

                    <StepContent
                        id={stepIdReview}
                        step={stepReviewAndLaunch.step}
                        label={getMessage("launchOrSaveAsQL")}
                        hidden={activeStep !== stepReviewAndLaunch.step}
                    >
                        <ParamsReview
                            appType={app_type}
                            groups={values.groups}
                            errors={errors}
                            touched={touched}
                        />

                        {values.requirements && (
                            <ResourceRequirementsReview
                                baseId={stepIdReview}
                                requirements={values.requirements}
                            />
                        )}
                    </StepContent>

                    <BottomNavigation
                        showLabels
                        onChange={(event, value) => {
                            switch (value) {
                                case "submit":
                                    handleSubmit(event);
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
                        {isLastStep() ? (
                            <BottomNavigationAction
                                id={buildDebugId(formId, ids.BUTTONS.SUBMIT)}
                                label={getMessage("launchAnalysis")}
                                value="submit"
                                disabled={isSubmitting}
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
                </Form>
            )}
        </Formik>
    );
};

export default withI18N(injectIntl(AppLaunchWizard), messages);
