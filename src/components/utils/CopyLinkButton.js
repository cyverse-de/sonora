/**
 * @author sriram
 *
 * A common CopyLink menu item to use across Data and Apps
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import { build } from "@cyverse-de/ui-lib";
import { IconButton, Tooltip } from "@material-ui/core";
import { FileCopy } from "@material-ui/icons";
import ids from "./ids";

export default function CopyLinkButton(props) {
    const { baseId, onCopyLinkSelected } = props;
    const { t } = useTranslation("util");

    return (
        <Tooltip title={t("copyLink")} aria-label={t("copyLink")}>
            <IconButton
                id={build(baseId, ids.COPY_LINK_BUTTON)}
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
