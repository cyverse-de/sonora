/**
 * A form component for editing an App input parameter `format` property.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import ids from "../ids";

import FileInfoTypes from "components/models/FileInfoTypes";

import { build as buildID, FormTextField } from "@cyverse-de/ui-lib";

import { MenuItem } from "@material-ui/core";

export default function FileInfoTypesSelector(props) {
    const { baseId, fieldName, label } = props;

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.FILE_INFO_TYPE)}
            name={`${fieldName}.file_info_type`}
            label={label}
            component={FormTextField}
            select
            variant="outlined"
            margin="normal"
            size="small"
        >
            {Object.values(FileInfoTypes).map((infoType) => (
                <MenuItem key={infoType} value={infoType}>
                    {infoType}
                </MenuItem>
            ))}
        </FastField>
    );
}
