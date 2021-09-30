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
import styles from "./styles";
import NavigationConstants from "common/NavigationConstants";
import AnalysesIcon from "components/icons/AnalysesIcon";
import DataIcon from "components/icons/DataIcon";
import { TeamIcon } from "components/teams/Icons";
import AdminDrawerItems from "./AdminDrawerItems";
import {
    Avatar,
    Divider,
    Hidden,
    List,
    Typography,
    makeStyles,
} from "@material-ui/core";
import { useUserProfile } from "contexts/userProfile";
import AppsIcon from "@material-ui/icons/Apps";
import HelpIcon from "@material-ui/icons/Help";
import HomeIcon from "@material-ui/icons/Home";
import ToolIcon from "@material-ui/icons/LabelImportant";
import InstantLaunchDefaultIcon from "@material-ui/icons/PlayCircleOutlineOutlined";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import { Web } from "@material-ui/icons";
import { openInteractiveUrl } from "../analyses/utils";
import { CollectionIcon } from "../collections/Icons";
import InstantLaunchButtonWrapper from "../instantlaunches/InstantLaunchButtonWrapper";

const useStyles = makeStyles(styles);

function InstantLaunchIcon(props) {
    const { instantLaunch } = props;
    const classes = useStyles();
    if (instantLaunch?.quick_launch_name === "cli") {
        return (
            <Avatar variant="rounded" className={classes.instantLaunchAvatar}>
                <Typography
                    variant="button"
                    style={{ fontSize: "1.5rem" }}
                    classes={{ root: classes.instantLaunchText }}
                >
                    {">_"}
                </Typography>
            </Avatar>
        );
    }
    return <InstantLaunchDefaultIcon {...props} />;
}

function DrawerItems(props) {
    const {
        open,
        activeView,
        toggleDrawer,
        isXsDown,
        adminUser,
        runningViceJobs,
        instantLaunches,
    } = props;
    const { t } = useTranslation(["common"]);
    const [userProfile] = useUserProfile();

    return (
        <List style={{ overflowY: "auto", overflowX: "hidden" }}>
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
                <DrawerItem
                    nested
                    title={t("tools")}
                    id={ids.TOOLS_MI}
                    thisView={NavigationConstants.TOOLS}
                    activeView={activeView}
                    toggleDrawer={toggleDrawer}
                    open={open}
                    icon={ToolIcon}
                />
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
            {open &&
                runningViceJobs?.map((analysis) => (
                    <DrawerItem
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
                    instantLaunch={instantLaunch}
                    render={(onClick) => (
                        <DrawerItem
                            key={instantLaunch.id}
                            title={instantLaunch.app_name}
                            id={instantLaunch.quick_launch_name}
                            icon={() => (
                                <InstantLaunchIcon
                                    instantLaunch={instantLaunch}
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
            {(isXsDown || open) && adminUser && (
                <>
                    <Divider />
                    <AdminDrawerItems open={open} activeView={activeView} />
                </>
            )}
        </List>
    );
}

export default DrawerItems;
