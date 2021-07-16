/**
 * @author psarando
 */
import React from "react";
import FormTextField from "./FormTextField";

const onIntegerChange = (onChange) => (event) => {
    const newValue = event.target.value;
    let intVal = Number(newValue);
    if (!isNaN(intVal) && Number.isInteger(intVal)) {
        onChange(event);
    }
};

const FormIntegerField = ({ field: { onChange, ...field }, ...props }) => (
    <FormTextField
        type="number"
        step={1}
        onChange={onIntegerChange(onChange)}
        field={field}
        {...props}
    />
);

export default FormIntegerField;
