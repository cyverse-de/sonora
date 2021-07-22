/**
 * @author psarando
 */
import React from "react";
import FormCheckbox from "./FormCheckbox";

const FormCheckboxStringValue = ({
    field: { value, onChange, ...field },
    form: { setFieldValue, ...form },
    ...custom
}) => (
    <FormCheckbox
        checked={value && value !== "false"}
        onChange={(event, checked) => {
            setFieldValue(field.name, checked ? "true" : "false");
        }}
        field={field}
        form={form}
        {...custom}
    />
);

export default FormCheckboxStringValue;
