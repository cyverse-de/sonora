/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu. Also renders a drawer menu
 * in small screens instead of Navigation bar
 *
 */

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import clsx from "clsx";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import ids from "./ids";
import DrawerItem from "./DrawerItem";
import constants from "../../constants";
import { useConfig } from "contexts/config";
import NavigationConstants from "common/NavigationConstants";
import Notifications from "./Notifications";
import CustomIntercom from "./CustomIntercom";
import AnalysesIcon from "components/icons/AnalysesIcon";
import DataIcon from "components/icons/DataIcon";
import { useBootstrapInfo } from "contexts/bootstrap";
import { useUserProfile } from "contexts/userProfile";
import withErrorAnnouncer from "../utils/error/withErrorAnnouncer";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import searchConstants from "components/search/constants";

import Bag from "components/Bag";
import ProductTour from "components/help/ProductTour";
import {
    getUserProfile,
    useBootStrap,
    USER_PROFILE_QUERY_KEY,
} from "serviceFacades/users";

import { build, CyVerseAnnouncer } from "@cyverse-de/ui-lib";

import {
    AppBar,
    Avatar,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HelpIcon from "@material-ui/icons/Help";
import AppsIcon from "@material-ui/icons/Apps";
import { TeamIcon } from "../teams/Icons";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import HomeIcon from "@material-ui/icons/Home";
import UserMenu from "./UserMenu";
import styles from "./styles";

// hidden in xsDown
const GlobalSearchField = dynamic(() => import("../search/GlobalSearchField"));

const ENTITLEMENT = "entitlement";

const useStyles = makeStyles(styles);

const BagMenu = () => {
    const classes = useStyles();

    return <Bag menuIconClass={classes.menuIcon} />;
};

function CyverseAppBar(props) {
    const classes = useStyles();
    const theme = useTheme();
    const router = useRouter();

    const ref = useRef();
    const [config, setConfig] = useConfig();
    const { t } = useTranslation(["common"]);
    const { t: i18nTour } = useTranslation("intro");

    const searchTerm = router?.query?.searchTerm || "";
    let filter = searchConstants.ALL;

    const {
        children,
        activeView,
        setAppBarRef,
        intercomUnreadCount,
        clientConfig,
        showErrorAnnouncer,
    } = props;
    const [userProfile, setUserProfile] = useUserProfile();
    const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
    const [avatarLetter, setAvatarLetter] = useState("");
    const [open, setOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(false);
    const [bootstrapError, setBootstrapError] = useState(null);
    const [bootstrapQueryEnabled, setBootstrapQueryEnabled] = useState(false);
    const [profileRefetchInterval, setProfileRefetchInterval] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [newUser, setNewUser] = useState(false);
    const [runTour, setRunTour] = useState(false);

    const [bootstrapInfo, setBootstrapInfo] = useBootstrapInfo();

    if (activeView === NavigationConstants.APPS) {
        filter = searchConstants.APPS;
    } else if (activeView === NavigationConstants.ANALYSES) {
        filter = searchConstants.ANALYSES;
    } else if (activeView === NavigationConstants.DATA) {
        filter = searchConstants.DATA;
    } else {
        filter = searchConstants.ALL;
    }

    function updateUserProfile(profile) {
        if (
            (profile === null && userProfile !== null) ||
            (profile !== null && userProfile === null)
        ) {
            setUserProfile(profile);
        }
    }

    useQuery({
        queryKey: USER_PROFILE_QUERY_KEY,
        queryFn: getUserProfile,
        config: {
            enabled: profileRefetchInterval != null,
            onSuccess: updateUserProfile,
            refetchInterval: profileRefetchInterval,
        },
    });

    useEffect(() => {
        if (clientConfig) {
            setConfig(clientConfig);
            setProfileRefetchInterval(clientConfig.sessions.poll_interval_ms);
        }
    }, [clientConfig, setConfig]);

    useEffect(() => {
        if (bootstrapError) {
            const errorString = JSON.stringify(bootstrapError);
            setBootstrapError(null);
            router.push(
                `/${NavigationConstants.ERROR}?errorInfo=` + errorString
            );
        }
    }, [bootstrapError, router]);

    useEffect(() => {
        setAppBarRef(ref);
    }, [ref, setAppBarRef]);

    useEffect(() => {
        if (userProfile) {
            setBootstrapQueryEnabled(true);
        }
    }, [userProfile]);

    useBootStrap(bootstrapQueryEnabled, setBootstrapInfo, setBootstrapError);

    useEffect(() => {
        const workspace = bootstrapInfo?.apps_info.workspace;
        setNewUser(workspace?.new_workspace);
    }, [bootstrapInfo]);

    React.useEffect(() => {
        if (userProfile?.id) {
            setAvatarLetter(userProfile.id.charAt(0).toUpperCase());
            const adminGroups = config?.admin.groups;
            const groupAttribute =
                config?.admin.group_attribute_name || ENTITLEMENT;
            const userGroupMemberships = userProfile.attributes[groupAttribute];
            const adminMemberships = [];
            if (adminGroups && userGroupMemberships) {
                const adminGroupArray = adminGroups.split(",");
                adminGroupArray.forEach((adminGroup) => {
                    const found = userGroupMemberships.find(
                        (userGroup) => adminGroup === userGroup
                    );
                    if (found) {
                        adminMemberships.push(found);
                    }
                });
                setAdminUser(adminMemberships.length > 0);
            }
        }
    }, [
        userProfile,
        adminUser,
        setAdminUser,
        setAvatarLetter,
        config,
        showErrorAnnouncer,
    ]);

    React.useEffect(() => {
        if (adminUser && !userProfile.admin) {
            const adminProfile = {
                admin: true,
                ...userProfile,
            };
            setUserProfile(adminProfile);
        }
    }, [adminUser, setUserProfile, userProfile]);

    const handleUserButtonClick = (event) => {
        toggleDrawer(false);
        if (!userProfile) {
            router.push(`/${NavigationConstants.LOGIN}${router.asPath}`);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const onLogoutClick = () => {
        router.push(`/${NavigationConstants.LOGOUT}`);
    };

    const onUserMenuClose = () => {
        setAnchorEl(null);
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
                <Tooltip
                    title={t("logout", { name: userProfile.id })}
                    aria-label={t("logout", { name: userProfile.id })}
                    placement="bottom"
                    arrow
                >
                    <Typography variant={"h6"}>{avatarLetter}</Typography>
                </Tooltip>
            ) : (
                <Tooltip
                    title={t("login")}
                    aria-label={t("login")}
                    placement="bottom"
                    arrow
                >
                    <AccountCircle fontSize="large" />
                </Tooltip>
            )}
        </Avatar>
    );

    const drawerItems = (
        <List component="div">
            <DrawerItem
                title={t("home")}
                id={ids.DASHBOARD_MI}
                icon={HomeIcon}
                thisView={NavigationConstants.DASHBOARD}
                clsxBase={"dashboard-intro"}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            <DrawerItem
                title={t("data")}
                id={ids.DATA_MI}
                icon={DataIcon}
                thisView={NavigationConstants.DATA}
                clsxBase={"data-intro"}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            <DrawerItem
                title={t("apps")}
                id={ids.APPS_MI}
                thisView={NavigationConstants.APPS}
                clsxBase={"apps-intro"}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
                icon={AppsIcon}
            />
            {open && (
                <Tooltip title={t("tools")} placement="right" arrow>
                    <ListItem
                        button
                        id={build(ids.DRAWER_MENU, ids.TOOLS_MI)}
                        className={clsx(classes.nested, classes.listItem)}
                        onClick={() =>
                            router.push("/" + NavigationConstants.TOOLS)
                        }
                    >
                        <ListItemIcon>
                            <LabelImportantIcon className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText>{t("tools")}</ListItemText>
                    </ListItem>
                </Tooltip>
            )}
            <DrawerItem
                title={t("analyses")}
                id={ids.ANALYSES_MI}
                icon={AnalysesIcon}
                thisView={NavigationConstants.ANALYSES}
                clsxBase={"analyses-intro"}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            <Hidden smUp>
                <DrawerItem
                    title={t("search")}
                    id={ids.SEARCH_MI}
                    icon={SearchIcon}
                    thisView={NavigationConstants.SEARCH}
                    clsxBase={"search-intro"}
                    activeView={activeView}
                    toggleDrawer={toggleDrawer}
                    open={open}
                />
            </Hidden>
            <Divider />
            <DrawerItem
                title={t("teams")}
                id={ids.TEAMS_MI}
                icon={TeamIcon}
                thisView={NavigationConstants.TEAMS}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            {userProfile?.id && (
                <DrawerItem
                    title={t("settings")}
                    id={ids.SETTINGS_MI}
                    icon={SettingsIcon}
                    thisView={NavigationConstants.SETTINGS}
                    clsxBase={"preferences-intro"}
                    activeView={activeView}
                    toggleDrawer={toggleDrawer}
                    open={open}
                />
            )}
            <DrawerItem
                clsxBase={"help-intro"}
                activeView={activeView}
                thisView={NavigationConstants.HELP}
                toggleDrawer={toggleDrawer}
                open={open}
                id="help"
                title={t("help")}
                icon={HelpIcon}
            />
        </List>
    );

    const adminDrawerItems = (
        <List component="div">
            <ListItem
                id={build(ids.DRAWER_MENU, ids.ADMIN_MI)}
                className={
                    activeView === NavigationConstants.ADMIN
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <ListItemIcon>
                    <SupervisorAccountIcon
                        className={classes.icon}
                        fontSize="large"
                    />
                </ListItemIcon>
                {open && <ListItemText>{t("admin")}</ListItemText>}
            </ListItem>
            <List component="div" disablePadding>
                <Tooltip title={t("apps")} placement="right" arrow>
                    <ListItem
                        button
                        id={build(ids.DRAWER_MENU, ids.APPS_ADMIN_MI)}
                        className={clsx(classes.nested, classes.listItem)}
                        onClick={() =>
                            router.push(
                                "/" +
                                    NavigationConstants.ADMIN +
                                    "/" +
                                    NavigationConstants.APPS
                            )
                        }
                    >
                        <ListItemIcon>
                            <LabelImportantIcon className={classes.icon} />
                        </ListItemIcon>
                        {open && <ListItemText>{t("apps")}</ListItemText>}
                    </ListItem>
                </Tooltip>
                <Tooltip title={t("doi")} placement="right" arrow>
                    <ListItem
                        button
                        id={build(ids.DRAWER_MENU, ids.DOI_ADMIN_MI)}
                        className={clsx(classes.nested, classes.listItem)}
                        onClick={() =>
                            router.push(
                                "/" +
                                    NavigationConstants.ADMIN +
                                    "/" +
                                    NavigationConstants.DOI
                            )
                        }
                    >
                        <ListItemIcon>
                            <LabelImportantIcon className={classes.icon} />
                        </ListItemIcon>
                        {open && <ListItemText>{t("doi")}</ListItemText>}
                    </ListItem>
                </Tooltip>
                <Tooltip title={t("refGenomes")} placement="right" arrow>
                    <ListItem
                        button
                        id={build(ids.DRAWER_MENU, ids.REF_GENOME_MI)}
                        className={clsx(classes.nested, classes.listItem)}
                        onClick={() =>
                            router.push(
                                "/" +
                                    NavigationConstants.ADMIN +
                                    "/" +
                                    NavigationConstants.REF_GENOMES
                            )
                        }
                    >
                        <ListItemIcon>
                            <LabelImportantIcon className={classes.icon} />
                        </ListItemIcon>
                        {open && <ListItemText>{t("refGenomes")}</ListItemText>}
                    </ListItem>
                </Tooltip>
                <Tooltip title={t("tools")} placement="right" arrow>
                    <ListItem
                        button
                        id={build(ids.DRAWER_MENU, ids.TOOLS_ADMIN_MI)}
                        className={clsx(classes.nested, classes.listItem)}
                        onClick={() =>
                            router.push(
                                "/" +
                                    NavigationConstants.ADMIN +
                                    "/" +
                                    NavigationConstants.TOOLS
                            )
                        }
                    >
                        <ListItemIcon>
                            <LabelImportantIcon className={classes.icon} />
                        </ListItemIcon>
                        {open && <ListItemText>{t("tools")}</ListItemText>}
                    </ListItem>
                </Tooltip>
                <Tooltip title={t("vice")} placement="right" arrow>
                    <ListItem
                        button
                        id={build(ids.DRAWER_MENU, ids.VICE_MI)}
                        className={clsx(classes.nested, classes.listItem)}
                        onClick={() =>
                            router.push(
                                "/" +
                                    NavigationConstants.ADMIN +
                                    "/" +
                                    NavigationConstants.VICE
                            )
                        }
                    >
                        <ListItemIcon>
                            <LabelImportantIcon className={classes.icon} />
                        </ListItemIcon>
                        {open && <ListItemText>{t("vice")}</ListItemText>}
                    </ListItem>
                </Tooltip>
            </List>
        </List>
    );
    return (
        <>
            <div className={classes.root}>
                <AppBar
                    id={ids.APP_BAR_BASE}
                    position="static"
                    variant="outlined"
                    ref={ref}
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <Hidden smUp>
                            <IconButton
                                aria-label={t("openDrawer")}
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={classes.menuIcon}
                            >
                                <MenuIcon className={"menu-intro"} />
                            </IconButton>
                            <Typography>{t("deTitle")}</Typography>
                        </Hidden>
                        <Hidden xsDown>
                            <a
                                href={constants.CYVERSE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    width={190}
                                    height={39}
                                    src="/de_white.png"
                                    alt={t("cyverse")}
                                ></img>
                            </a>
                            <GlobalSearchField
                                search={searchTerm}
                                selectedFilter={filter}
                            />
                        </Hidden>
                        <div className={classes.root} />
                        <div style={{ display: "flex" }}>
                            <CustomIntercom
                                intercomUnreadCount={intercomUnreadCount}
                            />
                            <BagMenu />
                            <Notifications />
                        </div>
                        <Hidden xsDown>
                            <div id={build(ids.APP_BAR_BASE, ids.ACCOUNT_MI)}>
                                {accountAvatar}
                            </div>
                        </Hidden>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant={isXsDown ? "temporary" : "permanent"}
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
                    open={isXsDown ? open : false}
                    onClose={isXsDown ? toggleDrawer(false) : undefined}
                >
                    <Hidden xsDown>
                        <div className={classes.toolbar}>
                            <IconButton
                                className={classes.menuIcon}
                                onClick={
                                    open ? handleDrawerClose : handleDrawerOpen
                                }
                                aria-label={
                                    open ? t("closeMenu") : t("openMenu")
                                }
                                edge={open ? false : "start"}
                            >
                                {open ? (
                                    theme.direction === "rtl" ? (
                                        <ChevronRightIcon fontSize="large" />
                                    ) : (
                                        <ChevronLeftIcon fontSize="large" />
                                    )
                                ) : (
                                    <MenuIcon
                                        fontSize="large"
                                        className="menu-intro"
                                    />
                                )}
                            </IconButton>
                        </div>
                    </Hidden>
                    <Hidden smUp>
                        <div
                            id={build(ids.DRAWER_MENU, ids.ACCOUNT_MI)}
                            style={{ margin: 8 }}
                        >
                            {userProfile ? (
                                <UserMenu
                                    baseId={build(
                                        ids.DRAWER_MENU,
                                        ids.ACCOUNT_MI
                                    )}
                                    profile={userProfile}
                                    onLogoutClick={onLogoutClick}
                                    onManageAccountClick={() =>
                                        window.open(
                                            constants.CYVERSE_USER_PORTAL,
                                            "_blank"
                                        )
                                    }
                                />
                            ) : (
                                accountAvatar
                            )}
                        </div>
                    </Hidden>
                    <Divider />
                    {drawerItems}
                    {(isXsDown || open) && adminUser && (
                        <>
                            <Divider />
                            {adminDrawerItems}
                        </>
                    )}
                </Drawer>
                <CyVerseAnnouncer />
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={onUserMenuClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <UserMenu
                        baseId={build(ids.APP_BAR_BASE, ids.ACCOUNT_MI)}
                        profile={userProfile}
                        onLogoutClick={onLogoutClick}
                        onManageAccountClick={() =>
                            window.open(constants.CYVERSE_USER_PORTAL, "_blank")
                        }
                    />
                </Popover>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    {children}
                </main>
                {/* SS: In mobile view, joy ride throws exception after refactoring it
                to a separate component. Disable product tour for mobile. */}
                {!isXsDown && newUser && (
                    <ConfirmationDialog
                        baseId={ids.USER_TOUR_DLG}
                        open={newUser}
                        onClose={() => setNewUser(false)}
                        onConfirm={() => {
                            setNewUser(false);
                            setRunTour(true);
                        }}
                        title={i18nTour("tourPromptTitle")}
                        contentText={i18nTour("tourPrompt")}
                    />
                )}
            </div>
            <ProductTour
                onTourExit={() => setRunTour(false)}
                runTour={runTour}
            />
        </>
    );
}
export default withErrorAnnouncer(CyverseAppBar);
