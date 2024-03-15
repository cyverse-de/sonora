/**
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";
import FormTextField from "components/forms/FormTextField";

const TextField = ({ attribute, avu, avuFieldName, writable, ...props }) => {
    const { t } = useTranslation("metadata");

    return (
        <FastField
            name={`${avuFieldName}.value`}
            component={FormTextField}
            multiline
            label={attribute.name}
            required={attribute.required && writable}
            inputProps={{ readOnly: !writable }}
            validate={(value) => {
                if (attribute.required && !value) {
                    return t("required");
                }
            }}
            {...props}
        />
    );
};

export default TextField;
