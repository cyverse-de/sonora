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
    FormSearchField,
} from "components/forms/FormField";

import { formatDateObject } from "components/utils/DateFormatter";
import dateConstants from "components/utils/dateConstants";

import { MenuItem, ListItemText } from "@mui/material";

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
                // Using a static date for chromatic tests.
                new Date(2021, 6, 22, 12, 24, 55),
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

export const SearchField = ({ label, helperText, required }) => {
    const CustomOption = (option) => (
        <ListItemText primary={option.label} secondary={option.iri} />
    );
    const searchOptions = [
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01000955",
            iri: "http://purl.obolibrary.org/obo/ENVO_01000955",
            label: "desert tree line ecotone",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01000956",
            iri: "http://purl.obolibrary.org/obo/ENVO_01000956",
            label: "desert-alpine tree line ecotone",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01000179",
            iri: "http://purl.obolibrary.org/obo/ENVO_01000179",
            label: "desert biome",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01001780",
            iri: "http://purl.obolibrary.org/obo/ENVO_01001780",
            label: "desert ecosystem",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_03500006",
            iri: "http://purl.obolibrary.org/obo/ENVO_03500006",
            label: "food desert",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01000185",
            iri: "http://purl.obolibrary.org/obo/ENVO_01000185",
            label: "montane desert biome",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01000186",
            iri: "http://purl.obolibrary.org/obo/ENVO_01000186",
            label: "polar desert biome",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01000182",
            iri: "http://purl.obolibrary.org/obo/ENVO_01000182",
            label: "temperate desert biome",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01000183",
            iri: "http://purl.obolibrary.org/obo/ENVO_01000183",
            label: "tropical desert biome",
            ontology_prefix: "ENVO",
        },
        {
            id: "envo:class:http://purl.obolibrary.org/obo/ENVO_01000184",
            iri: "http://purl.obolibrary.org/obo/ENVO_01000184",
            label: "subtropical desert biome",
            ontology_prefix: "ENVO",
        },
    ];
    return (
        <TestForm initialValue="subtropical desert biome" required={required}>
            <Field
                component={FormSearchField}
                renderCustomOption={CustomOption}
                handleSearch={(event, value, reason) => {
                    console.log("SearchField handleSearch = " + value);
                }}
                options={searchOptions}
                labelKey="label"
                valueKey="label"
                label={label}
                helperText={helperText}
                name="test_field"
                required={required}
            />
        </TestForm>
    );
};

SearchField.argTypes = {
    label: {
        name: "Label",
        defaultValue: "Search Field Label",
        control: {
            type: "text",
        },
    },
    helperText,
    required,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { title: "base/Form Fields" };
