/**
 * @author psarando
 */
import React from "react";

import Link from "next/link";

import { useTranslation } from "i18n";
import ids from "../ids";
import NavigationConstants from "common/NavigationConstants";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Add as CreateAppIcon } from "@mui/icons-material";

const CreateAppMenuItem = React.forwardRef((props, ref) => {
    const { baseId } = props;

    const { t } = useTranslation("apps");

    return (
        <Link href={NavigationConstants.NEW_APP} legacyBehavior>
            <MenuItem ref={ref} id={buildID(baseId, ids.CREATE_APP_MENU_ITEM)}>
                <ListItemIcon>
                    <CreateAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("createApp")} />
            </MenuItem>
        </Link>
    );
});

export default CreateAppMenuItem;
