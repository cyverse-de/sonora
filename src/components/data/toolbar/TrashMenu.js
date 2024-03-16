/**
 * @author sriram
 *
 * A button with menu items for DS trash operations.
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";

import buildID from "components/utils/DebugIDUtil";
import { Button, Menu } from "@mui/material";

import { makeStyles } from "tss-react/mui";

import { ArrowDropDown, Delete } from "@mui/icons-material";
import TrashMenuItems from "./TrashMenuItems";

const useStyles = makeStyles()(styles);

export function TrashMenu(props) {
    const { baseId, selected, handleDelete, handleRestore, handleEmptyTrash } =
        props;
    const { t } = useTranslation("data");
    const { classes } = useStyles();

    const [trashAnchor, setTrashAnchor] = useState(null);

    const onTrashClose = () => {
        setTrashAnchor(null);
    };

    const onTrashMenuClick = (event) => {
        setTrashAnchor(event.currentTarget);
    };

    return (
        <>
            <Button
                id={buildID(baseId, ids.TRASH_BUTTON)}
                variant="outlined"
                size="small"
                disableElevation
                color="primary"
                className={classes.button}
                onClick={onTrashMenuClick}
                aria-haspopup={true}
                aria-controls={buildID(baseId, ids.TRASH_BUTTON_MENU)}
                startIcon={<Delete />}
                endIcon={<ArrowDropDown />}
            >
                {t("trash")}
            </Button>
            <Menu
                id={buildID(baseId, ids.TRASH_BUTTON_MENU)}
                anchorEl={trashAnchor}
                open={Boolean(trashAnchor)}
                onClose={onTrashClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <TrashMenuItems
                    baseId={baseId}
                    selected={selected}
                    handleEmptyTrash={handleEmptyTrash}
                    handleDelete={handleDelete}
                    handleRestore={handleRestore}
                />
            </Menu>
        </>
    );
}
