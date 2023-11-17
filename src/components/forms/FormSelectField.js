/**
 * @author psarando
 */
import React from "react";

import getFormError from "./getFormError";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

const FormSelectField = ({
    id,
    field: { value, ...field },
    label,
    helperText,
    required,
    form: { touched, errors },
    children,
    fullWidth,
    ...custom
}) => {
    const errorMsg = getFormError(field.name, touched, errors);
    return (
        <FormControl
            variant="standard"
            fullWidth={fullWidth}
            error={!!errorMsg}
        >
            <InputLabel htmlFor={id} required={required}>
                {label}
            </InputLabel>
            <Select id={id} value={value || ""} {...field} {...custom}>
                {children}
            </Select>
            <FormHelperText>{errorMsg || helperText}</FormHelperText>
        </FormControl>
    );
};

FormSelectField.defaultProps = {
    fullWidth: true,
};

export default FormSelectField;
