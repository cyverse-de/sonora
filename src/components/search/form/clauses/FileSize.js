import React from "react";

import { Grid, MenuItem } from "@material-ui/core";
import { FastField } from "formik";

import { FormNumberField, FormSelectField } from "components/forms/FormField";
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
    let filteredValues = { ...clause };
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
                    label=" "
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
                    label=" "
                    component={SizeUnit}
                />
            </Grid>
        </Grid>
    );
}

const sizesList = ["KB", "MB", "GB", "TB"];

function SizeUnit(props) {
    const {
        field,
        form: { setFieldValue, ...form },
        ...rest
    } = props;
    return (
        <FormSelectField form={form} field={field} fullWidth={false} {...rest}>
            {sizesList.map((item, index) => {
                return (
                    <MenuItem key={index} value={item} id={item}>
                        {item}
                    </MenuItem>
                );
            })}
        </FormSelectField>
    );
}

export default FileSize;
export { SIZE_ARGS_DEFAULT, SIZE_TYPE, formatFileSizeValues };
