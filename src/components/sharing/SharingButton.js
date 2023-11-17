/**
 * @author aramsey
 *
 * A button meant for controlling when the Sharing dialog opens
 */

import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { Button } from "@mui/material";
import { Share } from "@mui/icons-material";

import { useTranslation } from "i18n";
import ids from "./ids";

function SharingButton(props) {
    const { baseId, setSharingDlgOpen, size = "medium", margin = 1 } = props;
    const { t } = useTranslation("sharing");

    return (
        <Button
            id={buildID(baseId, ids.BUTTONS.SHARE)}
            variant="outlined"
            disableElevation
            color="primary"
            size={size}
            onClick={() => setSharingDlgOpen(true)}
            startIcon={<Share />}
            style={{ margin }}
        >
            {t("share")}
        </Button>
    );
}

export default SharingButton;
