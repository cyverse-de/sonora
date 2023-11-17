/**
 * @author psarando sriram
 */
import React from "react";
import PropTypes from "prop-types";

import FormSearchField from "components/forms/FormSearchField";

import { ListItemText } from "@mui/material";

const AstroThesaurusOption = (option) => (
    <ListItemText primary={option.label} secondary={option.iri} />
);

const AstroThesaurusSearchField = (props) => {
    const { searchAstroThesaurusTerms, ...custom } = props;
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
            {...custom}
        />
    );
};

AstroThesaurusSearchField.propTypes = {
    searchAstroThesaurusTerms: PropTypes.func.isRequired,
};

export default AstroThesaurusSearchField;
