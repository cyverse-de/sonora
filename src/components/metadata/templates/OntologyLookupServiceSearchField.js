/**
 * @author psarando
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

import { getMessage, FormSearchField } from "@cyverse-de/ui-lib";

import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";

const customStyles = {
    menu: (base) => ({
        ...base,
        position: "relative",
        zIndex: 888888,
    }),
};

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

class OntologyLookupServiceSearchField extends Component {
    constructor(props) {
        super(props);

        this.loadOptions = this.loadOptions.bind(this);
    }

    static propTypes = {
        presenter: PropTypes.shape({
            searchOLSTerms: PropTypes.func.isRequired,
        }),
    };

    loadOptions(inputValue, callback) {
        const { attribute, presenter } = this.props;

        presenter.searchOLSTerms(inputValue, attribute.settings, (results) =>
            callback(results && results.docs)
        );
    }

    formatCreateLabel(inputValue) {
        return getMessage("formatMetadataTermFreeTextOption", {
            values: { inputValue },
        });
    }

    render() {
        const { attrTemplate, presenter, ...props } = this.props;

        return (
            <FormSearchField
                loadOptions={this.loadOptions}
                variant="asyncCreatable"
                labelKey="label"
                valueKey="label"
                CustomOption={OLSOption}
                formatCreateLabel={this.formatCreateLabel}
                styles={customStyles}
                {...props}
            />
        );
    }
}

export default OntologyLookupServiceSearchField;
