/**
 * @author psarando
 */
import React from "react";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";

import { FormSearchField } from "@cyverse-de/ui-lib";

import { ListItemText, MenuItem } from "@material-ui/core";

const OLSOption = ({ innerRef, isFocused, innerProps, data }) => (
    <MenuItem buttonRef={innerRef} selected={isFocused} {...innerProps}>
        <ListItemText
            primary={data.label}
            secondary={
                data.ontology_prefix &&
                data.iri &&
                `${data.ontology_prefix}: ${data.iri}`
            }
        />
    </MenuItem>
);

const OntologyLookupServiceSearchField = (props) => {
    const { attribute, searchOLSTerms, ...custom } = props;

    const { t } = useTranslation("metadata");

    const loadOptions = (inputValue, callback) => {
        searchOLSTerms({
            inputValue,
            loaderSettings: attribute?.settings || {},
            callback: (results) => callback(results?.response?.docs),
        });
    };

    const formatCreateLabel = (inputValue) => {
        return t("formatMetadataTermFreeTextOption", { inputValue });
    };

    return (
        <FormSearchField
            loadOptions={loadOptions}
            variant="asyncCreatable"
            labelKey="label"
            valueKey="label"
            CustomOption={OLSOption}
            formatCreateLabel={formatCreateLabel}
            {...custom}
        />
    );
};

OntologyLookupServiceSearchField.propTypes = {
    searchOLSTerms: PropTypes.func.isRequired,
};

export default OntologyLookupServiceSearchField;
