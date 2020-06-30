/**
 * @author sriram
 *
 * A dot menu intended for the Apps view.
 */

import React from "react";
import ids from "../ids";
import messages from "../messages";

import { build, DotMenu, getMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { FilterList, Info } from "@material-ui/icons";

function AppsDotMenu(props) {
    const {
        baseId,
        ButtonProps,
        detailsEnabled,
        onDetailsSelected,
        onFilterSelected,
    } = props;
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                render={(onClose) => [
                    detailsEnabled && (
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
                            <ListItemText primary={getMessage("details")} />
                        </MenuItem>
                    ),
                    matches && (
                        <MenuItem
                            key={build(baseId, ids.FILTER_MENU_ITEM)}
                            id={build(baseId, ids.FILTER_MENU_ITEM)}
                            onClick={() => {
                                onClose();
                                onFilterSelected();
                            }}
                        >
                            <ListItemIcon>
                                <FilterList fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={getMessage("filterLbl")} />
                        </MenuItem>
                    ),
                ]}
            />
        </>
    );
}

export default withI18N(AppsDotMenu, messages);
