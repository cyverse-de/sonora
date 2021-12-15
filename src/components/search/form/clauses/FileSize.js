/**
 * @author aramsey
 *
 * The clause for handling file size ranges for an advanced data search.
 *
 * The components are laid out so that users can enter in a value and then
 * select a unit (KB, MB, etc.) to associate with that value.  On submission,
 * these 2 separate values are merged into a string for the query (e.g. "2MB")
 */
import React from "react";

import { Grid, MenuItem } from "@material-ui/core";
import { FastField } from "formik";

import { FormNumberField, FormTextField } from "components/forms/FormField";
import buildID from "components/utils/DebugIDUtil";
import { minValue } from "components/utils/validations";
import { useTranslation } from "i18n";
import ids from "../ids";

const SIZE_TYPE = "size";
const SIZE_ARGS_DEFAULT = {
    from: { value: "", unit: "KB" },
    to: { value: "", unit: "KB" },
};

// remove empty values, merge size and unit to one string
const formatFileSizeValues = (clause) => {
    // create copy of the clause, don't modify the original otherwise it
    // mutates the form
    let filteredValues = JSON.parse(JSON.stringify(clause));
    let args = filteredValues.args;

    if (!args.from.value && !args.to.value) {
        return null;
    }

    if (args.from.value) {
        filteredValues.args.from = `${args.from.value}${args.from.unit}`;
    } else {
        delete filteredValues.args.from;
    }
    if (args.to.value) {
        filteredValues.args.to = `${args.to.value}${args.to.unit}`;
    } else {
        delete filteredValues.args.to;
    }

    return filteredValues;
};

function FileSize(props) {
    const {
        parentId,
        field: { name },
    } = props;

    const { t } = useTranslation("search");

    return (
        <Grid container spacing={1}>
            <Grid item>
                <FastField
                    name={`${name}.from.value`}
                    helperText={t("fileSizeGreater")}
                    id={buildID(parentId, ids.FILE_SIZE_GREATER_VAL)}
                    validate={(value) => minValue(value, t)}
                    fullWidth={false}
                    component={FormNumberField}
                />
            </Grid>
            <Grid item>
                <FastField
                    name={`${name}.from.unit`}
                    id={buildID(parentId, ids.FILE_SIZE_GREATER_UNIT)}
                    label=""
                    component={SizeUnit}
                />
            </Grid>
            <Grid item>
                <FastField
                    name={`${name}.to.value`}
                    helperText={t("fileSizeLessThan")}
                    id={buildID(parentId, ids.FILE_SIZE_LESS_THAN_VAL)}
                    validate={(value) => minValue(value, t)}
                    fullWidth={false}
                    component={FormNumberField}
                />
            </Grid>
            <Grid item>
                <FastField
                    name={`${name}.to.unit`}
                    id={buildID(parentId, ids.FILE_SIZE_LESS_THAN_UNIT)}
                    label=""
                    component={SizeUnit}
                />
            </Grid>
        </Grid>
    );
}

const sizesList = [
    { label: "KiB", value: "KB" },
    { label: "MiB", value: "MB" },
    {
        label: "GiB",
        value: "GB",
    },
    { label: "TiB", value: "TB" },
];

function SizeUnit(props) {
    return (
        <FormTextField select variant="outlined" fullWidth={false} {...props}>
            {sizesList.map((item, index) => {
                return (
                    <MenuItem key={index} value={item.value} id={item}>
                        {item.label}
                    </MenuItem>
                );
            })}
        </FormTextField>
    );
}

export default FileSize;
export { SIZE_ARGS_DEFAULT, SIZE_TYPE, formatFileSizeValues };
