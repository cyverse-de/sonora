import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import styles from "./styles";
import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

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
                id={buildID(ids.DRAWER_MENU, id)}
                onClick={() => {
                    toggleDrawer(false);
                    onClick ? onClick() : router.push("/" + thisView);
                }}
                className={clsx(
                    nested && classes.nested,
                    activeView === thisView
                        ? classes.listItemActive
                        : classes.listItem
                )}
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
                            fontSize={!nested ? "large" : "medium"}
                        />
                    </ListItemIcon>
                )}
                {open && (
                    <ListItemText primaryTypographyProps={{ noWrap: true }}>
                        {title}
                    </ListItemText>
                )}
            </ListItem>
        </Tooltip>
    );
};

export default DrawerItem;
