/**
 * @author psarando
 */
import React from "react";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";

import { FormSearchField } from "@cyverse-de/ui-lib";

import { ListItemText, MenuItem } from "@material-ui/core";

const AstroThesaurusOption = ({ innerRef, isFocused, innerProps, data }) => (
    <MenuItem buttonRef={innerRef} selected={isFocused} {...innerProps}>
        <ListItemText primary={data.label} secondary={data.iri} />
    </MenuItem>
);

const AstroThesaurusSearchField = (props) => {
    const { searchAstroThesaurusTerms, ...custom } = props;

    const { t } = useTranslation("metadata");

    const loadOptions = (inputValue, callback) => {
        searchAstroThesaurusTerms({
            inputValue,
            callback: (results) => callback(results && results.items),
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
            CustomOption={AstroThesaurusOption}
            formatCreateLabel={formatCreateLabel}
            {...custom}
        />
    );
};

AstroThesaurusSearchField.propTypes = {
    searchAstroThesaurusTerms: PropTypes.func.isRequired,
};

export default AstroThesaurusSearchField;
