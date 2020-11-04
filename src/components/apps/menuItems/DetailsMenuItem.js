import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { Info } from "@material-ui/icons";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { useTranslation } from "i18n";

import ids from "../ids";

function DetailsMenuItem(props) {
    const { baseId, onDetailsSelected, onClose } = props;
    const { t } = useTranslation("apps");

    return (
        <MenuItem
            key={build(baseId, ids.DETAILS_MENU_ITEM)}
            id={build(baseId, ids.DETAILS_MENU_ITEM)}
            onClick={() => {
                onClose();
                onDetailsSelected();
            }}
        >
            <ListItemIcon>
                <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("details")} />
        </MenuItem>
    );
}

export default DetailsMenuItem;
