/**
 * A component for editing top-level App info (name, description, tool).
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";
import { Trans } from "react-i18next";

import { useTranslation } from "i18n";

import ids from "./ids";

import ToolSelectionDialog from "components/tools/ToolSelectionDialog";

import buildID from "components/utils/DebugIDUtil";
import FormMultilineTextField from "components/forms/FormMultilineTextField";
import FormTextField from "components/forms/FormTextField";

import { Button, InputAdornment } from "@material-ui/core";
import { Build as SelectToolIcon } from "@material-ui/icons";

/**
 * An Input Selector form field for picking data store file or folder paths.
 */
const ToolSelector = ({ publicOnly, ...props }) => {
    // These props need to be spread down into the FormTextField
    const { id, disabled, field, form } = props;
    const { setFieldValue } = form;

    const [open, setOpen] = React.useState(false);

    const { t } = useTranslation(["app_editor", "common"]);

    return (
        <FormTextField
            InputProps={{
                readOnly: true,
                value: field.value?.name || "",
                endAdornment: !disabled && (
                    <InputAdornment position="end">
                        <Button
                            id={buildID(id, ids.BUTTONS.SELECT_TOOL)}
                            aria-label={t("selectTool")}
                            color="primary"
                            size="small"
                            variant="outlined"
                            startIcon={<SelectToolIcon />}
                            onClick={() => setOpen(true)}
                        >
                            {t("common:select")}
                        </Button>
                        <ToolSelectionDialog
                            open={open}
                            publicOnly={publicOnly}
                            onClose={() => setOpen(false)}
                            onConfirm={(tool) => {
                                if (tool) {
                                    setOpen(false);
                                    setFieldValue(field.name, tool);
                                }
                            }}
                        />
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    );
};

export default function AppInfo(props) {
    const { baseId, cosmeticOnly, isPublic } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    return (
        <>
            <FastField
                id={buildID(baseId, ids.APP_NAME)}
                name="name"
                label={t("appName")}
                required
                component={FormTextField}
                disabled={cosmeticOnly}
            />
            <FastField
                id={buildID(baseId, ids.APP_VERSION)}
                name="version"
                label={t("appVersion")}
                required
                component={FormTextField}
            />
            <FastField
                id={buildID(baseId, ids.APP_DESCRIPTION)}
                name="description"
                label={t("appDescription")}
                required
                component={FormMultilineTextField}
            />
            <FastField
                id={buildID(baseId, ids.TOOL)}
                name="tools.0"
                label={t("toolUsed")}
                helperText={
                    <Trans
                        t={t}
                        i18nKey={"app_editor_help:ToolUsed"}
                        components={{
                            b: <b />,
                            br: <br />,
                            i: <i />,
                        }}
                    />
                }
                component={ToolSelector}
                disabled={cosmeticOnly}
                publicOnly={isPublic}
            />
        </>
    );
}
