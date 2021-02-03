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

                callback(Object.values(filteredMap || {}));
            },
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
