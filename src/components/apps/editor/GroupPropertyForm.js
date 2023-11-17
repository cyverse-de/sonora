/**
 * A form component for editing App group labels.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

import { Button, Card, CardActions } from "@mui/material";

export default function GroupPropertyForm(props) {
    const { baseId, fieldName, onDone } = props;

    const { t } = useTranslation(["app_editor", "common"]);

    return (
        <Card>
            <CardActions>
                <FastField
                    id={buildID(baseId, ids.GROUP, ids.PARAM_FIELDS.LABEL)}
                    name={`${fieldName}.label`}
                    label={t("sectionLabel")}
                    component={FormTextField}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            onDone();
                        }
                    }}
                />
                <Button
                    id={buildID(baseId, fieldName, ids.BUTTONS.CLOSE_BTN)}
                    color="primary"
                    variant="contained"
                    onClick={onDone}
                >
                    {t("common:done")}
                </Button>
            </CardActions>
        </Card>
    );
}
