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
    control: {
        type: "text",
    },
};
const required = {
    name: "Required?",
    control: {
        type: "boolean",
    },
};
const readOnly = {
    name: "Read Only?",
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
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    loading: {
        name: "Loading Mask?",
        control: {
            type: "boolean",
        },
    },
    readOnly,
};

TextField.args = {
    label: "Text Field Label",
    helperText: "",
    required: false,
    loading: false,
    readOnly: false,
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
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    readOnly,
};

MultilineTextField.args = {
    label: "MultiLine Field Label",
    helperText: "",
    required: false,
    readOnly: false,
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
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    readOnly,
};

IntegerField.args = {
    label: "Integer Field Label",
    helperText: "",
    required: false,
    readOnly: false,
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
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    readOnly,
};

NumberField.args = {
    label: "Number Field Label",
    helperText: "",
    required: false,
    readOnly: false,
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
        control: {
            type: "text",
        },
    },
    helperText,
    required,
    readOnly,
};

SelectField.args = {
    label: "Select Field Label",
    helperText: "",
    required: false,
    readOnly: false,
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
        control: {
            type: "text",
        },
    },
    helperText,
    readOnly,
};

Checkbox.args = {
    label: "Checkbox Label",
    helperText: "",
    readOnly: false,
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
        control: {
            type: "text",
        },
    },
    helperText,
    readOnly,
};

Switch.args = {
    label: "Switch Label",
    helperText: "",
    readOnly: false,
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
        control: {
            type: "text",
        },
    },
    helperText,
    readOnly,
};

Timestamp.args = {
    label: "Timestamp Field Label",
    helperText: "",
    readOnly: false,
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
        control: {
            type: "text",
        },
    },
    helperText,
    required,
};

SearchField.args = {
    label: "Search Field Label",
    helperText: "",
    required: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { title: "base/Form Fields" };
