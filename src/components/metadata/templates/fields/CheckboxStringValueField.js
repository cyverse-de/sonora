/**
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import FormCheckboxStringValue from "components/forms/FormCheckboxStringValue";

const CheckboxStringValueField = ({
    attribute,
    avu,
    avuFieldName,
    writable,
    ...props
}) => {
    return (
        <FastField
            name={`${avuFieldName}.value`}
            component={FormCheckboxStringValue}
            label={attribute.name}
            disabled={!writable}
            {...props}
        />
    );
};

export default CheckboxStringValueField;
