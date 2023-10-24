/**
 * @author aramsey
 *
 * A Menu component which allows users to select which columns
 * they wish to have displayed in the Data view
 */

import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import DECheckbox from "components/utils/DECheckbox";

import {
    Button,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useTranslation } from "i18n";

import ids from "../ids";
import useBreakpoints from "components/layout/useBreakpoints";

function CustomizeColumns(props) {
    const { baseId, allTableColumns, displayColumns, setDisplayColumns } =
        props;
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const { t } = useTranslation("data");

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

    const ButtonType = isSmall ? IconButton : Button;

    const menuId = buildID(baseId, ids.CUSTOM_COLS);
    const { isSmUp, isSmDown } = useBreakpoints();

    return (
        <>
            <ButtonType
                aria-label={t("ariaCustomCols")}
                aria-controls={menuId}
                aria-haspopup="true"
                size="small"
                variant={!isSmall ? "outlined" : null}
                onClick={handleColumnSettingClick}
            >
                {!isSmUp && <Settings />}

                {!isSmDown && <>{t("customizeColumns")}</>}
            </ButtonType>
            <Menu
                id={menuId}
                anchorEl={columnSettingEl}
                open={columnSettingsOpen}
                onClose={handleColumnSettingClose}
            >
                {allTableColumns.map((col) => (
                    <MenuItem
                        key={col.key}
                        id={buildID(menuId, col.key)}
                        onClick={() => {
                            onColumnSelected(col);
                        }}
                    >
                        <ListItemIcon>
                            <DECheckbox
                                checked={isDisplayColumn(col.key)}
                                onChange={() => {
                                    onColumnSelected(col);
                                }}
                            />
                        </ListItemIcon>
                        {col.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default CustomizeColumns;
