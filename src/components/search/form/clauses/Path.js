/**
 * @author aramsey
 *
 * The clause for handling selecting a parent path in an advanced data search.
 *
 * Results are not exclusive to that path, all sub-folders will be included
 * in the search.
 */
import React from "react";

import { FastField } from "formik";

import { FormTextField } from "components/forms/FormField";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import ids from "../ids";

const PATH_TYPE = "path";
const PATH_ARGS_DEFAULT = { prefix: "" };

function Path(props) {
    const {
        parentId,
        field: { name },
    } = props;

    const { t } = useTranslation("search");

    return (
        <FastField
            name={`${name}.prefix`}
            fullWidth={false}
            placeholder={t("pathPlaceholder")}
            id={buildID(parentId, ids.PATH_PREFIX)}
            component={FormTextField}
        />
    );
}

export default Path;
export { PATH_ARGS_DEFAULT, PATH_TYPE };
