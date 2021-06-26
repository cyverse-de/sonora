/**
 * @author psarando
 */
import React from "react";

import Link from "next/link";

import { useTranslation } from "i18n";
import ids from "../ids";
import NavigationConstants from "common/NavigationConstants";

import { build } from "@cyverse-de/ui-lib";

import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { Add as CreateAppIcon } from "@material-ui/icons";

const CreateAppMenuItem = React.forwardRef((props, ref) => {
    const { baseId } = props;

    const { t } = useTranslation("apps");

    return (
        <Link href={NavigationConstants.NEW_APP}>
            <MenuItem ref={ref} id={build(baseId, ids.CREATE_APP_MENU_ITEM)}>
                <ListItemIcon>
                    <CreateAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("createApp")} />
            </MenuItem>
        </Link>
    );
});

export default CreateAppMenuItem;
