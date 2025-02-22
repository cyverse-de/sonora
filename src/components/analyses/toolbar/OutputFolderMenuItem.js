/**
 * @author sriram
 *
 * A dot menuitem for navigating to output folder from Analyses View.
 *
 */

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { PermMedia as OutputFolderIcon } from "@mui/icons-material";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import React from "react";
import ids from "../ids";
import { isTerminated } from "../utils";

const OutputFolderMenuItem = React.forwardRef(function OutputFolderMenuItem(
    props,
    ref
) {
    const {
        baseId,
        onClick,
        onClose,
        href,
        analysis,
        setPendingTerminationDlgOpen,
    } = props;
    const { t } = useTranslation("analyses");
    const terminated = isTerminated(analysis);
    return (
        <MenuItem
            id={buildID(baseId, ids.MENUITEM_GO_TO_FOLDER)}
            href={href}
            onClick={(event) => {
                if (terminated) {
                    onClick(event);
                } else {
                    onClose();
                    setPendingTerminationDlgOpen(true);
                }
            }}
            ref={ref}
        >
            <ListItemIcon>
                <OutputFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("goOutputFolder")} />
        </MenuItem>
    );
});

export { OutputFolderMenuItem };
