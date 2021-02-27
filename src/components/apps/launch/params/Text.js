/**
 * Form field for displaying Text parameters.
 *
 * @author psarando
 */
import React from "react";

import { ValidatorTypes } from "components/models/AppParamTypes";

import { FormTextField } from "@cyverse-de/ui-lib";

export function getTextFieldInputProps(param) {
    const inputProps = {};
    if (param?.validators?.length > 0) {
        const charLimitValidator = param?.validators.find(
            (validator) => validator.type === ValidatorTypes.CHARACTER_LIMIT
        );
        if (charLimitValidator) {
            inputProps.maxLength = charLimitValidator.params[0];
        }
    }

    return inputProps;
}

export default function Text({ param, ...props }) {
    return (
        <FormTextField
            margin="normal"
            size="small"
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            inputProps={getTextFieldInputProps(param)}
            {...props}
        />
    );
}
