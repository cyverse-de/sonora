/**
 * @author psarando
 *
 * An App Launch Wizard for collecting and validating user input of app
 * parameters and resource requirements as an alaysis submission.
 */
import React from "react";
import { Formik, Form, FastField } from "formik";
import numeral from "numeral";

import {
    FormCheckbox,
    FormMultilineTextField,
    FormIntegerField,
    FormNumberField,
    FormSelectField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import {
    BottomNavigation,
    BottomNavigationAction,
    MenuItem,
    Stepper,
    Step,
    StepButton,
    StepLabel,
    Typography,
} from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";

const steps = [
    "Analysis Info",
    "Parameters",
    "Resource Requests",
    "Review and Launch",
];

const StepContent = ({ activeStep, step, label, children }) => (
    <fieldset hidden={activeStep !== step}>
        <legend>{`Step ${step + 1}: ${label}`}</legend>
        {children}
    </fieldset>
);

const formatAnalysisName = (name) =>
    name ? `${name} analysis1`.replace(/ /g, "_") : "";

const ONE_GB = 1024 * 1024 * 1024;

const formatGBListItem = (size) => size && numeral(size).format("0 ib");
const formatGBValue = (size) => size && numeral(size).format("0.0 ib");

function buildLimitList(startValue, minValue, maxValue) {
    const limits = [0];

    let value = startValue;
    while (value <= maxValue) {
        if (value >= minValue) {
            limits.push(value);
        }
        value *= 2;
    }

    return limits;
}

const validate = (values) => {
    const errors = {};
    const stepErrors = [];

    if (!values.name) {
        errors.name = "Required";
        stepErrors[0] = true;
    }
    if (!values.output_dir) {
        errors.output_dir = "Required";
        stepErrors[0] = true;
    }

    if (values.groups) {
        const groupErrors = [];
        values.groups.forEach((group, index) => {
            const paramErrors = [];

            if (group.parameters) {
                group.parameters.forEach((param, paramIndex) => {
                    if (!param.value && param.required) {
                        paramErrors[paramIndex] = { value: "Required" };
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
        name: formatAnalysisName(name),
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
    } = props;

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
                        {steps.map((label, index) => {
                            return (
                                <Step key={label}>
                                    <StepButton onClick={handleStep(index)}>
                                        <StepLabel
                                            error={
                                                errors.steps &&
                                                errors.steps[index]
                                            }
                                        >
                                            {label}
                                        </StepLabel>
                                    </StepButton>
                                </Step>
                            );
                        })}
                    </Stepper>

                    <StepContent
                        step={0}
                        label="Analysis Info"
                        activeStep={activeStep}
                    >
                        <FastField
                            label="Analysis Name"
                            required={true}
                            name="name"
                            component={FormTextField}
                        />
                        <FastField
                            label="Comments"
                            name="description"
                            component={FormMultilineTextField}
                        />
                        <FastField
                            label="Output Folder"
                            required={true}
                            name="output_dir"
                            component={FormTextField}
                        />
                        <FastField
                            label="Retain inputs? Enabling this flag will copy all the input files into the analysis result folder."
                            name="debug"
                            component={FormCheckbox}
                        />
                    </StepContent>

                    <StepContent
                        step={1}
                        label="Analysis Parameters"
                        activeStep={activeStep}
                    >
                        {values.groups && values.groups.length > 0
                            ? values.groups.map((group, index) => (
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
                              ))
                            : "This app has no additional parameters."}
                    </StepContent>

                    <StepContent
                        step={2}
                        label="Resource Requirements"
                        activeStep={activeStep}
                    >
                        {values.limits.map((reqs, index) => {
                            const {
                                min_cpu_cores,
                                max_cpu_cores,
                                min_memory_limit,
                                memory_limit,
                                min_disk_space,
                            } = reqs;

                            const minCPUCoreList = buildLimitList(
                                1,
                                min_cpu_cores || 0,
                                max_cpu_cores || defaultMaxCPUCores || 8
                            );
                            const minMemoryList = buildLimitList(
                                2 * ONE_GB,
                                min_memory_limit || 0,
                                memory_limit || defaultMaxMemory || 16 * ONE_GB
                            );
                            const minDiskSpaceList = buildLimitList(
                                ONE_GB,
                                min_disk_space || 0,
                                defaultMaxDiskSpace || 512 * ONE_GB
                            );

                            return (
                                <fieldset key={reqs.step_number}>
                                    <legend>
                                        Resource Requirements for Step{" "}
                                        {reqs.step_number + 1}
                                    </legend>
                                    <FastField
                                        name={`requirements.${index}.min_cpu_cores`}
                                        label={"minCPUCores"}
                                        component={FormSelectField}
                                    >
                                        {minCPUCoreList.map((size, index) => (
                                            <MenuItem key={index} value={size}>
                                                {size}
                                            </MenuItem>
                                        ))}
                                    </FastField>
                                    <FastField
                                        name={`requirements.${index}.min_memory_limit`}
                                        label={"minMemory"}
                                        component={FormSelectField}
                                        renderValue={formatGBValue}
                                    >
                                        {minMemoryList.map((size, index) => (
                                            <MenuItem key={index} value={size}>
                                                {formatGBListItem(size)}
                                            </MenuItem>
                                        ))}
                                    </FastField>
                                    <FastField
                                        name={`requirements.${index}.min_disk_space`}
                                        label={"minDiskSpace"}
                                        component={FormSelectField}
                                        renderValue={formatGBValue}
                                    >
                                        {minDiskSpaceList.map((size, index) => (
                                            <MenuItem key={index} value={size}>
                                                {formatGBListItem(size)}
                                            </MenuItem>
                                        ))}
                                    </FastField>
                                </fieldset>
                            );
                        })}
                    </StepContent>

                    <StepContent
                        step={3}
                        label="Launch or Save as Quick Launch"
                        activeStep={activeStep}
                    >
                        {values.groups &&
                            values.groups.map((group) =>
                                group.parameters.map(
                                    (param) =>
                                        param.isVisible &&
                                        (!!param.value ||
                                            param.value === 0) && (
                                            <Typography key={param.id}>
                                                {param.label}: {param.value}
                                            </Typography>
                                        )
                                )
                            )}
                        {values.requirements &&
                            values.requirements.map(
                                (reqs) =>
                                    !!(
                                        reqs.min_cpu_cores ||
                                        reqs.min_memory_limit ||
                                        reqs.min_disk_space
                                    ) && (
                                        <fieldset key={reqs.step_number}>
                                            <legend>
                                                Resource Requirements for Step{" "}
                                                {reqs.step_number + 1}
                                            </legend>
                                            {!!reqs.min_cpu_cores && (
                                                <Typography>
                                                    minCPUCores:{" "}
                                                    {reqs.min_cpu_cores}
                                                </Typography>
                                            )}
                                            {!!reqs.min_memory_limit && (
                                                <Typography>
                                                    minMemory:{" "}
                                                    {formatGBValue(
                                                        reqs.min_memory_limit
                                                    )}
                                                </Typography>
                                            )}
                                            {!!reqs.min_disk_space && (
                                                <Typography>
                                                    minDiskSpace:{" "}
                                                    {formatGBValue(
                                                        reqs.min_disk_space
                                                    )}
                                                </Typography>
                                            )}
                                        </fieldset>
                                    )
                            )}
                    </StepContent>

                    <BottomNavigation
                        value={activeStep}
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
                            label="Back"
                            value="back"
                            icon={<ArrowBack />}
                        />
                        {isLastStep() ? (
                            <BottomNavigationAction
                                label="Launch Analysis"
                                value="submit"
                                disabled={isSubmitting}
                            />
                        ) : (
                            <BottomNavigationAction
                                label="Next"
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

export default AppLaunchWizard;
