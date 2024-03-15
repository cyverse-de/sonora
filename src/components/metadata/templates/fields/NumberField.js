/**
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";
import FormNumberField from "components/forms/FormNumberField";

const NumberField = ({ attribute, avu, avuFieldName, writable, ...props }) => {
    const { t } = useTranslation("metadata");

    return (
        <FastField
            name={`${avuFieldName}.value`}
            component={FormNumberField}
            label={attribute.name}
            required={attribute.required && writable}
            inputProps={{ readOnly: !writable }}
            validate={(value) => {
                if (attribute.required && !value && value !== 0.0) {
                    return t("required");
                }

                if (isNaN(Number(value))) {
                    return t("templateValidationErrMsgNumber");
                }
            }}
            {...props}
        />
    );
};

export default NumberField;
