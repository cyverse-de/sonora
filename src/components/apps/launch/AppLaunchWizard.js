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

import {
    build as buildDebugId,
    getMessage,
    formatMessage,
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
    const groupInitValues =
        groups &&
        groups.map((group) => ({
            ...group,
            parameters:
                group.parameters &&
                group.parameters.map((param) => ({
                    ...param,
                    value: param.defaultValue || "",
                })),
        }));

    const reqInitValues = requirements.map(
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
        requirements: reqInitValues,
    };
};

const AppLaunchWizard = (props) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const {
        baseId,
        defaultMaxCPUCores,
        defaultMaxMemory,
        defaultMaxDiskSpace,
        submitAnalysis,
        app: { groups },
    } = props;

    const formId = buildDebugId(baseId, ids.APP_LAUNCH_FORM);
    const stepIdParams = buildDebugId(formId, ids.TEMPLATE_GROUP);
    const stepIdResources = buildDebugId(
        formId,
        ids.APP_LAUNCH_RESOURCE_REQUESTS
    );
    const stepIdReview = buildDebugId(formId, ids.APP_LAUNCH_REVIEW);

    const hasParams =
        groups &&
        groups.reduce(
            (hasParams, group) =>
                hasParams || (group.parameters && group.parameters.length > 0),
            false
        );

    const stepAnalysisInfo = { label: getMessage("analysisInfo"), step: 0 };
    const stepParameters = { label: getMessage("parameters"), step: 1 };
    const stepResourceRequirements = {
        label: getMessage("resourceRequirements"),
        step: hasParams ? 2 : 1,
    };
    const stepReviewAndLaunch = {
        label: getMessage("reviewAndLaunch"),
        step: hasParams ? 3 : 2,
    };

    const steps = hasParams
        ? [
              stepAnalysisInfo,
              stepParameters,
              stepResourceRequirements,
              stepReviewAndLaunch,
          ]
        : [stepAnalysisInfo, stepResourceRequirements, stepReviewAndLaunch];

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
                const {
                    notify,
                    debug,
                    name,
                    description,
                    output_dir,
                    system_id,
                    app_id,
                    requirements,
                    groups,
                } = values;

                const submission = {
                    notify,
                    debug,
                    name,
                    description,
                    output_dir,
                    system_id,
                    app_id,
                    requirements,
                    config:
                        groups &&
                        groups.reduce((configs, group) => {
                            group.parameters.forEach((param) => {
                                if (param.type !== constants.PARAM_TYPE.INFO) {
                                    configs[param.id] = param.value;
                                }
                            });
                            return configs;
                        }, {}),
                };

                submitAnalysis(
                    submission,
                    () => setSubmitting(false),
                    (errorMsg) => setSubmitting(false)
                );
            }}
        >
            {({ values, errors, handleSubmit, isSubmitting }) => (
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
                                            errors.steps && errors.steps[index]
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
                        <AnalysisInfoForm formId={formId} />
                    </StepContent>

                    <StepContent
                        id={stepIdParams}
                        step={stepParameters.step}
                        label={getMessage("analysisParameters")}
                        hidden={
                            !hasParams || activeStep !== stepParameters.step
                        }
                    >
                        {values.groups &&
                            values.groups.map((group, index) => (
                                <ParamGroupForm
                                    key={group.id}
                                    baseId={buildDebugId(
                                        stepIdParams,
                                        index + 1
                                    )}
                                    fieldName={`groups.${index}`}
                                    group={group}
                                />
                            ))}
                    </StepContent>

                    <StepContent
                        id={stepIdResources}
                        step={stepResourceRequirements.step}
                        label={getMessage("resourceRequirements")}
                        hidden={activeStep !== stepResourceRequirements.step}
                    >
                        <ResourceRequirementsForm
                            baseId={stepIdResources}
                            limits={values.limits}
                            defaultMaxCPUCores={defaultMaxCPUCores}
                            defaultMaxMemory={defaultMaxMemory}
                            defaultMaxDiskSpace={defaultMaxDiskSpace}
                        />
                    </StepContent>

                    <StepContent
                        id={stepIdReview}
                        step={stepReviewAndLaunch.step}
                        label={getMessage("launchOrSaveAsQL")}
                        hidden={activeStep !== stepReviewAndLaunch.step}
                    >
                        <ParamsReview groups={values.groups} />

                        <ResourceRequirementsReview
                            baseId={stepIdReview}
                            requirements={values.requirements}
                        />
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
