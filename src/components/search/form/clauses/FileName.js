import React from "react";

import { Field } from "formik";

import { FormTextField } from "components/forms/FormField";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import ids from "../ids";

const LABEL_TYPE = "label";
const LABEL_ARGS_DEFAULT = { label: "", exact: false };

function FileName(props) {
    const {
        parentId,
        field: { name },
    } = props;

    const { t } = useTranslation("search");

    return (
        <Field
            name={`${name}.label`}
            fullWidth={false}
            placeholder={t("fileNamePlaceholder")}
            id={buildID(parentId, ids.FILE_NAME)}
            component={FormTextField}
        />
    );
}

export default FileName;
export { LABEL_ARGS_DEFAULT, LABEL_TYPE };
