/**
 * @author sriram
 *
 * A dot menuitem for relaunching an analysis from Analyses View.
 *
 */

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Repeat as RelaunchIcon } from "@mui/icons-material";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import React from "react";
import ids from "../ids";

const RelaunchMenuItem = React.forwardRef(function RelaunchMenuItem(
    props,
    ref
) {
    const { baseId, onClick, href } = props;
    const { t } = useTranslation("analyses");
    return (
        <MenuItem
            id={buildID(baseId, ids.MENUITEM_RELAUNCH)}
            href={href}
            onClick={onClick}
            ref={ref}
        >
            <ListItemIcon>
                <RelaunchIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("relaunch")} />
        </MenuItem>
    );
});

export { RelaunchMenuItem };
