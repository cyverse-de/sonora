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
export const TextField = ({ label, helperText, required, loading }) => {
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={loading ? FormFieldLoading : FormTextField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
            />
        </TestForm>
    );
};

TextField.argTypes = {
    label: {
        control: {
            type: "text",
        },
    },
    helperText: {
        control: {
            type: "text",
        },
    },
    required: {
        control: {
            type: "boolean",
        },
    },
    loading: {
        control: {
            type: "boolean",
        },
    },
};

export const MultilineTextField = ({ label, helperText, required }) => {
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={FormMultilineTextField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
            />
        </TestForm>
    );
};

MultilineTextField.argTypes = {
    label: {
        control: {
            type: "text",
        },
    },
    helperText: {
        control: {
            type: "text",
        },
    },
    required: {
        control: {
            type: "boolean",
        },
    },
};

export const IntegerField = ({ label, helperText, required }) => {
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={FormIntegerField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
            />
        </TestForm>
    );
};

IntegerField.argTypes = {
    label: {
        control: {
            type: "text",
        },
    },
    helperText: {
        control: {
            type: "text",
        },
    },
    required: {
        control: {
            type: "boolean",
        },
    },
};

export const NumberField = ({ label, helperText, required }) => {
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={FormNumberField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
            />
        </TestForm>
    );
};

NumberField.argTypes = {
    label: {
        control: {
            type: "text",
        },
    },
    helperText: {
        control: {
            type: "text",
        },
    },
    required: {
        control: {
            type: "boolean",
        },
    },
};
export const SelectField = ({ label, helperText, required }) => {
    return (
        <TestForm required={required} initialValue="">
            <Field
                component={FormSelectField}
                name="test_field"
                label={label}
                helperText={helperText}
                required={required}
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
        control: {
            type: "text",
        },
    },
    helperText: {
        control: {
            type: "text",
        },
    },
    required: {
        control: {
            type: "boolean",
        },
    },
};

export const Checkbox = ({ label, helperText }) => {
    return (
        <TestForm initialValue={true}>
            <Field
                component={FormCheckbox}
                name="test_field"
                label={label}
                helperText={helperText}
            />
        </TestForm>
    );
};
Checkbox.argTypes = {
    label: {
        control: {
            type: "text",
        },
    },
    helperText: {
        control: {
            type: "text",
        },
    },
};

export const Switch = ({ label, helperText }) => {
    return (
        <TestForm initialValue={true}>
            <Field
                component={FormSwitch}
                name="test_field"
                label={label}
                helperText={helperText}
            />
        </TestForm>
    );
};

Switch.argTypes = {
    label: {
        control: {
            type: "text",
        },
    },
    helperText: {
        control: {
            type: "text",
        },
    },
};

export const Timestamp = ({ label, helperText }) => {
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
            />
        </TestForm>
    );
};

Timestamp.argTypes = {
    label: {
        control: {
            type: "text",
        },
    },
    helperText: {
        control: {
            type: "text",
        },
    },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { title: "lib/Form Fields" };
