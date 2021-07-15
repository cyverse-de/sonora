/**
 * @author psarando
 */
import React from "react";
import FormTextField from "./FormTextField";

const onNumberChange = (onChange) => (event) => {
    const newValue = event.target.value;
    let intVal = Number(newValue);
    if (!isNaN(intVal)) {
        onChange(event);
    }
};

const FormNumberField = ({ field: { onChange, ...field }, ...props }) => (
    <FormTextField
        type="number"
        step="any"
        onChange={onNumberChange(onChange)}
        field={field}
        {...props}
    />
);

export default FormNumberField;
