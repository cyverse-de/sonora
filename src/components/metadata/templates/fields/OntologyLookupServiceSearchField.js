/**
 * @author psarando sriram
 */
import React from "react";

import { FastField } from "formik";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";
import FormSearchField from "components/forms/FormSearchField";

import { ListItemText } from "@mui/material";

const OLSOption = (option) => (
    <ListItemText
        primary={option.label}
        secondary={
            option.ontology_prefix &&
            option.iri &&
            `${option.ontology_prefix}: ${option.iri}`
        }
    />
);

const OntologyLookupServiceSearchFieldComponent = (props) => {
    const { attribute, searchOLSTerms, writable, ...custom } = props;

    const [options, setOptions] = React.useState([]);

    const handleSearch = (event, value, reason) => {
        if (reason === "clear" || value === "") {
            setOptions([]);
        }
        loadOptions(value);
    };
    const loadOptions = (inputValue) => {
        searchOLSTerms({
            inputValue,
            loaderSettings: attribute?.settings || {},
            callback: (results) => setOptions(results?.response?.docs),
        });
    };

    return (
        <FormSearchField
            renderCustomOption={OLSOption}
            handleSearch={handleSearch}
            options={options}
            labelKey="label"
            valueKey="label"
            label={attribute.name}
            required={attribute.required && writable}
            readOnly={!writable}
            {...custom}
        />
    );
};

const OntologyLookupServiceSearchField = ({ avu, avuFieldName, ...props }) => {
    const { t } = useTranslation("metadata");

    return (
        <FastField
            name={`${avuFieldName}.value`}
            component={OntologyLookupServiceSearchFieldComponent}
            validate={(value) => {
                if (props.attribute?.required && !value) {
                    return t("required");
                }
            }}
            {...props}
        />
    );
};

OntologyLookupServiceSearchField.propTypes = {
    searchOLSTerms: PropTypes.func.isRequired,
};

export default OntologyLookupServiceSearchField;
