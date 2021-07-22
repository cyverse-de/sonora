import React from "react";

import { Formik, Field } from "formik";

import {
    FormCheckbox,
    FormFieldLoading,
    FormIntegerField,
    FormMultilineTextField,
    FormNumberField,
    FormSelectField,
    FormSwitch,
    FormTextField,
    FormTimestampField,
} from "components/forms/FormField";

import { formatDateObject } from "components/utils/DateFormatter";
import dateConstants from "components/utils/dateConstants";

import { MenuItem } from "@material-ui/core";

const helperText = {
    name: "Helper Text",
    defaultValue: "",
    control: {
        type: "text",
    },
};
const required = {
    name: "Required?",
    defaultValue: false,
    control: {
        type: "boolean",
    },
};
const readOnly = {
    name: "Read Only?",
    defaultValue: false,
    control: {
        type: "boolean",
    },
};

const TestForm = ({ initialValue, required, children }) => {
    return (
        <Formik
            enableReinitialize
            initialValues={{ test_field: initialValue }}
            validate={(values) => {
                const errors = {};

                if (required && !values.test_field) {
                    errors.test_field = "Required";
                }

                return errors;
            }}
            onSubmit={({ values }) => console.log(values)}
        >
            {() => children}
        </Formik>
    );
};
export const TextField = ({
    label,
    helperText,
    required,
    loading,
    readOnly,
}) => {
    const inputProps = { readOnly };
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={loading ? FormFieldLoading : FormTextField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
                inputProps={inputProps}
            />
        </TestForm>
    );
};

TextField.argTypes = {
    label: {
        name: "Label",
        defaultValue: "Text Field Label",
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    loading: {
        name: "Loading Mask?",
        defaultValue: false,
        control: {
            type: "boolean",
        },
    },
    readOnly,
};

export const MultilineTextField = ({
    label,
    helperText,
    required,
    readOnly,
}) => {
    const inputProps = { readOnly };
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={FormMultilineTextField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
                inputProps={inputProps}
            />
        </TestForm>
    );
};

MultilineTextField.argTypes = {
    label: {
        name: "Label",
        defaultValue: "MultiLine Field Label",
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    readOnly,
};

export const IntegerField = ({ label, helperText, required, readOnly }) => {
    const inputProps = { readOnly };
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={FormIntegerField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
                inputProps={inputProps}
            />
        </TestForm>
    );
};

IntegerField.argTypes = {
    label: {
        name: "Label",
        defaultValue: "Integer Field Label",
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    readOnly,
};

export const NumberField = ({ label, helperText, required, readOnly }) => {
    const inputProps = { readOnly };
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={FormNumberField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
                inputProps={inputProps}
            />
        </TestForm>
    );
};

NumberField.argTypes = {
    label: {
        name: "Label",
        defaultValue: "Number Field Label",
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    readOnly,
};
export const SelectField = ({ label, helperText, required, readOnly }) => {
    const inputProps = { readOnly };
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={FormSelectField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
                inputProps={inputProps}
            >
                <MenuItem value={1}>One</MenuItem>
                <MenuItem value={2}>Two</MenuItem>
                <MenuItem value={3}>Three</MenuItem>
            </Field>
        </TestForm>
    );
};

SelectField.argTypes = {
    label: {
        name: "Label",
        defaultValue: "Select Field Label",
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    readOnly,
};

export const Checkbox = ({ label, helperText, readOnly }) => {
    const inputProps = { readOnly };
    return (
        <TestForm initialValue={true}>
            <Field
                component={FormCheckbox}
                name="test_field"
                label={label}
                helperText={helperText}
                inputProps={inputProps}
            />
        </TestForm>
    );
};
Checkbox.argTypes = {
    label: {
        name: "Label",
        defaultValue: "Checkbox Label",
        control: {
            type: "text",
        },
    },
    helperText,
    readOnly,
};

export const Switch = ({ label, helperText, readOnly }) => {
    const inputProps = { readOnly };
    return (
        <TestForm initialValue={true}>
            <Field
                component={FormSwitch}
                name="test_field"
                label={label}
                helperText={helperText}
                inputProps={inputProps}
            />
        </TestForm>
    );
};

Switch.argTypes = {
    label: {
        name: "Label",
        defaultValue: "Switch Label",
        control: {
            type: "text",
        },
    },
    helperText,
    readOnly,
};

export const Timestamp = ({ label, helperText, readOnly }) => {
    const inputProps = { readOnly };
    return (
        <TestForm
            initialValue={formatDateObject(
                new Date(),
                dateConstants.LONG_DATE_FORMAT
            )}
        >
            <Field
                component={FormTimestampField}
                name="test_field"
                label={label}
                helperText={helperText}
                inputProps={inputProps}
            />
        </TestForm>
    );
};

Timestamp.argTypes = {
    label: {
        name: "Label",
        defaultValue: "Timestamp Field Label",
        control: {
            type: "text",
        },
    },
    helperText,
    readOnly,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { title: "base/Form Fields" };
