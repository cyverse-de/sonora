/**
 * @author psarando
 */
import React from "react";

import { onCheckboxChange } from "./FormCheckbox";
import getFormError from "./getFormError";

import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    Switch,
} from "@mui/material";

const FormSwitch = (props) => {
    const {
        label,
        helperText,
        field: { value, onChange, ...field },
        form: { touched, errors, setFieldValue },
        ...custom
    } = props;

    const errorMsg = getFormError(field.name, touched, errors);

    return (
        <FormControl variant="standard" error={!!errorMsg}>
            <FormControlLabel
                control={
                    <Switch
                        checked={!!value}
                        onChange={onCheckboxChange(
                            setFieldValue,
                            field.name,
                            custom.inputProps?.readOnly
                        )}
                        {...field}
                        {...custom}
                    />
                }
                label={label}
            />
            <FormHelperText>{errorMsg || helperText}</FormHelperText>
        </FormControl>
    );
};

export default FormSwitch;
