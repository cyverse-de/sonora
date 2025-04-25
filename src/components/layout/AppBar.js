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
import { useQuery, useQueryClient } from "react-query";

import NavigationConstants from "common/NavigationConstants";
import Bag from "components/bags";
import searchConstants from "components/search/constants";
import { formatUsagePercentage } from "components/subscriptions/utils";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import { useBootstrapInfo } from "contexts/bootstrap";
import { intercomLogout } from "common/intercom";

import {
    activeAlerts,
    ACTIVE_ALERTS_QUERY_KEY,
} from "serviceFacades/notifications";

import {
    getUserProfile,
    useBootStrap,
    USER_PROFILE_QUERY_KEY,
} from "serviceFacades/users";

import constants from "../../constants";
import withErrorAnnouncer from "../error/withErrorAnnouncer";
import CustomIntercom from "./CustomIntercom";
import DrawerItems from "./DrawerItems";
import ids from "./ids";
import Notifications from "./Notifications";
import styles from "./styles";
import UserMenu from "./UserMenu";

import SvgDEAppBarLogo from "components/icons/DEAppBarLogo";

import buildID from "components/utils/DebugIDUtil";
import CyVerseAnnouncer from "components/announcer/CyVerseAnnouncer";

import {
    AppBar,
    Avatar,
    Divider,
    Drawer,
    IconButton,
    Popover,
    Toolbar,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { useNotifications } from "contexts/pushNotifications";
import { useRunningViceJobs } from "serviceFacades/analyses";
import {
    isAnalysisNotification,
    isViceNotification,
} from "components/notifications/utils";
import analysisStatus from "components/models/analysisStatus";
import UserPortalUpdatePrompts from "./UserPortalUpdatePrompts";
import useFirstClassInstantLaunch from "../instantlaunches/useFirstClassInstantLaunch";
import {
    ANALYSES_STATS_QUERY_KEY,
    RESOURCE_USAGE_QUERY_KEY,
    getAnalysesStats,
    getResourceUsageSummary,
} from "serviceFacades/dashboard";
import { getUserQuota } from "common/resourceUsage";

import markdownToHtml from "components/utils/markdownToHtml";

import useBreakpoints from "./useBreakpoints";

// hidden in xsDown
const GlobalSearchField = dynamic(() => import("../search/GlobalSearchField"));

const ENTITLEMENT = "entitlement";

const useStyles = makeStyles()(styles);

const BagMenu = () => {
    const { classes } = useStyles();

    return <Bag menuIconClass={classes.menuIcon} />;
};

function DEAppBar(props) {
    const { classes, cx } = useStyles();
    const theme = useTheme();
    const router = useRouter();
    const queryClient = useQueryClient();

    const ref = useRef();
    const [config, setConfig] = useConfig();
    const { t } = useTranslation("common");

    const cyverse_url = config?.cyverseURL;
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
    const [userSubscription, setUserSubscription] = useState(null);
    const { currentNotification } = useNotifications();
    const [avatarLetter, setAvatarLetter] = useState("");
    const [open, setOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(false);
    const [bootstrapError, setBootstrapError] = useState(null);
    const [bootstrapInfo, setBootstrapInfo] = useBootstrapInfo();
    const [bootstrapQueryEnabled, setBootstrapQueryEnabled] = useState(false);
    const [profileRefetchInterval, setProfileRefetchInterval] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [runningViceJobs, setRunningViceJobs] = useState([]);
    const [computeLimitExceeded, setComputeLimitExceeded] = useState(
        !!config?.subscriptions?.enforce
    );
    const [dataUsagePercentage, setDataUsagePercentage] = useState(0);
    const [activeAlertsList, setActiveAlertsList] = useState([]);

    const { isSmUp, isSmDown } = useBreakpoints();

    if (activeView === NavigationConstants.APPS) {
        filter = searchConstants.APPS;
    } else if (activeView === NavigationConstants.ANALYSES) {
        filter = searchConstants.ANALYSES;
    } else if (
        activeView === NavigationConstants.DATA &&
        config?.elasticEnabled
    ) {
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
        enabled: profileRefetchInterval != null,
        onSuccess: updateUserProfile,
        refetchInterval: profileRefetchInterval,
    });

    function updateAlerts(queryresp) {
        const alertsMdPromises = queryresp?.alerts.map((alertMap) =>
            markdownToHtml(alertMap.alert)
        );
        Promise.all(alertsMdPromises).then((values) => {
            if (
                values.length !== activeAlertsList.length ||
                !values.every((el, idx) => activeAlertsList[idx] === el)
            ) {
                setActiveAlertsList(values || []);
            }
        });
    }

    useQuery({
        queryKey: ACTIVE_ALERTS_QUERY_KEY,
        queryFn: activeAlerts,
        enabled: true,
        onSuccess: updateAlerts,
        refetchInterval: 120000,
    });

    useEffect(() => {
        if (clientConfig) {
            let config = { ...clientConfig };
            // Disable Intercom if a subscription is Basic
            if (userSubscription) {
                let planName = userSubscription?.plan?.name;
                let isBasic = planName?.toLowerCase() === "basic";
                config.intercom = {
                    ...clientConfig.intercom,
                    enabled:
                        clientConfig.intercom.enabled && planName && !isBasic,
                };
            } else {
                // Disable Intercom if user subscription isn't loaded
                config.intercom = {
                    ...clientConfig.intercom,
                    enabled: false,
                };
            }
            setConfig(config);
            setProfileRefetchInterval(clientConfig.sessions.poll_interval_ms);
        }
    }, [clientConfig, setConfig, userSubscription]);

    useQuery({
        queryKey: [RESOURCE_USAGE_QUERY_KEY],
        queryFn: getResourceUsageSummary,
        enabled: !!config?.subscriptions?.enforce && !!userProfile?.id,
        onSuccess: (respData) => {
            const computeUsage = respData?.cpu_usage?.total || 0;
            const dataUsage = respData?.data_usage?.total || 0;
            const subscription = respData?.subscription;

            const computeQuota = getUserQuota(
                constants.CPU_HOURS_RESOURCE_NAME,
                subscription
            );
            const storageQuota = getUserQuota(
                constants.DATA_STORAGE_RESOURCE_NAME,
                subscription
            );

            setUserSubscription(subscription);
            setComputeLimitExceeded(computeUsage >= computeQuota);
            setDataUsagePercentage(
                formatUsagePercentage(dataUsage, storageQuota)
            );
        },
        onError: (e) => {
            showErrorAnnouncer(t("usageSummaryError"), e);
        },
    });

    const { data: analysesStats } = useQuery(
        [ANALYSES_STATS_QUERY_KEY],
        getAnalysesStats
    );

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
        if (userProfile && !bootstrapInfo) {
            setBootstrapQueryEnabled(true);
        }
    }, [userProfile, bootstrapInfo]);

    useBootStrap(bootstrapQueryEnabled, setBootstrapInfo, setBootstrapError);

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
        if (adminUser && !userProfile?.admin) {
            const adminProfile = {
                admin: true,
                ...userProfile,
            };
            setUserProfile(adminProfile);
        }
    }, [adminUser, setUserProfile, userProfile]);

    useEffect(() => {
        if (isAnalysisNotification(currentNotification)) {
            const analysis = currentNotification.message.payload;
            const status = analysis.analysisstatus;

            if (
                [
                    analysisStatus.RUNNING,
                    analysisStatus.CANCELED,
                    analysisStatus.COMPLETED,
                ].includes(status)
            ) {
                queryClient.invalidateQueries([ANALYSES_STATS_QUERY_KEY]);

                if (isViceNotification(currentNotification)) {
                    if (analysisStatus.RUNNING === status) {
                        setRunningViceJobs([analysis, ...runningViceJobs]);
                    } else {
                        setRunningViceJobs(
                            runningViceJobs.filter(
                                (running) => running.id !== analysis.id
                            )
                        );
                    }
                }
            }
        }
    }, [currentNotification, runningViceJobs, queryClient]);

    let userPortalURLRef = useRef(constants.DEFAULT_USER_PORTAL_URL);
    useEffect(() => {
        if (config?.userPortalURL) {
            userPortalURLRef.current = config.userPortalURL;
        }
    }, [config]);

    // This query is cached because after logging in we'll update the list based on the
    // incoming notifications instead of re-running this query
    const { isFetching: isFetchingRunningVice } = useRunningViceJobs({
        enabled: !!userProfile?.id,
        onSuccess: (resp) => setRunningViceJobs(resp?.analyses),
        staleTime: Infinity,
        cacheTime: Infinity,
    });

    const { instantLaunches } = useFirstClassInstantLaunch();

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

    const onShowDetailedSearch = (query) => {
        router.push({
            pathname: `/${NavigationConstants.SEARCH}`,
            query,
        });
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
            <AppBar
                id={ids.APP_BAR_BASE}
                position="static"
                variant="outlined"
                elevation={0}
                ref={ref}
                className={cx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                {activeAlertsList?.map((text) => {
                    return (
                        <Toolbar
                            key={text}
                            variant="dense"
                            sx={{ bgcolor: "red" }}
                        >
                            <Typography
                                dangerouslySetInnerHTML={{ __html: text }}
                            />
                        </Toolbar>
                    );
                })}
                <Toolbar>
                    {!isSmUp && (
                        <>
                            <IconButton
                                aria-label={t("openDrawer")}
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={classes.menuIcon}
                                size="large"
                            >
                                <MenuIcon className={"menu-intro"} />
                            </IconButton>
                            <Typography>{t("deTitle")}</Typography>
                        </>
                    )}

                    {!isSmDown && (
                        <>
                            <a
                                href={cyverse_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <SvgDEAppBarLogo className={classes.icon} />
                            </a>
                            <GlobalSearchField
                                search={searchTerm}
                                selectedFilter={filter}
                                onShowDetailedSearch={onShowDetailedSearch}
                            />
                        </>
                    )}

                    <div className={classes.root} />
                    <div style={{ display: "flex" }}>
                        <CustomIntercom
                            intercomUnreadCount={intercomUnreadCount}
                        />
                        <BagMenu />
                        <Notifications
                            runningViceJobs={runningViceJobs}
                            isFetchingRunningVice={isFetchingRunningVice}
                        />
                    </div>
                    {!isSmDown && (
                        <div id={buildID(ids.APP_BAR_BASE, ids.ACCOUNT_MI)}>
                            {accountAvatar}
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                variant={isSmDown ? "temporary" : "permanent"}
                className={cx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: cx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
                open={isSmDown ? open : true}
                onClose={isSmDown ? toggleDrawer(false) : undefined}
            >
                {!isSmDown && (
                    <div>
                        <IconButton
                            className={classes.menuIcon}
                            onClick={
                                open ? handleDrawerClose : handleDrawerOpen
                            }
                            aria-label={open ? t("closeMenu") : t("openMenu")}
                            edge={open ? false : "start"}
                            size="large"
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
                )}

                {!isSmUp && (
                    <div
                        id={buildID(ids.DRAWER_MENU, ids.ACCOUNT_MI)}
                        style={{ margin: 8 }}
                    >
                        {userProfile ? (
                            <UserMenu
                                baseId={buildID(
                                    ids.DRAWER_MENU,
                                    ids.ACCOUNT_MI
                                )}
                                profile={userProfile}
                                subscription={userSubscription}
                                onLogoutClick={onLogoutClick}
                                onManageAccountClick={() =>
                                    window.open(
                                        userPortalURLRef.current,
                                        "_blank"
                                    )
                                }
                            />
                        ) : (
                            accountAvatar
                        )}
                    </div>
                )}

                <Divider />
                <DrawerItems
                    open={open}
                    activeView={activeView}
                    toggleDrawer={toggleDrawer}
                    isSmDown={isSmDown}
                    adminUser={adminUser}
                    analysesStats={analysesStats}
                    runningViceJobs={runningViceJobs}
                    instantLaunches={instantLaunches}
                    computeLimitExceeded={computeLimitExceeded}
                    dataUsagePercentage={dataUsagePercentage}
                />
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
                    baseId={buildID(ids.APP_BAR_BASE, ids.ACCOUNT_MI)}
                    profile={userProfile}
                    subscription={userSubscription}
                    onLogoutClick={onLogoutClick}
                    onManageAccountClick={() =>
                        window.open(userPortalURLRef.current, "_blank")
                    }
                />
            </Popover>
            <UserPortalUpdatePrompts />
            <main
                className={cx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                {children}
            </main>
        </>
    );
}

export default withErrorAnnouncer(DEAppBar);
