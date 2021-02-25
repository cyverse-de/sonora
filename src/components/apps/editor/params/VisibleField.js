/**
 * A form component for editing the App parameter `isVisible` property.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../ids";

import { build as buildID, FormCheckbox } from "@cyverse-de/ui-lib";

export default function VisibleField(props) {
    const { baseId, fieldName } = props;

    const { t } = useTranslation("app_editor");

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.VISIBLE)}
            name={`${fieldName}.isVisible`}
            label={t("isVisible")}
            component={FormCheckbox}
        />
    );
}
