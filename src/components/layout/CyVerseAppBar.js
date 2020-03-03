/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu. Also renders a drawer menu
 * in small screens instead of Navigation bar
 *
 */

import React, { useState } from "react";
import ids from "./ids";
import intlData from "./messages";
import constants from "../../constants";
import callApi from "../../common/callApi";
import GlobalSearchField from "../search/GlobalSearchField";
import NavigationConstants from "./NavigationConstants";

import {
    build,
    formatHTMLMessage,
    formatMessage,
    getMessage,
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
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

import { useUserProfile } from "../../contexts/userProfile";
import { intercomLogin } from "../../common/intercom";
import { useIntercom } from "../../contexts/intercom";

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
    notification: {
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(2),
        },
    },
}));

function CustomIntercom({ unreadIntercomMsgCount }) {
    console.log("intercom msg count update=>" + unreadIntercomMsgCount);
    return (
        <IconButton id="cyverse_intercom_support" color="primary">
            <Badge badgeContent={unreadIntercomMsgCount} color="error">
                <LiveHelpIcon />
            </Badge>
        </IconButton>
    );
}

function CyverseAppBar(props) {
    const classes = useStyles();
    const router = useRouter();
    const { unreadIntercomMsgCount, intl, children } = props;
    const [userProfile, setUserProfile] = useUserProfile();
    const intercomDetails = useIntercom();
    const [drawerOpen, setDrawerOpen] = useState(false);

    React.useEffect(() => {
        const fetchUserProfile = async function() {
            const profile = await callApi({
                endpoint: "/api/profile",
                method: "GET",
                credentials: "include",
            });
            console.log("intercom from provider=>" + intercomDetails.appId);
            if (profile && profile.id) {
                intercomLogin(
                    profile.id,
                    profile.attributes.email,
                    intercomDetails.appId,
                    intercomDetails.companyId,
                    intercomDetails.companyName
                );
            }
            setUserProfile(profile);
        };
        fetchUserProfile();
    }, [setUserProfile]);

    const handleUserButtonClick = (event) => {
        console.log(userProfile);
        if (!userProfile) {
            router.push(`/${NavigationConstants.LOGIN}${router.asPath}`);
        }
    };
    const handleSearchClick = (event) => {
        router.push("/" + NavigationConstants.SEARCH);
        toggleDrawer(false);
    };
    const toggleDrawer = (open) => (event) => {
        console.log("drawer=>" + open);
        setDrawerOpen(open);
    };
    return (
        <>
            <div className={classes.root}>
                <AppBar
                    id={ids.APP_BAR_BASE}
                    position="static"
                    variant="outlined"
                    className={classes.appBar}
                >
                    <Toolbar>
                        <Hidden only={["sm", "md", "lg", "xl"]}>
                            <div>
                                <IconButton
                                    id={build(
                                        ids.APP_BAR_BASE,
                                        ids.DRAWER_MENU_BTN
                                    )}
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
                                id={ids.DRAWER_MENU}
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                            >
                                <List onClick={toggleDrawer(false)}>
                                    <ListItem
                                        id={build(
                                            ids.DRAWER_MENU,
                                            ids.ACCOUNT_MI
                                        )}
                                        onClick={handleUserButtonClick}
                                    >
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <ListItemText>
                                            {getMessage("login")}
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        id={build(
                                            ids.DRAWER_MENU,
                                            ids.DASHBOARD_MI
                                        )}
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
                                            alt={formatMessage(
                                                intl,
                                                "dashboard"
                                            )}
                                        />
                                        <ListItemText>
                                            {getMessage("dashboard")}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem
                                        id={build(ids.DRAWER_MENU, ids.DATA_MI)}
                                        onClick={() =>
                                            router.push(
                                                "/" + NavigationConstants.DATA
                                            )
                                        }
                                    >
                                        <img
                                            className={classes.drawerIcon}
                                            src="/data.png"
                                            alt={formatMessage(
                                                intl,
                                                "dashboard"
                                            )}
                                        />
                                        <ListItemText>
                                            {getMessage("data")}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem
                                        id={build(ids.DRAWER_MENU, ids.APPS_MI)}
                                        onClick={() =>
                                            router.push(
                                                "/" + NavigationConstants.APPS
                                            )
                                        }
                                    >
                                        <img
                                            className={classes.drawerIcon}
                                            src="/apps.png"
                                            alt={formatMessage(intl, "apps")}
                                        />
                                        <ListItemText>
                                            {getMessage("apps")}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem
                                        id={build(
                                            ids.DRAWER_MENU,
                                            ids.ANALYSES_MI
                                        )}
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
                                            alt={formatMessage(
                                                intl,
                                                "analyses"
                                            )}
                                        />
                                        <ListItemText>
                                            {getMessage("analyses")}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem
                                        id={build(
                                            ids.DRAWER_MENU,
                                            ids.SEARCH_MI
                                        )}
                                        onClick={handleSearchClick}
                                    >
                                        <ListItemIcon>
                                            <SearchIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            {getMessage("search")}
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        id={build(
                                            ids.DRAWER_MENU,
                                            ids.SETTINGS_MI
                                        )}
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
                                <img
                                    src="/de.png"
                                    alt={formatMessage(intl, "cyverse")}
                                ></img>
                            </a>
                            <GlobalSearchField />
                        </Hidden>
                        <div className={classes.root} />
                        <div style={{ display: "flex" }}>
                            <CustomIntercom
                                unreadIntercomMsgCount={unreadIntercomMsgCount}
                            />
                            <IconButton
                                id={build(
                                    ids.APP_BAR_BASE,
                                    ids.NOTIFICATION_BTN
                                )}
                                className={classes.notification}
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
                                    id={build(
                                        ids.APP_BAR_BASE,
                                        ids.ACCOUNT_BTN
                                    )}
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
                                    id={build(ids.APP_BAR_BASE, ids.SEARCH_BTN)}
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
        </>
    );
}

export default withI18N(injectIntl(CyverseAppBar), intlData);
