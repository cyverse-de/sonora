/**
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";
import FormTextField from "components/forms/FormTextField";
import { MenuItem } from "@mui/material";

const EnumField = ({ attribute, avu, avuFieldName, writable, ...props }) => {
    const { t } = useTranslation("metadata");

    return (
        <FastField
            name={`${avuFieldName}.value`}
            component={FormTextField}
            select
            label={attribute.name}
            required={attribute.required && writable}
            inputProps={{ readOnly: !writable }}
            validate={(value) => {
                if (attribute.required && !value) {
                    return t("required");
                }
            }}
            {...props}
        >
            {attribute.values &&
                attribute.values.map((enumVal, index) => (
                    <MenuItem key={index} value={enumVal.value}>
                        {enumVal.value}
                    </MenuItem>
                ))}
        </FastField>
    );
};

export default EnumField;
