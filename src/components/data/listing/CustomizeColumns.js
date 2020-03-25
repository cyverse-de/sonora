/**
 * @author aramsey
 *
 * A Menu component which allows users to select which columns
 * they wish to have displayed in the Data view
 */

import React, { useState } from "react";

import { build, formatMessage, withI18N } from "@cyverse-de/ui-lib";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@material-ui/core";
import { Check, Settings } from "@material-ui/icons";
import { injectIntl } from "react-intl";

import ids from "../ids";
import messages from "../messages";

function CustomizeColumns(props) {
    const {
        baseId,
        allTableColumns,
        displayColumns,
        setDisplayColumns,
        intl,
    } = props;

    const [columnSettingEl, setColumnSettingEl] = useState(null);
    const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

    const isDisplayColumn = (key) => {
        return Boolean(displayColumns.find((colKey) => colKey === key));
    };

    const handleColumnSettingClick = (event) => {
        setColumnSettingEl(event.currentTarget);
        setColumnSettingsOpen(true);
    };

    const handleColumnSettingClose = () => {
        setColumnSettingsOpen(false);
    };

    const onColumnSelected = (selectedColumn) => {
        if (isDisplayColumn(selectedColumn.key)) {
            // Remove column
            setDisplayColumns(
                displayColumns.filter((key) => key !== selectedColumn.key)
            );
        } else {
            // Add column
            const newDisplayColumns = [...displayColumns];
            newDisplayColumns.splice(
                displayColumns.length - 1,
                0,
                selectedColumn.key
            );
            setDisplayColumns(newDisplayColumns);
        }
    };

    const menuId = build(baseId, ids.CUSTOM_COLS);

    return (
        <>
            <IconButton
                aria-label={formatMessage(intl, "ariaCustomCols")}
                aria-controls={menuId}
                aria-haspopup="true"
                size="small"
                onClick={handleColumnSettingClick}
            >
                <Settings />
            </IconButton>
            <Menu
                id={menuId}
                anchorEl={columnSettingEl}
                open={columnSettingsOpen}
                onClose={handleColumnSettingClose}
            >
                {allTableColumns.map((col) => (
                    <MenuItem
                        key={col.key}
                        id={build(menuId, col.key)}
                        onClick={() => {
                            onColumnSelected(col);
                        }}
                    >
                        {isDisplayColumn(col.key) && (
                            <ListItemIcon>
                                <Check />
                            </ListItemIcon>
                        )}
                        {col.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default withI18N(injectIntl(CustomizeColumns), messages);
