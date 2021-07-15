/**
 * @author psarando
 */
import React from "react";

import getFormError from "./getFormError";

import TextField from "@material-ui/core/TextField";

const FormTextField = ({
    field,
    label,
    helperText,
    required,
    form: { touched, errors },
    ...custom
}) => {
    const errorMsg = getFormError(field.name, touched, errors);
    return (
        <TextField
            label={label}
            error={!!errorMsg}
            helperText={errorMsg || helperText}
            required={required}
            variant="outlined"
            margin="dense"
            fullWidth
            {...field}
            {...custom}
        />
    );
};

export default FormTextField;
