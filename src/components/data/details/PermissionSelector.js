/**
 * @author aramsey
 *
 * A basic Menu component for displaying permission options
 * See models/Permissions
 */

import React, { Fragment, useState } from "react";
import buildID from "components/utils/DebugIDUtil";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Check, Edit } from "@mui/icons-material";
import { useTranslation } from "i18n";

import ids from "../ids";
import Permissions from "../../models/Permissions";

function PermissionSelector(props) {
    const { baseId, currentPermission, onPermissionChange } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const { t } = useTranslation("data");

    const onEditClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleEditClose = () => {
        setAnchorEl(null);
    };

    const menuId = buildID(baseId, ids.PERMISSION_MENU);

    return (
        <>
            <IconButton
                id={buildID(baseId, ids.PERMISSION_MENU_BTN)}
                aria-controls={menuId}
                aria-haspopup={true}
                onClick={onEditClick}
                size="large"
            >
                <Edit />
            </IconButton>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                value={currentPermission}
                open={Boolean(anchorEl)}
                onClose={handleEditClose}
            >
                {Object.keys(Permissions).map((permissionKey) => {
                    const permissionValue = Permissions[permissionKey];
                    return (
                        <MenuItem
                            key={permissionKey}
                            id={buildID(menuId, ids[permissionKey])}
                            onClick={() => {
                                handleEditClose();
                                onPermissionChange(permissionValue);
                            }}
                        >
                            <ListItemIcon>
                                {permissionValue === currentPermission ? (
                                    <Check />
                                ) : (
                                    <Fragment />
                                )}
                            </ListItemIcon>
                            {t(permissionValue)}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}

export default PermissionSelector;
