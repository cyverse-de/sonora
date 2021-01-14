/**
 * @author psarando
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

import { FormSearchField, getMessage } from "@cyverse-de/ui-lib";

import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";

const customStyles = {
    menu: (base) => ({
        ...base,
        position: "relative",
        zIndex: 888888,
    }),
};

const AstroThesaurusOption = ({ innerRef, isFocused, innerProps, data }) => (
    <MenuItem buttonRef={innerRef} selected={isFocused} {...innerProps}>
        <ListItemText primary={data.label} secondary={data.iri} />
    </MenuItem>
);

class AstroThesaurusSearchField extends Component {
    constructor(props) {
        super(props);

        this.loadOptions = this.loadOptions.bind(this);
    }

    static propTypes = {
        presenter: PropTypes.shape({
            searchAstroThesaurusTerms: PropTypes.func.isRequired,
        }),
    };

    loadOptions(inputValue, callback) {
        this.props.presenter.searchAstroThesaurusTerms(inputValue, (results) =>
            callback(results && results.items)
        );
    }

    formatCreateLabel(inputValue) {
        return getMessage("formatMetadataTermFreeTextOption", {
            values: { inputValue },
        });
    }

    render() {
        const { presenter, ...props } = this.props;

        return (
            <FormSearchField
                loadOptions={this.loadOptions}
                variant="asyncCreatable"
                labelKey="label"
                valueKey="label"
                CustomOption={AstroThesaurusOption}
                formatCreateLabel={this.formatCreateLabel}
                styles={customStyles}
                {...props}
            />
        );
    }
}

export default AstroThesaurusSearchField;
