/**
 * @author psarando
 */
import React from "react";
import PropTypes from "prop-types";

import FormSearchField from "components/forms/FormSearchField";

import { ListItemText, MenuItem } from "@material-ui/core";

const OLSOption = (option) => (
    <MenuItem>
        <ListItemText
            primary={option.label}
            secondary={
                option.ontology_prefix &&
                option.iri &&
                `${option.ontology_prefix}: ${option.iri}`
            }
        />
    </MenuItem>
);

const OntologyLookupServiceSearchField = (props) => {
    const { attribute, searchOLSTerms, ...custom } = props;
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
            {...custom}
        />
    );
};

OntologyLookupServiceSearchField.propTypes = {
    searchOLSTerms: PropTypes.func.isRequired,
};

export default OntologyLookupServiceSearchField;
