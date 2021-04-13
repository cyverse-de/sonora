/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu. Also renders a drawer menu
 * in small screens instead of Navigation bar
 *
 */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "i18n";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import clsx from "clsx";

import NavigationConstants from "common/NavigationConstants";
import Bag from "components/Bag";
import ProductTour from "components/help/ProductTour";
import searchConstants from "components/search/constants";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import { useBootstrapInfo } from "contexts/bootstrap";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import { intercomLogout } from "common/intercom";

import {
    getUserProfile,
    useBootStrap,
    USER_PROFILE_QUERY_KEY,
} from "serviceFacades/users";
import constants from "../../constants";
import withErrorAnnouncer from "../utils/error/withErrorAnnouncer";
import AdminDrawerItems from "./AdminDrawerItems";
import CustomIntercom from "./CustomIntercom";
import DrawerItems from "./DrawerItems";
import ids from "./ids";
import Notifications from "./Notifications";
import styles from "./styles";
import UserMenu from "./UserMenu";

import { build, CyVerseAnnouncer } from "@cyverse-de/ui-lib";
import {
    AppBar,
    Avatar,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    Popover,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";

// hidden in xsDown
const GlobalSearchField = dynamic(() => import("../search/GlobalSearchField"));

const ENTITLEMENT = "entitlement";

const useStyles = makeStyles(styles);

const BagMenu = () => {
    const classes = useStyles();

    return <Bag menuIconClass={classes.menuIcon} />;
};

function DEAppBar(props) {
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
        intercomLogout();
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
                    <DrawerItems
                        open={open}
                        activeView={activeView}
                        toggleDrawer={toggleDrawer}
                    />
                    {(isXsDown || open) && adminUser && (
                        <>
                            <Divider />
                            <AdminDrawerItems
                                open={open}
                                activeView={activeView}
                            />
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
export default withErrorAnnouncer(DEAppBar);
