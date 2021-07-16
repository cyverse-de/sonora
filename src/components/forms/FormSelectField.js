/**
 * @author psarando
 */
import React from "react";

import getFormError from "./getFormError";

import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

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
        <FormControl fullWidth={fullWidth} error={!!errorMsg}>
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
