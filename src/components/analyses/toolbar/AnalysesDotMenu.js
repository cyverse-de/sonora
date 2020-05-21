/**
 * @author sriram
 *
 * A dot menu for Analyses View.
 *
 */

import React from "react";

import ids from "../ids";
import messages from "../messages";

import { build, DotMenu, getMessage, withI18N } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";

import { Info } from "@material-ui/icons";

function AnalysesDotMenu(props) {
    const { baseId, ButtonProps, onDetailsSelected, detailsEnabled } = props;
    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={ButtonProps}
            render={(onClose) => [
                detailsEnabled && (
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
                        <ListItemText primary={getMessage("details")} />
                    </MenuItem>
                ),
            ]}
        />
    );
}
export default withI18N(AnalysesDotMenu, messages);
