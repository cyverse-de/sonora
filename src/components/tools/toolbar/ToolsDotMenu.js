/**
 * @author sriram
 *
 * A dot menu for Tools View.
 *
 */

import React from "react";
import { useTranslation } from "i18n";

import ids from "../ids";

import { build, DotMenu } from "@cyverse-de/ui-lib";

import {
    Hidden,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from "@material-ui/core";

import { Info } from "@material-ui/icons";

function DotMenuItems(props) {
    const { baseId, onDetailsSelected, isSingleSelection, onClose } = props;

    const { t } = useTranslation("tools");

    return [
        <Hidden mdUp>
            {isSingleSelection && (
                <MenuItem
                    key={build(baseId, ids.MENUITEM_DETAILS)}
                    id={build(baseId, ids.MENUITEM_DETAILS)}
                    onClick={() => {
                        onClose();
                        onDetailsSelected();
                    }}
                >
                    <ListItemIcon>
                        <Info fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t("detailsLbl")} />
                </MenuItem>
            )}
        </Hidden>,
    ];
}

export default function ToolsDotMenu({ ButtonProps, ...props }) {
    const { baseId, isSingleSelection, onDetailsSelected } = props;
    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={ButtonProps}
            render={(onClose) => (
                <DotMenuItems
                    isSingleSelection={isSingleSelection}
                    onClose={onClose}
                    onDetailsSelected={onDetailsSelected}
                />
            )}
        />
    );
}
