/**
 * @author psarando
 */
import React from "react";

import getFormError from "./getFormError";

import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

// Apparently only necessary for FastField, but maybe more correct for "vanilla" Field as well.
const onCheckboxChange = (setFieldValue, fieldName) => (event, checked) => {
    setFieldValue(fieldName, checked);
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
                        onChange={onCheckboxChange(setFieldValue, field.name)}
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
