/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu. Also renders a drawer menu
 * in small screens instead of Navigation bar
 *
 */

import React, { useState } from "react";

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
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
    },
    appBar: {
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        backgroundColor: theme.palette.bgGray,
        boxShadow: 0,
    },
    drawerIcon: {
        marginRight: theme.spacing(3.5),
        width: 32,
    },
    userIcon: {
        cursor: "pointer",
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },
    appBarIcon: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(2),
        },
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1),
        },
    },
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.bgGray,
    },
    content: {
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            padding: theme.spacing(1),
        },
    },
    profile: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    listItem: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            backgroundColor: theme.palette.secondary.main,
        },
    },
    listItemActive: {
        cursor: "pointer",
        textDecoration: "underline",
    },
}));

function CyverseAppBar(props) {
    const classes = useStyles();
    const router = useRouter();
    const { intl, children, activeView } = props;
    const [userProfile, setUserProfile] = useUserProfile();
    const [avatarLetter, setAvatarLetter] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
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
    const toggleDrawer = (open) => (event) => {
        setDrawerOpen(open);
    };

    const drawerItems = (
        <List onClick={toggleDrawer(false)}>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.ACCOUNT_MI)}
                onClick={handleUserButtonClick}
                className={classes.profile}
            >
                {userProfile ? (
                    <>
                        <ListItemAvatar>
                            <Avatar className={classes.userIcon}>
                                <Typography variant={"h6"}>
                                    {avatarLetter}
                                </Typography>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>{getMessage("logout")}</ListItemText>
                    </>
                ) : (
                    <>
                        <ListItemIcon style={{ paddingBottom: 4 }}>
                            <AccountCircle fontSize="large" />
                        </ListItemIcon>
                        <ListItemText style={{ paddingBottom: 4 }}>
                            {getMessage("login")}
                        </ListItemText>
                    </>
                )}
            </ListItem>
            <Divider />
            <ListItem
                id={build(ids.DRAWER_MENU, ids.DASHBOARD_MI)}
                onClick={() => router.push("/" + NavigationConstants.DASHBOARD)}
                selected={activeView === NavigationConstants.DASHBOARD}
                className={
                    activeView === NavigationConstants.DASHBOARD
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <img
                    className={classes.drawerIcon}
                    src="/dashboard.png"
                    alt={formatMessage(intl, "dashboard")}
                />
                <ListItemText>{getMessage("dashboard")}</ListItemText>
            </ListItem>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.DATA_MI)}
                onClick={() => router.push("/" + NavigationConstants.DATA)}
                selected={activeView === NavigationConstants.DATA}
                className={
                    activeView === NavigationConstants.DATA
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <img
                    className={classes.drawerIcon}
                    src="/data.png"
                    alt={formatMessage(intl, "data")}
                />
                <ListItemText>{getMessage("data")}</ListItemText>
            </ListItem>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.APPS_MI)}
                onClick={() => router.push("/" + NavigationConstants.APPS)}
                selected={activeView === NavigationConstants.APPS}
                className={
                    activeView === NavigationConstants.APPS
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <img
                    className={classes.drawerIcon}
                    src="/apps.png"
                    alt={formatMessage(intl, "apps")}
                />
                <ListItemText>{getMessage("apps")}</ListItemText>
            </ListItem>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.ANALYSES_MI)}
                onClick={() => router.push("/" + NavigationConstants.ANALYSES)}
                selected={activeView === NavigationConstants.ANALYSES}
                className={
                    activeView === NavigationConstants.ANALYSES
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <img
                    className={classes.drawerIcon}
                    src="/analyses.png"
                    alt={formatMessage(intl, "analyses")}
                />
                <ListItemText>{getMessage("analyses")}</ListItemText>
            </ListItem>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.SEARCH_MI)}
                selected={activeView === NavigationConstants.SEARCH}
                onClick={handleSearchClick}
                className={
                    activeView === NavigationConstants.SEARCH
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <ListItemIcon>
                    <SearchIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText>{getMessage("search")}</ListItemText>
            </ListItem>
            <Divider />
            <ListItem
                id={build(ids.DRAWER_MENU, ids.SETTINGS_MI)}
                onClick={() => router.push("/" + NavigationConstants.SETTINGS)}
                selected={activeView === NavigationConstants.SETTINGS}
                className={
                    activeView === NavigationConstants.SETTINGS
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <ListItemIcon>
                    <SettingsIcon fontSize="large" />
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
                className={classes.appBar}
            >
                <Toolbar>
                    <Hidden mdUp>
                        <IconButton
                            id={build(ids.APP_BAR_BASE, ids.DRAWER_MENU_BTN)}
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
                        <Typography color="primary">
                            {formatHTMLMessage("discovery")}
                            &nbsp;{formatHTMLMessage("environment")}
                        </Typography>
                    </Hidden>
                    <Hidden smDown>
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
                        <CustomIntercom intl={intl} classes={classes} />
                        <Notifications intl={intl} classes={classes} />
                    </div>
                </Toolbar>
            </AppBar>
            <nav>
                <Hidden mdUp>
                    <Drawer
                        id={ids.DRAWER_MENU}
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        variant="temporary"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {drawerItems}
                    </Drawer>
                </Hidden>
                <Hidden smDown>
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawerItems}
                    </Drawer>
                </Hidden>
            </nav>
            <CyVerseAnnouncer />
            <main className={classes.content}>{children}</main>
        </div>
    );
}

export default withI18N(injectIntl(CyverseAppBar), intlData);
