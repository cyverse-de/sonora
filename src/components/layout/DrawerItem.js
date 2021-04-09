import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import styles from "./styles";
import ids from "./ids";

import { build } from "@cyverse-de/ui-lib";

import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

const DrawerItem = (props) => {
    const classes = useStyles();
    const router = useRouter();

    const {
        title,
        id,
        icon: Icon,
        activeView,
        thisView,
        toggleDrawer,
        clsxBase,
        open,
        onClick,
        nested = false,
    } = props;

    return (
        <Tooltip title={title} placement="right" arrow>
            <ListItem
                id={build(ids.DRAWER_MENU, id)}
                onClick={() => {
                    toggleDrawer(false);
                    onClick ? onClick() : router.push("/" + thisView);
                }}
                className={
                    activeView === thisView
                        ? classes.listItemActive
                        : nested
                        ? clsx(classes.nested, classes.listItem)
                        : classes.listItem
                }
            >
                {Icon && (
                    <ListItemIcon>
                        <Icon
                            className={
                                clsxBase
                                    ? clsx(clsxBase, classes.icon)
                                    : classes.icon
                            }
                            style={{ fontSize: !nested ? "2.1875rem" : null }}
                            fontSize={!nested ? "large" : "default"}
                        />
                    </ListItemIcon>
                )}
                {open && <ListItemText>{title}</ListItemText>}
            </ListItem>
        </Tooltip>
    );
};

export default DrawerItem;
