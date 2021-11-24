import React from "react";

import { MenuItem } from "@material-ui/core";
import { Field } from "formik";

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

function FileSize(props) {
    const {
        parentId,
        field: { name },
    } = props;

    const { t } = useTranslation("search");

    return (
        <>
            <Field
                name={`${name}.from.value`}
                helperText={t("fileSizeGreater")}
                id={buildID(parentId, ids.FILE_SIZE_GREATER_VAL)}
                validate={(value) => minValue(value, t)}
                fullWidth={false}
                component={FormNumberField}
            />
            <Field
                name={`${name}.from.unit`}
                id={buildID(parentId, ids.FILE_SIZE_GREATER_UNIT)}
                label=" "
                component={SizeUnit}
            />
            <Field
                name={`${name}.to.value`}
                helperText={t("fileSizeLessThan")}
                id={buildID(parentId, ids.FILE_SIZE_LESS_THAN_VAL)}
                validate={(value) => minValue(value, t)}
                fullWidth={false}
                component={FormNumberField}
            />
            <Field
                name={`${name}.to.unit`}
                id={buildID(parentId, ids.FILE_SIZE_LESS_THAN_UNIT)}
                label=" "
                component={SizeUnit}
            />
        </>
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
export { SIZE_ARGS_DEFAULT, SIZE_TYPE };
