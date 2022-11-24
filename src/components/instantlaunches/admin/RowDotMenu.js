import React from "react";

import DotMenu from "components/dotMenu/DotMenu";

import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Home as HomeIcon,
    LabelImportant as NestedIcon,
    MenuOutlined,
} from "@material-ui/icons";

const RowDotMenu = (props) => {
    const {
        baseId,
        dashboardActionId,
        dashboardAction,
        dashboardLabel,
        navDrawerActionId,
        navDrawerAction,
        navDrawerLabel,
        listingActionId,
        listingAction,
        listingLabel,
        deleteActionId,
        deleteAction,
        deleteLabel,
    } = props;

    return (
        <DotMenu
            baseId={baseId}
            render={(onClose) => [
                <MenuItem
                    key={listingActionId}
                    id={listingActionId}
                    onClick={() => {
                        onClose();
                        listingAction();
                    }}
                >
                    <ListItemIcon>
                        <NestedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={listingLabel} />
                </MenuItem>,
                <MenuItem
                    key={dashboardActionId}
                    id={dashboardActionId}
                    onClick={() => {
                        onClose();
                        dashboardAction();
                    }}
                >
                    <ListItemIcon>
                        <HomeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={dashboardLabel} />
                </MenuItem>,
                <MenuItem
                    key={navDrawerActionId}
                    id={navDrawerActionId}
                    onClick={() => {
                        onClose();
                        navDrawerAction();
                    }}
                >
                    <ListItemIcon>
                        <MenuOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={navDrawerLabel} />
                </MenuItem>,
                <MenuItem
                    key={deleteActionId}
                    id={deleteActionId}
                    onClick={() => {
                        onClose();
                        deleteAction();
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={deleteLabel} />
                </MenuItem>,
            ]}
        />
    );
};

export default RowDotMenu;
