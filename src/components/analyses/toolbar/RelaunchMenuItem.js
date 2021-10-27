/**
 * @author sriram
 *
 * A dot menuitem for relaunching an analysis from Analyses View.
 *
 */

import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { Repeat as RelaunchIcon } from "@material-ui/icons";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import React from "react";
import ids from "../ids";

const RelaunchMenuItem = React.forwardRef((props, ref) => {
    const { baseId, onClick, href } = props;
    const { t } = useTranslation("analyses");
    return (
        <MenuItem
            key={buildID(baseId, ids.MENUITEM_RELAUNCH)}
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
