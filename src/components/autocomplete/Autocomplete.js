import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import Async from "react-select/lib/Async";
import AsyncCreatableSelect from "react-select/lib/AsyncCreatable";

import styles from "./AutocompleteStyles";

import Chip from "@material-ui/core/Chip/index";
import MenuItem from "@material-ui/core/MenuItem/index";

import Select, { Creatable } from "react-select";
import TextField from "@material-ui/core/TextField/index";
import Typography from "@material-ui/core/Typography/index";
import { withStyles } from "@material-ui/core/styles/index";

/**
 * @author aramsey
 * Renders the Select component from react-select with some stylings for material-ui
 *
 * You can provide all your own custom components or use the default components here
 */

class Autocomplete extends Component {
    constructor(props) {
        super(props);

        this.getOptionLabel = this.getOptionLabel.bind(this);
        this.getOptionValue = this.getOptionValue.bind(this);
        this.isValidNewOption = this.isValidNewOption.bind(this);
        this.getNewOptionData = this.getNewOptionData.bind(this);
    }

    getOptionLabel(option) {
        let labelKey = this.props.labelKey;
        return option[labelKey];
    }

    getOptionValue(option) {
        let valueKey = this.props.valueKey;
        return option[valueKey];
    }

    //This should hopefully be not needed in v2.1 for Creatable
    isValidNewOption(inputValue, selectValue, selectOptions) {
        let labelKey = this.props.labelKey;
        if (
            inputValue.trim().length === 0 ||
            selectOptions.find((option) => option[labelKey] === inputValue)
        ) {
            return false;
        }
        return true;
    }

    //This should hopefully be not needed in v2.1 for Creatable
    getNewOptionData(inputValue, optionLabel) {
        let labelKey = this.props.labelKey;
        return {
            id: inputValue,
            [labelKey]: optionLabel,
        };
    }

    render() {
        let {
            variant,
            classes,
            controlShouldRenderValue,
            CustomOption,
            CustomControl,
            CustomNoOptionsMessage,
            CustomPlaceholder,
            CustomSingleValue,
            CustomMultiValue,
            CustomValueContainer,
            ...custom
        } = this.props;

        let SelectComponent = null;

        switch (variant) {
            case "creatable":
                SelectComponent = Creatable;
                break;
            case "async":
                SelectComponent = Async;
                break;
            case "asyncCreatable":
                SelectComponent = AsyncCreatableSelect;
                break;
            default:
                SelectComponent = Select;
                break;
        }

        let components = {
            Option: CustomOption,
            Control: CustomControl,
            NoOptionsMessage: CustomNoOptionsMessage,
            Placeholder: CustomPlaceholder,
            SingleValue: CustomSingleValue,
            MultiValue: CustomMultiValue,
            ValueContainer: CustomValueContainer,
        };

        return (
            <div className={classes.root}>
                <SelectComponent
                    classes={classes}
                    components={components}
                    getOptionLabel={this.getOptionLabel}
                    getOptionValue={this.getOptionValue}
                    isValidNewOption={this.isValidNewOption}
                    getNewOptionData={this.getNewOptionData}
                    controlShouldRenderValue={controlShouldRenderValue}
                    {...custom}
                />
            </div>
        );
    }
}

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    ref: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography
            className={props.selectProps.classes.singleValue}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return (
        <div className={props.selectProps.classes.valueContainer}>
            {props.children}
        </div>
    );
}

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={(event) => {
                props.removeProps.onClick();
                props.removeProps.onMouseDown(event);
            }}
        />
    );
}

Autocomplete.propTypes = {
    onInputChange: PropTypes.func, // when the input value updates
    onChange: PropTypes.func, // when an option is selected
    options: PropTypes.array, // array of options/suggestions for Select
    loadOptions: PropTypes.func, // Async's func for fetching options, will contain callback prop
    labelKey: PropTypes.string.isRequired, // label for each option
    valueKey: PropTypes.string.isRequired, // value for each option
    controlShouldRenderValue: PropTypes.bool, // determines if a selected option will then display in the input/text field
    variant: PropTypes.oneOf([
        "creatable",
        "async",
        "asyncCreatable",
        "default",
    ]).isRequired,
    CustomOption: PropTypes.func,
    CustomControl: PropTypes.func,
    CustomNoOptionsMessage: PropTypes.func,
    CustomPlaceholder: PropTypes.func,
    CustomSingleValue: PropTypes.func,
    CustomMultiValue: PropTypes.func,
    CustomValueContainer: PropTypes.func,
};

Autocomplete.defaultProps = {
    variant: "default",
    controlShouldRenderValue: false,
    CustomOption: Option,
    CustomControl: Control,
    CustomNoOptionsMessage: NoOptionsMessage,
    CustomPlaceholder: Placeholder,
    CustomSingleValue: SingleValue,
    CustomMultiValue: MultiValue,
    CustomValueContainer: ValueContainer,
};

export default withStyles(styles)(Autocomplete);
