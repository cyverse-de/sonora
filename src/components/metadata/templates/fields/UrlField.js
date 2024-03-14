/**
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import FormTextField from "components/forms/FormTextField";
import { urlField } from "components/utils/validations";

const UrlField = ({ attribute, avu, avuFieldName, writable, ...props }) => {
    const { t } = useTranslation("metadata");
    const { i18nUtil } = useTranslation("util");

    return (
        <FastField
            name={`${avuFieldName}.value`}
            component={FormTextField}
            label={attribute.name}
            required={attribute.required && writable}
            inputProps={{ readOnly: !writable }}
            validate={(value) => {
                return attribute.required && !value
                    ? t("required")
                    : urlField(value, i18nUtil, attribute.required);
            }}
            {...props}
        />
    );
};

export default UrlField;
