/**
 * A common set of buttons (or a dot menu on mobile)
 * for arranging, editing, and deleting App parameters or groups.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import { build as buildID, DotMenu } from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    MenuItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import { Delete, Edit, ArrowDownward, ArrowUpward } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function ParamLayoutActions(props) {
    const {
        baseId,
        cosmeticOnly,
        ButtonProps = {},
        DotMenuButtonProps = {},
        onDelete,
        onEdit,
        onMoveDown,
        onMoveUp,
    } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const classes = useStyles();
    const { t } = useTranslation("common");

    return (
        <ButtonGroup {...ButtonProps}>
            {isMobile && !cosmeticOnly ? (
                <DotMenu
                    baseId={baseId}
                    ButtonProps={DotMenuButtonProps}
                    render={(onClose) => [
                        <MenuItem
                            key={ids.BUTTONS.MOVE_UP_BTN}
                            id={buildID(baseId, ids.BUTTONS.MOVE_UP_BTN)}
                            onClick={() => {
                                onClose();
                                onMoveUp();
                            }}
                        >
                            <ListItemIcon>
                                <ArrowUpward />
                            </ListItemIcon>
                            <ListItemText primary={t("moveUp")} />
                        </MenuItem>,
                        <MenuItem
                            key={ids.BUTTONS.MOVE_DOWN_BTN}
                            id={buildID(baseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                            onClick={() => {
                                onClose();
                                onMoveDown();
                            }}
                        >
                            <ListItemIcon>
                                <ArrowDownward />
                            </ListItemIcon>
                            <ListItemText primary={t("moveDown")} />
                        </MenuItem>,
                        <MenuItem
                            key={ids.BUTTONS.EDIT_BTN}
                            id={buildID(baseId, ids.BUTTONS.EDIT_BTN)}
                            onClick={() => {
                                onClose();
                                onEdit();
                            }}
                        >
                            <ListItemIcon>
                                <Edit />
                            </ListItemIcon>
                            <ListItemText primary={t("edit")} />
                        </MenuItem>,
                        <MenuItem
                            key={ids.BUTTONS.DELETE_BTN}
                            id={buildID(baseId, ids.BUTTONS.DELETE_BTN)}
                            onClick={() => {
                                onClose();
                                onDelete();
                            }}
                        >
                            <ListItemIcon>
                                <Delete />
                            </ListItemIcon>
                            <ListItemText primary={t("delete")} />
                        </MenuItem>,
                    ]}
                />
            ) : (
                [
                    !cosmeticOnly && (
                        <Button
                            key={buildID(baseId, ids.BUTTONS.MOVE_UP_BTN)}
                            id={buildID(baseId, ids.BUTTONS.MOVE_UP_BTN)}
                            aria-label={t("moveUp")}
                            onClick={onMoveUp}
                        >
                            <ArrowUpward />
                        </Button>
                    ),
                    !cosmeticOnly && (
                        <Button
                            key={buildID(baseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                            id={buildID(baseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                            aria-label={t("moveDown")}
                            onClick={onMoveDown}
                        >
                            <ArrowDownward />
                        </Button>
                    ),
                    <Button
                        key={buildID(baseId, ids.BUTTONS.EDIT_BTN)}
                        id={buildID(baseId, ids.BUTTONS.EDIT_BTN)}
                        aria-label={t("edit")}
                        onClick={onEdit}
                    >
                        <Edit />
                    </Button>,
                    !cosmeticOnly && (
                        <Button
                            key={buildID(baseId, ids.BUTTONS.DELETE_BTN)}
                            id={buildID(baseId, ids.BUTTONS.DELETE_BTN)}
                            aria-label={t("delete")}
                            className={classes.deleteIcon}
                            onClick={onDelete}
                        >
                            <Delete />
                        </Button>
                    ),
                ]
            )}
        </ButtonGroup>
    );
}
