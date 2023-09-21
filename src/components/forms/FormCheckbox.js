/**
 * @author psarando
 */
import React from "react";

import getFormError from "./getFormError";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

/**
 * Creates an onChange function for use in a MUI Checkbox or Switch field,
 * which will use the given `setFieldValue` function to update the value of the
 * field with the given `fieldName`.
 *
 * @param {Function} setFieldValue Function that sets a value for `fieldName`.
 * @param {string} fieldName The `name` of the checkbox field to change.
 * @param {boolean} readOnly True if the field is read-only and should not change.
 * Checkbox and switch fields with a `readonly` attribute on their `input`
 * element will still allow the user to interact with it,
 * calling its onChange function.
 *
 * @returns An onChange function for use in a MUI Checkbox or Switch field.
 */
const onCheckboxChange =
    (setFieldValue, fieldName, readOnly) => (event, checked) => {
        if (!readOnly) {
            setFieldValue(fieldName, checked);
        }
    };

const FormCheckbox = ({
    label,
    helperText,
    field: { value, onChange, ...field },
    form: { touched, errors, setFieldValue },
    ...custom
}) => {
    const errorMsg = getFormError(field.name, touched, errors);

    return (
        <FormControl error={!!errorMsg}>
            <FormControlLabel
                control={
                    <Checkbox
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

export default FormCheckbox;
export { onCheckboxChange };
