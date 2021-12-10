/**
 * @author aramsey
 *
 * The clause for handling searching for a file name within an advanced
 * data search.
 *
 * By default, the name is set to a "contains" search with `exact: false` set
 * in `LABEL_ARGS_DEFAULT`
 * e.g. searching for "test" will yield any file whose name contains "test"
 */
import React from "react";

import { FastField } from "formik";

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
        <FastField
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
