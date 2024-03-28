/**
 * @author sriram
 *
 * Drawer Menu items.
 *
 **/
import React from "react";
import { useTranslation } from "i18n";

import DrawerItem from "./DrawerItem";
import ids from "./ids";
import NavigationConstants from "common/NavigationConstants";
import analysisStatus from "components/models/analysisStatus";
import AnalysesIcon from "components/icons/AnalysesIcon";
import DataIcon from "components/icons/DataIcon";
import { TeamIcon } from "components/teams/Icons";
import AdminDrawerItems from "./AdminDrawerItems";
import { Badge, Divider, List, Tooltip, useTheme } from "@mui/material";
import { useUserProfile } from "contexts/userProfile";
import AppsIcon from "@mui/icons-material/Apps";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import NestedIcon from "@mui/icons-material/LabelImportant";
import InstantLaunchDefaultIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { Web } from "@mui/icons-material";
import { openInteractiveUrl } from "../analyses/utils";
import { CollectionIcon } from "../collections/Icons";
import InstantLaunchButtonWrapper from "../instantlaunches/InstantLaunchButtonWrapper";
import TerminalIcon from "../icons/TerminalIcon";
import useBreakpoints from "./useBreakpoints";

function InstantLaunchIcon(props) {
    const { instantLaunch } = props;
    if (instantLaunch?.quick_launch_name === "cli") {
        return <TerminalIcon width={35} height={35} />;
    }
    return <InstantLaunchDefaultIcon {...props} />;
}

function WrappedDataIcon(dataUsagePercentage, t, theme) {
    if (dataUsagePercentage < 50) {
        return DataIcon;
    }

    const usageTitle = t("dataNavUsageTitle", {
        percentage: dataUsagePercentage,
    });

    const BadgeContent =
        dataUsagePercentage >= 100 ? (
            <ErrorIcon color="error" />
        ) : dataUsagePercentage >= 75 ? (
            <WarningIcon style={{ color: theme.palette.yellow }} />
        ) : (
            <InfoIcon color="secondary" />
        );

    return (props) => (
        <Tooltip title={usageTitle} placement="top-start">
            <Badge badgeContent={BadgeContent}>
                <DataIcon {...props} />
            </Badge>
        </Tooltip>
    );
}

function WrappedAnalysesIcon(analysesStats) {
    const runningStats =
        analysesStats &&
        analysesStats["status-count"].find(
            (stat) => stat.status === analysisStatus.RUNNING
        );

    return runningStats?.count > 0
        ? (props) => (
              <Badge badgeContent={runningStats.count} color="error">
                  <AnalysesIcon {...props} />
              </Badge>
          )
        : AnalysesIcon;
}

function DrawerItems(props) {
    const {
        open,
        activeView,
        toggleDrawer,
        isSmDown,
        adminUser,
        analysesStats,
        runningViceJobs,
        instantLaunches,
        computeLimitExceeded,
        dataUsagePercentage,
    } = props;
    const { t } = useTranslation(["common"]);
    const theme = useTheme();
    const [userProfile] = useUserProfile();
    const { isSmUp } = useBreakpoints();

    return (
        <List style={{ overflowY: "auto", overflowX: "hidden" }}>
            <DrawerItem
                title={t("home")}
                id={ids.DASHBOARD_MI}
                icon={HomeIcon}
                thisView={NavigationConstants.DASHBOARD}
                cxBase={"dashboard-intro"}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            <DrawerItem
                title={t("data")}
                id={ids.DATA_MI}
                icon={WrappedDataIcon(dataUsagePercentage, t, theme)}
                thisView={NavigationConstants.DATA}
                cxBase={"data-intro"}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            <DrawerItem
                title={t("apps")}
                id={ids.APPS_MI}
                thisView={NavigationConstants.APPS}
                cxBase={"apps-intro"}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
                icon={AppsIcon}
            />
            {open && (
                <>
                    <DrawerItem
                        nested
                        title={t("tools")}
                        id={ids.TOOLS_MI}
                        thisView={NavigationConstants.TOOLS}
                        activeView={activeView}
                        toggleDrawer={toggleDrawer}
                        open={open}
                        icon={NestedIcon}
                    />
                    <DrawerItem
                        nested
                        title={t("instantLaunches")}
                        id={ids.INSTANT_LAUNCHES_MI}
                        thisView={NavigationConstants.INSTANT_LAUNCHES}
                        activeView={activeView}
                        toggleDrawer={toggleDrawer}
                        open={open}
                        icon={NestedIcon}
                    />
                </>
            )}
            <DrawerItem
                title={t("analyses")}
                id={ids.ANALYSES_MI}
                icon={WrappedAnalysesIcon(analysesStats)}
                thisView={NavigationConstants.ANALYSES}
                cxBase={"analyses-intro"}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            {open &&
                runningViceJobs?.map((analysis) => (
                    <DrawerItem
                        key={analysis.id}
                        nested
                        title={analysis.name}
                        id={analysis.id}
                        icon={Web}
                        activeView={activeView}
                        toggleDrawer={toggleDrawer}
                        open={open}
                        onClick={() => {
                            const accessUrl = analysis.interactive_urls[0];
                            openInteractiveUrl(accessUrl);
                        }}
                    />
                ))}
            {instantLaunches?.map((instantLaunch) => (
                <InstantLaunchButtonWrapper
                    key={instantLaunch.id}
                    instantLaunch={instantLaunch}
                    computeLimitExceeded={computeLimitExceeded}
                    render={(onClick) => (
                        <DrawerItem
                            key={instantLaunch.id}
                            title={instantLaunch.app_name}
                            id={instantLaunch.quick_launch_name}
                            icon={(props) => (
                                <InstantLaunchIcon
                                    instantLaunch={instantLaunch}
                                    {...props}
                                />
                            )}
                            activeView={activeView}
                            toggleDrawer={toggleDrawer}
                            open={open}
                            onClick={onClick}
                        />
                    )}
                />
            ))}
            <DrawerItem
                title={t("teams")}
                id={ids.TEAMS_MI}
                icon={TeamIcon}
                thisView={NavigationConstants.TEAMS}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            <DrawerItem
                title={t("collections")}
                id={ids.COLLECTIONS_MI}
                icon={CollectionIcon}
                thisView={NavigationConstants.COLLECTIONS}
                activeView={activeView}
                toggleDrawer={toggleDrawer}
                open={open}
            />
            {!isSmUp && (
                <DrawerItem
                    title={t("search")}
                    id={ids.SEARCH_MI}
                    icon={SearchIcon}
                    thisView={NavigationConstants.SEARCH}
                    cxBase={"search-intro"}
                    activeView={activeView}
                    toggleDrawer={toggleDrawer}
                    open={open}
                />
            )}
            <Divider />
            {userProfile?.id && (
                <DrawerItem
                    title={t("settings")}
                    id={ids.SETTINGS_MI}
                    icon={SettingsIcon}
                    thisView={NavigationConstants.SETTINGS}
                    cxBase={"preferences-intro"}
                    activeView={activeView}
                    toggleDrawer={toggleDrawer}
                    open={open}
                />
            )}
            <DrawerItem
                cxBase={"help-intro"}
                activeView={activeView}
                thisView={NavigationConstants.HELP}
                toggleDrawer={toggleDrawer}
                open={open}
                id="help"
                title={t("help")}
                icon={HelpIcon}
            />
            {(isSmDown || open) && adminUser && (
                <>
                    <Divider />
                    <AdminDrawerItems open={open} activeView={activeView} />
                </>
            )}
        </List>
    );
}

export default DrawerItems;
