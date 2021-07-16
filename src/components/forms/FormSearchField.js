/**
 * @author psarando
 */
import React from "react";

import Autocomplete from "../../components/autocomplete/Autocomplete";

import getFormError from "./getFormError";

import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

const FormSearchField = ({
    field: { value, onBlur, onChange, ...field },
    label,
    helperText,
    required,
    form: { touched, errors, setFieldTouched, setFieldValue },
    ...props
}) => {
    const errorMsg = getFormError(field.name, touched, errors);
    const onOptionSelected = (option) => {
        setFieldValue(field.name, option ? option[props.valueKey] : "");
    };
    const onSearchBlur = (event) => {
        setFieldTouched(field.name, true);
    };

    return (
        <FormControl fullWidth error={!!errorMsg}>
            <Autocomplete
                label={label}
                controlShouldRenderValue
                isClearable={!required}
                cacheOptions
                defaultInputValue={value}
                onChange={onOptionSelected}
                onBlur={onSearchBlur}
                {...field}
                {...props}
            />
            <FormHelperText>{errorMsg || helperText}</FormHelperText>
        </FormControl>
    );
};

export default FormSearchField;
