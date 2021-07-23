/**
 * @author psarando
 */
import React from "react";

import Autocomplete from '@material-ui/lab/Autocomplete';

import getFormError from "./getFormError";

import FormControl from "@material-ui/core/FormControl";
import TextField from '@material-ui/core/TextField';
import FormHelperText from "@material-ui/core/FormHelperText";

const FormSearchField = ({
    field: { value, onBlur, onChange, ...field },
    label,
    helperText,
    required,
    options,
    size = "small",
    renderCustomOption,
    handleSearch,
    form: { touched, errors, setFieldTouched, setFieldValue },
    ...props
}) => {
    const errorMsg = getFormError(field.name, touched, errors);
    const onOptionSelected = (event, option, reason) => {
        setFieldValue(field.name, option ? option?.label : "");
    };
    return (
        <FormControl fullWidth error={!!errorMsg}>
            <Autocomplete
                id="searchField"
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => option.label}
                options={options}
                value={value}
                size={size}
                freeSolo={true}
                onInputChange={handleSearch}
                onChange={onOptionSelected}
                renderOption={(option, state) => renderCustomOption(option)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={helperText}
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                        }}
                    />
                )}
            />
            <FormHelperText>{errorMsg || helperText}</FormHelperText>
        </FormControl>
    );
};

export default FormSearchField;
