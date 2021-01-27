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

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    makeStyles,
    Menu,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from "@material-ui/core";

import {
    ArrowDropDown,
    Delete,
    DeleteForever,
    RestoreFromTrash,
    DeleteSweep,
} from "@material-ui/icons";
import TrashMenuItems from "./TrashMenuItems";

const useStyles = makeStyles(styles);

export function TrashMenu(props) {
    const {
        baseId,
        selected,
        handleDelete,
        handleRestore,
        handleEmptyTrash,
    } = props;
    const { t } = useTranslation("data");
    const classes = useStyles();

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
                id={build(baseId, "trashButton")}
                variant="outlined"
                size="small"
                disableElevation
                color="primary"
                className={classes.button}
                onClick={onTrashMenuClick}
                aria-haspopup={true}
                aria-controls={baseId}
                startIcon={<Delete />}
                endIcon={<ArrowDropDown />}
            >
                {t("trash")}
            </Button>
            <Menu
                id={(baseId, "trashBtnMenu")}
                anchorEl={trashAnchor}
                open={Boolean(trashAnchor)}
                onClose={onTrashClose}
                getContentAnchorEl={null}
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
