/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu. Also renders a drawer menu
 * in small screens instead of Navigation bar
 *
 */

import React, { useState } from "react";
import clsx from "clsx";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { injectIntl } from "react-intl";

import ids from "./ids";
import intlData from "./messages";
import constants from "../../constants";
import GlobalSearchField from "../search/GlobalSearchField";
import NavigationConstants from "../../common/NavigationConstants";
import Notifications from "./Notifications";
import CustomIntercom from "./CustomIntercom";
import { useUserProfile } from "../../contexts/userProfile";
import { getUserProfile } from "../../serviceFacades/users";

import {
    build,
    CyVerseAnnouncer,
    formatHTMLMessage,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    AppBar,
    Avatar,
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
    useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const drawerWidth = 200;
const miniDrawerWidth = 65;
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
    },
    appBar: {
        backgroundColor: theme.palette.bgGray,
        zIndex: theme.zIndex.drawer + 1,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: miniDrawerWidth,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: `calc(100% - ${miniDrawerWidth + 1}px)`,
        },
    },
    appBarShift: {
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    drawerIcon: {
        marginRight: theme.spacing(3.5),
        width: 32,
    },
    userIcon: {
        cursor: "pointer",
        backgroundColor: theme.palette.success.main,
        color: theme.palette.info.contrastText,
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginLeft: theme.spacing(1),
        "&:hover": {
            textDecoration: "underline",
            textDecorationColor: theme.palette.info.contrastText,
        },
    },
    accountIcon: {
        cursor: "pointer",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    icon: {
        color: theme.palette.info.contrastText,
    },
    appBarIcon: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(2),
        },
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.2),
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        width: drawerWidth,
        [theme.breakpoints.up("sm")]: {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    drawerClose: {
        [theme.breakpoints.up("sm")]: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: "hidden",
            width: miniDrawerWidth,
        },
    },
    content: {
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${miniDrawerWidth + 1}px)`,
            marginLeft: miniDrawerWidth,
            padding: theme.spacing(1),
        },
    },
    contentShift: {
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    profile: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            textDecorationColor: theme.palette.info.contrastText,
        },
    },
    listItem: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            backgroundColor: theme.palette.primary.main,
        },
        color: theme.palette.info.contrastText,
    },
    listItemActive: {
        cursor: "pointer",
        textDecoration: "underline",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
    menuIcon: {
        color: theme.palette.info.main,
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(0.5),
            color: theme.palette.info.contrastText,
        },
    },
}));

function CyverseAppBar(props) {
    const classes = useStyles();
    const theme = useTheme();
    const router = useRouter();
    const { intl, children, activeView } = props;
    const [userProfile, setUserProfile] = useUserProfile();
    const [avatarLetter, setAvatarLetter] = useState("");
    const [open, setOpen] = React.useState(false);
    useQuery({
        queryKey: "getUserProfile",
        queryFn: getUserProfile,
        config: {
            onSuccess: setUserProfile,
        },
    });

    React.useEffect(() => {
        if (userProfile?.id) {
            setAvatarLetter(userProfile.id.charAt(0).toUpperCase());
        }
    }, [userProfile, setAvatarLetter]);

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
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toggleDrawer = (open) => (event) => {
        setOpen(open);
    };

    const accountAvatar = (
        <Avatar
            className={userProfile ? classes.userIcon : classes.accountIcon}
            onClick={handleUserButtonClick}
        >
            {userProfile ? (
                <Typography variant={"h6"}>{avatarLetter}</Typography>
            ) : (
                <AccountCircle fontSize="large" />
            )}
        </Avatar>
    );

    const drawerItems = (
        <List>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.DASHBOARD_MI)}
                onClick={() => router.push("/" + NavigationConstants.DASHBOARD)}
                className={
                    activeView === NavigationConstants.DASHBOARD
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <img
                    className={classes.drawerIcon}
                    src="/dashboard_selected.png"
                    alt={formatMessage(intl, "dashboard")}
                />
                <ListItemText>{getMessage("dashboard")}</ListItemText>
            </ListItem>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.DATA_MI)}
                onClick={() => router.push("/" + NavigationConstants.DATA)}
                className={
                    activeView === NavigationConstants.DATA
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <img
                    className={classes.drawerIcon}
                    src="/data_selected.png"
                    alt={formatMessage(intl, "data")}
                />
                <ListItemText>{getMessage("data")}</ListItemText>
            </ListItem>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.APPS_MI)}
                onClick={() => router.push("/" + NavigationConstants.APPS)}
                className={
                    activeView === NavigationConstants.APPS
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <img
                    className={classes.drawerIcon}
                    src="/apps_selected.png"
                    alt={formatMessage(intl, "apps")}
                />
                <ListItemText>{getMessage("apps")}</ListItemText>
            </ListItem>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.ANALYSES_MI)}
                onClick={() => router.push("/" + NavigationConstants.ANALYSES)}
                className={
                    activeView === NavigationConstants.ANALYSES
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <img
                    className={classes.drawerIcon}
                    src="/analyses_selected.png"
                    alt={formatMessage(intl, "analyses")}
                />
                <ListItemText>{getMessage("analyses")}</ListItemText>
            </ListItem>
            <Hidden only={["md", "lg", "xl"]}>
                <ListItem
                    id={build(ids.DRAWER_MENU, ids.SEARCH_MI)}
                    onClick={handleSearchClick}
                    className={
                        activeView === NavigationConstants.SEARCH
                            ? classes.listItemActive
                            : classes.listItem
                    }
                >
                    <ListItemIcon>
                        <SearchIcon className={classes.icon} fontSize="large" />
                    </ListItemIcon>
                    <ListItemText>{getMessage("search")}</ListItemText>
                </ListItem>
            </Hidden>
            <Divider />
            <ListItem
                id={build(ids.DRAWER_MENU, ids.SETTINGS_MI)}
                onClick={() => router.push("/" + NavigationConstants.SETTINGS)}
                className={
                    activeView === NavigationConstants.SETTINGS
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <ListItemIcon>
                    <SettingsIcon className={classes.icon} fontSize="large" />
                </ListItemIcon>
                <ListItemText>{getMessage("settings")}</ListItemText>
            </ListItem>
        </List>
    );

    return (
        <div className={classes.root}>
            <AppBar
                id={ids.APP_BAR_BASE}
                position="static"
                variant="outlined"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <Hidden only={["sm", "md", "lg", "xl"]}>
                        >
                        <IconButton
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={classes.menuIcon}
                        >
                            <MenuIcon />
                        </IconButton>
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
                        <CustomIntercom intl={intl} />
                        <Notifications intl={intl} />
                    </div>
                    <Hidden only={["xs"]}>
                        <div id={build(ids.DRAWER_MENU, ids.ACCOUNT_MI)}>
                            {accountAvatar}
                        </div>
                    </Hidden>
                </Toolbar>
            </AppBar>
            <Hidden xsDown>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        {!open && (
                            <IconButton
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuIcon, {
                                    [classes.hide]: open,
                                })}
                            >
                                <MenuIcon fontSize="large" />
                            </IconButton>
                        )}
                        {open && (
                            <IconButton
                                onClick={handleDrawerClose}
                                className={classes.menuIcon}
                            >
                                {theme.direction === "rtl" ? (
                                    <ChevronRightIcon fontSize="large" />
                                ) : (
                                    <ChevronLeftIcon fontSize="large" />
                                )}
                            </IconButton>
                        )}
                    </div>
                    <Divider />
                    {drawerItems}
                </Drawer>
            </Hidden>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <Drawer
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                    open={open}
                    onClose={toggleDrawer(false)}
                >
                    <div
                        id={build(ids.DRAWER_MENU, ids.ACCOUNT_MI)}
                        style={{ margin: 8 }}
                    >
                        {accountAvatar}
                    </div>
                    <Divider />
                    {drawerItems}
                </Drawer>
            </Hidden>
            <CyVerseAnnouncer />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                {children}
            </main>
        </div>
    );
}

export default withI18N(injectIntl(CyverseAppBar), intlData);
