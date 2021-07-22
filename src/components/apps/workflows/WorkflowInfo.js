/**
 * A component for editing top-level App info (name, description, tool).
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import FormMultilineTextField from "components/forms/FormMultilineTextField";

export default function WorkflowInfo(props) {
    const { baseId, cosmeticOnly } = props;

    const { t } = useTranslation("common");

    return (
        <>
            <FastField
                id={buildID(baseId, ids.WORKFLOW_NAME)}
                name="name"
                label={t("name")}
                required
                component={FormTextField}
                disabled={cosmeticOnly}
            />
            <FastField
                id={buildID(baseId, ids.WORKFLOW_DESCRIPTION)}
                name="description"
                label={t("description")}
                required
                component={FormMultilineTextField}
            />
        </>
    );
}
