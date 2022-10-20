/**
 * Field for selecting an app's available versions.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

import { MenuItem, TextField } from "@material-ui/core";

export default function VersionSelection({
    baseId,
    version_id,
    versions,
    onChange,
    dirty = false,
    ...props
}) {
    const { t } = useTranslation(["apps", "common"]);

    const [showConfirmationDialog, setShowConfirmationDialog] =
        React.useState(false);
    const [selectedVersionId, setSelectedVersionId] = React.useState(null);

    return (
        <>
            <TextField
                id={buildID(baseId, ids.APP_VERSION_SELECTION)}
                label={t("Version")}
                select
                variant="outlined"
                size="small"
                margin="dense"
                fullWidth
                value={version_id}
                onChange={(event) => {
                    const versionId = event.target.value;
                    if (dirty) {
                        setShowConfirmationDialog(true);
                        setSelectedVersionId(versionId);
                    } else {
                        onChange && onChange(versionId);
                    }
                }}
                {...props}
            >
                {versions?.map((verInfo) => (
                    <MenuItem
                        key={verInfo.version_id}
                        value={verInfo.version_id}
                    >
                        {verInfo.version}
                    </MenuItem>
                ))}
            </TextField>
            <ConfirmationDialog
                open={showConfirmationDialog}
                title={t("common:confirmDiscardChangesDialogHeader")}
                contentText={t("common:confirmDiscardChangesDialogMsg")}
                confirmButtonText={t("common:discard")}
                onConfirm={() => onChange && onChange(selectedVersionId)}
                onClose={() => setShowConfirmationDialog(false)}
            />
        </>
    );
}
