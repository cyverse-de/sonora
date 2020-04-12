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
import GlobalSearchField from "../search/GlobalSearchField";
import NavigationConstants from "../../common/NavigationConstants";
import Sockette from "sockette";
import {
    build,
    CyVerseAnnouncer,
    formatHTMLMessage,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import { useRouter } from "next/router";
import { injectIntl } from "react-intl";
import {
    AppBar,
    Avatar,
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
import { getUserProfile } from "../../serviceFacade/userServiceFacade";
import { useQuery } from "react-query";

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
    margin: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(2),
        },
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1),
        },
    },
    userIcon: {
        cursor: "pointer",
        margin: theme.spacing(2),
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },
}));

function CustomIntercom({ intl, classes, unReadCount }) {
    return (
        <IconButton
            className={classes.margin}
            id={ids.INTERCOM_WIDGET}
            color="primary"
            aria-label={formatMessage(intl, "intercomAriaLabel")}
            aria-controls={formatMessage(intl, "intercomAriaControl")}
            size="small"
        >
            <Badge badgeContent={unReadCount} color="error">
                <LiveHelpIcon />
            </Badge>
        </IconButton>
    );
}

function CyverseAppBar(props) {
    const classes = useStyles();
    const router = useRouter();
    const { intl, children } = props;
    const [userProfile, setUserProfile] = useUserProfile();
    const [avatarLetter, setAvatarLetter] = useState("");
    const {
        appId,
        enabled,
        companyId,
        companyName,
        unReadCount,
    } = useIntercom();
    const [drawerOpen, setDrawerOpen] = useState(false);
    useQuery({
        queryKey: "getUserProfile",
        queryFn: getUserProfile,
        config: {
            onSuccess: setUserProfile,
            refetchOnWindowFocus: false,
            throwOnError: true,
        },
    });
    React.useEffect(() => {
        if (enabled && userProfile && userProfile.id) {
            intercomLogin(
                userProfile.id,
                userProfile.attributes.email,
                appId,
                companyId,
                companyName
            );
            setAvatarLetter(userProfile.id.charAt(0).toUpperCase());
            const ws = new Sockette(
                "ws://localhost:3000/wesbocket/notification?user=" +
                    userProfile.id,
                {
                    maxAttempts: 10,
                    onopen: (e) => {
                        console.log("connected!");
                        ws.send("Connected by " + userProfile.id);
                    },
                    onmessage: (e) => console.log("Received:", e),
                    onreconnect: (e) => console.log("Reconnecting...", e),
                    onmaximum: (e) => console.log("Stop Attempting!", e),
                    onclose: (e) => console.log("Closed!", e),
                    onerror: (e) => console.log("Error:", e),
                }
            );
        }
    }, [userProfile, appId, enabled, companyId, companyName, setAvatarLetter]);

    const handleUserButtonClick = (event) => {
        if (!userProfile) {
            router.push(`/${NavigationConstants.LOGIN}${router.asPath}`);
        } else {
            router.push(`/${NavigationConstants.LOGOUT}`);
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
                                        {userProfile ? (
                                            <>
                                                <ListItemIcon>
                                                    <Avatar
                                                        className={
                                                            classes.userIcon
                                                        }
                                                    >
                                                        <Typography
                                                            variant={"h6"}
                                                        >
                                                            {avatarLetter}
                                                        </Typography>
                                                    </Avatar>
                                                </ListItemIcon>
                                                <ListItemText>
                                                    {getMessage("logout")}
                                                </ListItemText>
                                            </>
                                        ) : (
                                            <>
                                                <ListItemIcon>
                                                    <AccountCircle />
                                                </ListItemIcon>
                                                <ListItemText>
                                                    {getMessage("login")}
                                                </ListItemText>
                                            </>
                                        )}
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
                        </Hidden>
                        <Hidden smDown>
                            <GlobalSearchField />
                        </Hidden>
                        <div className={classes.root} />
                        <div style={{ display: "flex" }}>
                            {enabled && (
                                <CustomIntercom
                                    classes={classes}
                                    intl={intl}
                                    unReadCount={unReadCount}
                                />
                            )}
                            <IconButton
                                id={build(
                                    ids.APP_BAR_BASE,
                                    ids.NOTIFICATION_BTN
                                )}
                                className={classes.margin}
                                aria-label={formatMessage(
                                    intl,
                                    "newNotificationAriaLabel"
                                )}
                                color="primary"
                                size="small"
                            >
                                <Badge badgeContent={0} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <Hidden only={["xs", "md", "lg", "xl"]}>
                                <IconButton
                                    id={build(ids.APP_BAR_BASE, ids.SEARCH_BTN)}
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
                                    size="small"
                                    className={classes.margin}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Hidden>
                            <Hidden xsDown>
                                {userProfile ? (
                                    <Avatar
                                        onClick={handleUserButtonClick}
                                        id={build(
                                            ids.APP_BAR_BASE,
                                            ids.ACCOUNT_BTN
                                        )}
                                        className={classes.userIcon}
                                    >
                                        <Typography variant={"h6"}>
                                            {avatarLetter}
                                        </Typography>
                                    </Avatar>
                                ) : (
                                    <IconButton
                                        id={build(
                                            ids.APP_BAR_BASE,
                                            ids.ACCOUNT_BTN
                                        )}
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
                                        size="small"
                                        className={classes.margin}
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                )}
                            </Hidden>
                        </div>
                    </Toolbar>
                </AppBar>
                <CyVerseAnnouncer />
            </div>
            {children}
        </>
    );
}

export default withI18N(injectIntl(CyverseAppBar), intlData);
