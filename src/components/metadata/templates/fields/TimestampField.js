/**
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";
import FormTimestampField from "components/forms/FormTimestampField";

const TimestampField = ({
    attribute,
    avu,
    avuFieldName,
    writable,
    ...props
}) => {
    const { t } = useTranslation("metadata");

    return (
        <FastField
            name={`${avuFieldName}.value`}
            component={FormTimestampField}
            label={attribute.name}
            required={attribute.required && writable}
            inputProps={{ readOnly: !writable }}
            validate={(value) => {
                if (attribute.required && !value) {
                    return t("required");
                }

                if (!Date.parse(value)) {
                    return t("templateValidationErrMsgTimestamp");
                }
            }}
            {...props}
        />
    );
};

export default TimestampField;
