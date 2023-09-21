/**
 * @author sriram
 *
 * A common CopyLink menu item to use across Data and Apps
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import buildID from "components/utils/DebugIDUtil";
import { IconButton, Tooltip } from "@mui/material";
import { FileCopy } from "@mui/icons-material";
import ids from "./ids";

export default function CopyLinkButton(props) {
    const { baseId, onCopyLinkSelected } = props;
    const { t } = useTranslation("util");

    return (
        <Tooltip title={t("copyDELink")} aria-label={t("copyDELink")}>
            <IconButton
                id={buildID(baseId, ids.COPY_LINK_BUTTON)}
                onClick={() => {
                    onCopyLinkSelected();
                }}
                size="small"
            >
                <FileCopy fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}
