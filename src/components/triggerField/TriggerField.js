import React, { Component } from "react";
import PropTypes from "prop-types";

import SearchField from "../searchField/SearchField";

import Filter from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton/index";
import InputAdornment from "@material-ui/core/InputAdornment/index";
import Popover from "@material-ui/core/Popover/index";

/**
 * @author aramsey
 *
 * A search field that has a customizable "trigger". When the trigger is clicked,
 * the component's children will be displayed in a popover.
 */
class TriggerField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleChange(event) {
        this.setState({ inputValue: event.target.value });
    }

    handleShow(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleHide() {
        this.setState({ anchorEl: null });
    }

    handleSearch(value) {
        this.props.handleSearch(value);
    }

    render() {
        let { anchorEl } = this.state;
        let { children, startAdornment, triggerButton, classes } = this.props;

        return (
            <SearchField
                handleSearch={this.handleSearch}
                startAdornment={startAdornment}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={this.handleShow}>
                            {triggerButton}
                        </IconButton>
                    </InputAdornment>
                }
            >
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    classes={classes}
                    onClose={this.handleHide}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    {children}
                </Popover>
            </SearchField>
        );
    }
}

TriggerField.propTypes = {
    startAdornment: PropTypes.object,
    triggerButton: PropTypes.object,
    classes: PropTypes.object,
    handleSearch: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
};

TriggerField.defaultProps = {
    triggerButton: <Filter />,
};

export default TriggerField;
