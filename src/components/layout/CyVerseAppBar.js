/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu.
 *
 */

import React, { useState } from "react";
import intlData from "./messages";
import constants from "../../constants";
import GlobalSearchField from "../search/GlobalSearchField";
import NavigationConstants from "./NavigationConstants";

import {
    getMessage,
    formatMessage,
    formatHTMLMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import { useRouter } from "next/router";
import { injectIntl } from "react-intl";
import {
    AppBar,
    Badge,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: theme.palette.bgGray,
        boxShadow: 0,
    },
    drawerIcon: {
        height: 18,
        width: 18,
        paddingRight: theme.spacing(4),
    },
}));

function CyverseAppBar(props) {
    const classes = useStyles();
    const router = useRouter();
    const { intl, children } = props;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const handleUserButtonClick = (event) => {
        const { user } = props.children.props;
        if (!user) {
            router.push("/" + NavigationConstants.LOGIN);
        }
    };
    const handleSearchClick = (event) => {
        router.push("/" + NavigationConstants.SEARCH);
    };
    const toggleDrawer = (open) => (event) => {
        setDrawerOpen(open);
    };
    return (
        <React.Fragment>
            <div className={classes.root}>
                <AppBar
                    position="static"
                    variant="outlined"
                    className={classes.appBar}
                >
                    <Toolbar>
                        <Hidden only={["sm", "md", "lg", "xl"]}>
                            <div>
                                <IconButton
                                    edge="start"
                                    className={classes.menuButton}
                                    color="primary"
                                    aria-label={formatMessage(
                                        intl,
                                        "drawerMenuAriaLabel"
                                    )}
                                    onClick={toggleDrawer(true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </div>
                            <Drawer
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                            >
                                <List>
                                    <ListItem onClick={handleUserButtonClick}>
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <ListItemText>
                                            {getMessage("login")}
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        onClick={() =>
                                            router.push(
                                                "/" +
                                                    NavigationConstants.DASHBOARD
                                            )
                                        }
                                    >
                                        <img
                                            className={classes.drawerIcon}
                                            src="/dashboard.png"
                                        />
                                        <ListItemText>
                                            {getMessage("dashboard")}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem
                                        onClick={() =>
                                            router.push(
                                                "/" + NavigationConstants.DATA
                                            )
                                        }
                                    >
                                        <img
                                            className={classes.drawerIcon}
                                            src="/data.png"
                                        />
                                        <ListItemText>
                                            {getMessage("data")}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem
                                        onClick={() =>
                                            router.push(
                                                "/" + NavigationConstants.APPS
                                            )
                                        }
                                    >
                                        <img
                                            className={classes.drawerIcon}
                                            src="/apps.png"
                                        />
                                        <ListItemText>
                                            {getMessage("apps")}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem
                                        onClick={() =>
                                            router.push(
                                                "/" +
                                                    NavigationConstants.ANALYSES
                                            )
                                        }
                                    >
                                        <img
                                            className={classes.drawerIcon}
                                            src="/analyses.png"
                                        />
                                        <ListItemText>
                                            {getMessage("analyses")}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem onClick={handleSearchClick}>
                                        <ListItemIcon>
                                            <SearchIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            {getMessage("search")}
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        onClick={() =>
                                            router.push(
                                                "/" +
                                                    NavigationConstants.SETTINGS
                                            )
                                        }
                                    >
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            {getMessage("settings")}
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Drawer>
                            <Typography color="primary">
                                {formatHTMLMessage("discovery")}
                                &nbsp;{formatHTMLMessage("environment")}
                            </Typography>
                        </Hidden>
                        <Hidden xsDown>
                            <a
                                href={constants.CYVERSE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src="/de.png" alt="CyVerse"></img>
                            </a>
                            <GlobalSearchField />
                        </Hidden>
                        <div className={classes.root} />
                        <div style={{ display: "flex" }}>
                            <IconButton
                                aria-label={formatMessage(
                                    intl,
                                    "newNotificationAriaLabel"
                                )}
                                color="primary"
                            >
                                <Badge badgeContent={0} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <Hidden xsDown>
                                <IconButton
                                    edge="end"
                                    aria-label={formatMessage(
                                        intl,
                                        "accountAriaLabel"
                                    )}
                                    aria-controls={formatMessage(
                                        intl,
                                        "accountAriaControl"
                                    )}
                                    color="primary"
                                    onClick={handleUserButtonClick}
                                >
                                    <AccountCircle />
                                </IconButton>
                            </Hidden>
                            <Hidden only={["sm", "md", "lg", "xl"]}>
                                <IconButton
                                    edge="end"
                                    aria-label={formatMessage(
                                        intl,
                                        "searchAriaLabel"
                                    )}
                                    aria-controls={formatMessage(
                                        intl,
                                        "searchButtonAriaControl"
                                    )}
                                    color="primary"
                                    onClick={handleSearchClick}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Hidden>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
            {children}
        </React.Fragment>
    );
}

export default withI18N(injectIntl(CyverseAppBar), intlData);
