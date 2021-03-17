/**
 * A component for creating and editing Apps.
 *
 * @author psarando
 */
import React from "react";

import { FastField, Formik } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import CmdLineOrderForm from "./CmdLineOrderForm";
import ParamGroups from "./ParamGroups";

import AppStepper, { StepperSkeleton } from "../AppStepper";
import AppStepDisplay, { BottomNavigationSkeleton } from "../AppStepDisplay";

import AppParamTypes from "components/models/AppParamTypes";
import ApplyButton from "components/utils/ApplyButton";
import useComponentHeight from "components/utils/useComponentHeight";

import {
    build as buildID,
    FormTextField,
    FormMultilineTextField,
    getFormError,
} from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    makeStyles,
    Paper,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import { ArrowBack, ArrowForward } from "@material-ui/icons";

const useStyles = makeStyles(styles);

/**
 * Initializes the form values from the given App Description.
 *
 * Removes the optional `name` field from groups,
 * initializes each text parameter's `defaultValue` to an empty string,
 * and each flag's `name` field to a custom object for this form.
 *
 * @param {Object} appDescription
 * @param {Object[]} appDescription.groups
 * @param {Object[]} appDescription.groups.parameters
 *
 * @returns Initial form values.
 */
const initValues = (appDescription) => {
    const { groups } = appDescription;

    const initializedGroups = groups?.map(({ name, ...group }) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const {
                name,
                defaultValue,
                type: paramType,
                arguments: paramArgs,
            } = param;

            switch (paramType) {
                case AppParamTypes.INTEGER:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? Number.parseInt(defaultValue)
                                : "",
                    };

                case AppParamTypes.DOUBLE:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? Number.parseFloat(defaultValue)
                                : "",
                    };

                case AppParamTypes.FLAG:
                    return {
                        ...param,
                        name: initFlagName(name),
                        defaultValue: defaultValue && defaultValue !== "false",
                    };

                case AppParamTypes.FILE_INPUT:
                case AppParamTypes.FOLDER_INPUT:
                    return {
                        ...param,
                        defaultValue: defaultValue?.path || "",
                    };

                case AppParamTypes.MULTIFILE_SELECTOR:
                    return {
                        ...param,
                        defaultValue: defaultValue?.path || [],
                    };

                default:
                    let defaultArg;
                    if (paramArgs?.length > 0) {
                        defaultArg =
                            paramArgs.find(
                                (arg) => defaultValue?.id === arg.id
                            ) || paramArgs.find((arg) => arg.isDefault);
                    }

                    return {
                        ...param,
                        defaultValue: defaultArg || defaultValue || "",
                    };
            }
        }),
    }));

    return { ...appDescription, groups: initializedGroups };
};

/**
 * @typedef {object} FlagNameModelOptVal
 * @property {string} option
 * @property {string} value
 */

/**
 * @typedef {object} FlagNameModel
 * @property {FlagNameModelOptVal} checked
 * @property {FlagNameModelOptVal} unchecked
 */

/**
 * Parses `Flag` param `name` strings into a custom object for this form.
 *
 * @param {string} name
 *
 * @returns {FlagNameModel} An object for use in the flag property editor form.
 */
const initFlagName = (name) => {
    const [checked, unchecked] = name?.split(", ") || [];

    const [checkedOpt, ...checkedVal] = checked?.split(" ") || [];
    const [uncheckedOpt, ...uncheckedVal] = unchecked?.split(" ") || [];

    return {
        checked: {
            option: checkedOpt || "",
            value: checkedVal.join(" "),
        },
        unchecked: {
            option: uncheckedOpt || "",
            value: uncheckedVal.join(" "),
        },
    };
};

/**
 * Formats the form values for submission to the service.
 *
 * @param {Object} appDescription
 * @param {Object[]} appDescription.groups
 * @param {Object[]} appDescription.groups.parameters
 *
 * @returns The App Description formatted for submission to the service.
 */
const formatSubmission = (appDescription) => {
    const { groups } = appDescription;

    const formattedGroups = groups?.map((group) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const {
                name,
                defaultValue,
                type: paramType,
                arguments: paramArgs,
            } = param;

            switch (paramType) {
                case AppParamTypes.TEXT:
                case AppParamTypes.MULTILINE_TEXT:
                case AppParamTypes.REFERENCE_ANNOTATION:
                case AppParamTypes.REFERENCE_GENOME:
                case AppParamTypes.REFERENCE_SEQUENCE:
                    return {
                        ...param,
                        defaultValue: defaultValue || null,
                    };

                case AppParamTypes.INTEGER:
                case AppParamTypes.DOUBLE:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? defaultValue
                                : null,
                    };

                case AppParamTypes.FLAG:
                    return {
                        ...param,
                        name: formatFlagName(name),
                        defaultValue: defaultValue && defaultValue !== "false",
                    };

                case AppParamTypes.TEXT_SELECTION:
                case AppParamTypes.INTEGER_SELECTION:
                case AppParamTypes.DOUBLE_SELECTION:
                    return {
                        ...param,
                        arguments: formatSelectionArgs(paramArgs, defaultValue),
                        defaultValue: defaultValue
                            ? { ...defaultValue, isDefault: true }
                            : null,
                    };

                case AppParamTypes.FILE_INPUT:
                case AppParamTypes.FOLDER_INPUT:
                    return {
                        ...param,
                        defaultValue: defaultValue
                            ? { path: defaultValue }
                            : null,
                    };

                case AppParamTypes.MULTIFILE_SELECTOR:
                    // default values not yet supported
                    return {
                        ...param,
                        defaultValue: null,
                    };

                default:
                    return param;
            }
        }),
    }));

    return { ...appDescription, groups: formattedGroups };
};

/**
 * Formats this form's custom `Flag` param `name` model
 * into a string expected by the service.
 *
 * @param {FlagNameModel} name
 *
 * @returns A string in the form
 *          "checked.option checked.value, unchecked.option unchecked.value"
 */
const formatFlagName = (name) => {
    const {
        checked: { option: checkedOpt, value: checkedVal },
        unchecked: { option: uncheckedOpt, value: uncheckedVal },
    } = name;

    return [
        [checkedOpt, checkedVal].join(" ").trim(),
        [uncheckedOpt, uncheckedVal].join(" ").trim(),
    ].join(", ");
};

const formatSelectionArgs = (paramArgs, defaultValue) => {
    return paramArgs?.map((paramArg) => ({
        ...paramArg,
        isDefault:
            paramArg.id === defaultValue?.id ||
            (paramArg.display === defaultValue?.display &&
                paramArg.name === defaultValue?.name &&
                paramArg.value === defaultValue?.value),
    }));
};

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
    const { backDisabled, nextDisabled, handleBack, handleNext } = props;

    const { t } = useTranslation("common");

    return (
        <ButtonGroup fullWidth variant="contained" color="primary">
            <Button
                disabled={backDisabled}
                startIcon={<ArrowBack />}
                onClick={handleBack}
            >
                {t("back")}
            </Button>
            <Button
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
    const { baseId, appDescription } = props;

    const [activeStep, setActiveStep] = React.useState(0);

    const stepperRef = React.useRef(null);
    const [stepperHeight, setStepperRef] = useComponentHeight();

    React.useEffect(() => {
        setStepperRef(stepperRef);
    }, [stepperRef, setStepperRef]);

    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);
    const classes = useStyles();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const stepAppInfo = {
        label: t("appInfo"),
        contentLabel: t("appInfo"),
    };
    const stepParameters = {
        label: t("parameters"),
        contentLabel: t("appParameters"),
    };
    const stepCmdLineOrder = {
        label: t("commandLineOrder"),
        contentLabel: t("commandLineOrder"),
    };
    const stepPreview = {
        label: t("previewApp"),
        contentLabel: t("common:comingSoon"),
    };

    const steps = [stepAppInfo, stepParameters, stepCmdLineOrder, stepPreview];

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

    return (
        <Formik
            enableReinitialize
            initialValues={initValues({ ...appDescription })}
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
                // FIXME submit to service
                console.log(formatSubmission(values));
                actions.resetForm({ values });
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
                const applyDisabled = isSubmitting || !dirty || errors.error;

                return (
                    <Paper>
                        <Toolbar>
                            <Typography variant="h6" className={classes.flex}>
                                {t("appIntegrationPageHeader", {
                                    name: values.name || t("newApp"),
                                })}
                            </Typography>
                            <ApplyButton
                                id={buildID(baseId, ids.BUTTONS.SAVE_BTN)}
                                type="submit"
                                applyDisabled={applyDisabled}
                                onApply={handleSubmit}
                            />
                        </Toolbar>
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
                                <>
                                    <FastField
                                        id={buildID(baseId, ids.APP_NAME)}
                                        name="name"
                                        label={t("appName")}
                                        required
                                        component={FormTextField}
                                    />
                                    <FastField
                                        id={buildID(
                                            baseId,
                                            ids.APP_DESCRIPTION
                                        )}
                                        name="description"
                                        label={t("appDescription")}
                                        required
                                        component={FormMultilineTextField}
                                    />
                                    <FastField
                                        id={buildID(baseId, ids.TOOL)}
                                        // FIXME fetch tool objects from service
                                        name="tools.0.name"
                                        label={t("toolUsed")}
                                        component={FormTextField}
                                    />
                                </>
                            ) : activeStepInfo === stepParameters ? (
                                <ParamGroups
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
                            ) : activeStepInfo === stepPreview ? (
                                t("common:comingSoon")
                            ) : null}
                        </AppStepDisplay>
                    </Paper>
                );
            }}
        </Formik>
    );
};

export default AppEditor;
