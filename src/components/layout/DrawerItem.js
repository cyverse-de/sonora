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
    } = props;

    return (
        <Tooltip title={title} placement="right" arrow>
            <ListItem
                id={build(ids.DRAWER_MENU, id)}
                onClick={() => {
                    toggleDrawer(false);
                    router.push("/" + thisView);
                }}
                className={
                    activeView === thisView
                        ? classes.listItemActive
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
                            style={{ fontSize: "2.1875rem" }}
                        />
                    </ListItemIcon>
                )}
                {open && <ListItemText>{title}</ListItemText>}
            </ListItem>
        </Tooltip>
    );
};

export default DrawerItem;
