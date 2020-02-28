/**
 * @author psarando
 *
 * An App Launch Wizard for collecting and validating user input of app
 * parameters and resource requirements as an alaysis submission.
 */
import React from "react";

import { Formik, Form, FastField } from "formik";
import { injectIntl } from "react-intl";

import messages from "./messages";

import {
    ResourceRequirementsForm,
    ResourceRequirementsReview,
} from "./ResourceRequirements";

import {
    FormCheckbox,
    FormMultilineTextField,
    FormIntegerField,
    FormNumberField,
    FormTextField,
    getMessage,
    formatMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Stepper,
    Step,
    StepButton,
    StepLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";

const StepContent = ({ hidden, step, label, children }) => (
    <fieldset hidden={hidden}>
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

const validate = (values) => {
    const errors = {};
    const stepErrors = [];

    if (!values.name) {
        errors.name = getMessage("required");
        stepErrors[0] = true;
    }
    if (!values.output_dir) {
        errors.output_dir = getMessage("required");
        stepErrors[0] = true;
    }

    if (values.groups) {
        const groupErrors = [];
        values.groups.forEach((group, index) => {
            const paramErrors = [];

            if (group.parameters) {
                group.parameters.forEach((param, paramIndex) => {
                    if (!param.value && param.required) {
                        paramErrors[paramIndex] = {
                            value: getMessage("required"),
                        };
                        stepErrors[1] = true;
                    }
                });

                if (paramErrors.length > 0) {
                    groupErrors[index] = { parameters: paramErrors };
                }
            }
        });

        if (groupErrors.length > 0) {
            errors.groups = groupErrors;
        }
    }

    if (stepErrors.length > 0) {
        errors.steps = stepErrors;
    }

    return errors;
};

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
        defaultMaxCPUCores,
        defaultMaxMemory,
        defaultMaxDiskSpace,
        submitAnalysis,
        app: { groups },
    } = props;

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
                                if (param.type !== "Info") {
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
                <Form>
                    <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                        {steps.map((step, index) => {
                            return (
                                <Step key={step.label}>
                                    <StepButton onClick={handleStep(index)}>
                                        <StepLabel
                                            error={
                                                errors.steps &&
                                                errors.steps[index]
                                            }
                                        >
                                            {step.label}
                                        </StepLabel>
                                    </StepButton>
                                </Step>
                            );
                        })}
                    </Stepper>

                    <StepContent
                        step={stepAnalysisInfo.step}
                        label={getMessage("analysisInfo")}
                        hidden={activeStep !== stepAnalysisInfo.step}
                    >
                        <FastField
                            label={getMessage("analysisName")}
                            required={true}
                            name="name"
                            component={FormTextField}
                        />
                        <FastField
                            label={getMessage("comments")}
                            name="description"
                            component={FormMultilineTextField}
                        />
                        <FastField
                            label={getMessage("outputFolder")}
                            required={true}
                            name="output_dir"
                            component={FormTextField}
                        />
                        <FastField
                            label={getMessage("retainInputsLabel")}
                            name="debug"
                            component={FormCheckbox}
                        />
                    </StepContent>

                    <StepContent
                        step={stepParameters.step}
                        label={getMessage("analysisParameters")}
                        hidden={
                            !hasParams || activeStep !== stepParameters.step
                        }
                    >
                        {values.groups &&
                            values.groups.map((group, index) => (
                                <fieldset key={group.id}>
                                    <legend>{group.label}</legend>
                                    {group.parameters.map(
                                        (param, paramIndex) => {
                                            if (!param.isVisible) return null;

                                            const name = `groups.${index}.parameters.${paramIndex}.value`;

                                            let fieldProps = {
                                                name,
                                                label: param.label,
                                                required: param.required,
                                            };

                                            switch (param.type) {
                                                case "Info":
                                                    fieldProps = {
                                                        name,
                                                        component: "div",
                                                        children: param.label,
                                                    };
                                                    break;

                                                case "Integer":
                                                    fieldProps.component = FormIntegerField;
                                                    break;

                                                case "Double":
                                                    fieldProps.component = FormNumberField;
                                                    break;

                                                default:
                                                    fieldProps.component = FormTextField;
                                                    break;
                                            }

                                            return (
                                                <FastField
                                                    key={param.id}
                                                    {...fieldProps}
                                                />
                                            );
                                        }
                                    )}
                                </fieldset>
                            ))}
                    </StepContent>

                    <StepContent
                        step={stepResourceRequirements.step}
                        label={getMessage("resourceRequirements")}
                        hidden={activeStep !== stepResourceRequirements.step}
                    >
                        <ResourceRequirementsForm
                            limits={values.limits}
                            defaultMaxCPUCores={defaultMaxCPUCores}
                            defaultMaxMemory={defaultMaxMemory}
                            defaultMaxDiskSpace={defaultMaxDiskSpace}
                        />
                    </StepContent>

                    <StepContent
                        step={stepReviewAndLaunch.step}
                        label={getMessage("launchOrSaveAsQL")}
                        hidden={activeStep !== stepReviewAndLaunch.step}
                    >
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {values.groups &&
                                        values.groups.map((group) =>
                                            group.parameters.map(
                                                (param) =>
                                                    param.isVisible &&
                                                    (!!param.value ||
                                                        param.value === 0) && (
                                                        <TableRow
                                                            key={param.id}
                                                        >
                                                            <TableCell>
                                                                {param.label}
                                                            </TableCell>
                                                            <TableCell>
                                                                {param.value}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                            )
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <ResourceRequirementsReview
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
                            label={getMessage("back")}
                            value="back"
                            icon={<ArrowBack />}
                        />
                        {isLastStep() ? (
                            <BottomNavigationAction
                                label={getMessage("launchAnalysis")}
                                value="submit"
                                disabled={isSubmitting}
                            />
                        ) : (
                            <BottomNavigationAction
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
