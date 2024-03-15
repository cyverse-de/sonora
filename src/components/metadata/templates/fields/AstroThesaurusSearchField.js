/**
 * @author psarando sriram
 */
import React from "react";

import { FastField } from "formik";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";
import FormSearchField from "components/forms/FormSearchField";

import { ListItemText } from "@mui/material";

const AstroThesaurusOption = (option) => (
    <ListItemText primary={option.label} secondary={option.iri} />
);

const AstroThesaurusSearchFieldComponent = (props) => {
    const { searchAstroThesaurusTerms, attribute, writable, ...custom } = props;

    const [options, setOptions] = React.useState([]);

    const handleSearch = (event, value, reason) => {
        if (reason === "clear" || value === "") {
            setOptions([]);
        }
        loadOptions(value);
    };

    const loadOptions = (inputValue) => {
        searchAstroThesaurusTerms({
            inputValue,
            callback: (response) => {
                // The UAT service may return duplicates in the results.
                // While we're at it, also parse out only the fields we need
                // and rename them to `iri` and `label`.
                const items = response?.result?.items;

                const filteredMap = items?.reduce((filtered, item) => {
                    const { _about: iri } = item;

                    // not all items will be an object
                    if (iri && !filtered[iri]) {
                        const {
                            prefLabel: { _value: label },
                        } = item;

                        filtered[iri] = { iri, label };
                    }

                    return filtered;
                }, {});

                setOptions(Object.values(filteredMap || {}));
            },
        });
    };

    return (
        <FormSearchField
            renderCustomOption={AstroThesaurusOption}
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

const AstroThesaurusSearchField = ({ avu, avuFieldName, ...props }) => {
    const { t } = useTranslation("metadata");

    return (
        <FastField
            name={`${avuFieldName}.value`}
            component={AstroThesaurusSearchFieldComponent}
            validate={(value) => {
                if (props.attribute?.required && !value) {
                    return t("required");
                }
            }}
            {...props}
        />
    );
};

AstroThesaurusSearchField.propTypes = {
    searchAstroThesaurusTerms: PropTypes.func.isRequired,
};

export default AstroThesaurusSearchField;
