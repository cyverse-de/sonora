import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import { Divider, ListItemIcon, MenuItem, Select } from "@mui/material";
import { Check, Delete } from "@mui/icons-material";

import { useTranslation } from "i18n";
import { SharingPermissions } from "components/models/Permissions";

const REMOVE = "remove";

function SharingPermissionSelector(props) {
    const {
        baseId,
        currentPermission,
        onPermissionChange,
        onRemoveSelected,
        ...rest
    } = props;
    const { t } = useTranslation("sharing");

    const [open, setOpen] = useState(false);

    const onClose = () => setOpen(false);
    const onOpen = () => setOpen(true);
    const isVaried = currentPermission === SharingPermissions.VARIES;

    const onSelectionChange = (event) => {
        const selection = event.target.value;
        selection === REMOVE
            ? onRemoveSelected()
            : onPermissionChange(selection);
    };

    return (
        <Select
            id={baseId}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            value={currentPermission}
            renderValue={() => t(currentPermission)}
            onChange={onSelectionChange}
            {...rest}
        >
            <MenuItem
                key={SharingPermissions.READ}
                value={SharingPermissions.READ}
                id={buildID(baseId, SharingPermissions.READ)}
                onClick={onClose}
            >
                <ListItemIcon>
                    {SharingPermissions.READ === currentPermission && (
                        <Check fontSize="small" />
                    )}
                </ListItemIcon>
                {t(SharingPermissions.READ)}
            </MenuItem>
            <MenuItem
                key={SharingPermissions.WRITE}
                value={SharingPermissions.WRITE}
                id={buildID(baseId, SharingPermissions.WRITE)}
                onClick={onClose}
            >
                <ListItemIcon>
                    {SharingPermissions.WRITE === currentPermission && (
                        <Check fontSize="small" />
                    )}
                </ListItemIcon>
                {t(SharingPermissions.WRITE)}
            </MenuItem>
            <MenuItem
                key={SharingPermissions.OWN}
                value={SharingPermissions.OWN}
                id={buildID(baseId, SharingPermissions.OWN)}
                onClick={onClose}
            >
                <ListItemIcon>
                    {SharingPermissions.OWN === currentPermission && (
                        <Check fontSize="small" />
                    )}
                </ListItemIcon>
                {t(SharingPermissions.OWN)}
            </MenuItem>
            {isVaried && (
                <MenuItem
                    key={SharingPermissions.VARIES}
                    value={SharingPermissions.VARIES}
                    id={buildID(baseId, SharingPermissions.VARIES)}
                    onClick={onClose}
                >
                    <ListItemIcon>
                        {SharingPermissions.VARIES === currentPermission && (
                            <Check fontSize="small" />
                        )}
                    </ListItemIcon>
                    {t("varies")}
                </MenuItem>
            )}
            <Divider />
            <MenuItem
                key={REMOVE}
                value={REMOVE}
                id={buildID(baseId, REMOVE)}
                onClick={onClose}
            >
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                <em>{t(REMOVE)}</em>
            </MenuItem>
        </Select>
    );
}

export default SharingPermissionSelector;
