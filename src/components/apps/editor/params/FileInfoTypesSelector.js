/**
 * A form component for editing an App input parameter `format` property.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../ids";
import { useAppElementInfoTypes } from "../../queries";

import {
    build as buildID,
    FormFieldLoading,
    FormTextField,
} from "@cyverse-de/ui-lib";

import { MenuItem } from "@material-ui/core";

export default function FileInfoTypesSelector(props) {
    const { baseId, disabled, fieldName, label } = props;

    const [infoTypes, setInfoTypes] = React.useState([]);

    const { isFetching } = useAppElementInfoTypes(true, setInfoTypes);

    const { t } = useTranslation("app_editor");

    const selectProps = {
        id: buildID(baseId, ids.PARAM_FIELDS.FILE_INFO_TYPE),
        name: `${fieldName}.file_info_type`,
        label,
        disabled,
    };

    if (isFetching) {
        return <FastField component={FormFieldLoading} {...selectProps} />;
    } else if (!infoTypes?.length) {
        selectProps.error = true;
        selectProps.helperText = t("errorLoadingInfoTypes");
    }

    return (
        <FastField
            component={FormTextField}
            select
            variant="outlined"
            margin="normal"
            size="small"
            {...selectProps}
        >
            {Object.values(infoTypes).map((infoType) => (
                <MenuItem key={infoType.id} value={infoType.name}>
                    {infoType.label}
                </MenuItem>
            ))}
        </FastField>
    );
}
