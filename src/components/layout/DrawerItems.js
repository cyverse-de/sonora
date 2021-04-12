/**
 * @author sriram
 *
 * Drawer Menu items.
 *
 **/
import React from "react";
import clsx from "clsx";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";

import { build } from "@cyverse-de/ui-lib";

import DrawerItem from "./DrawerItem";
import ids from "./ids";
import NavigationConstants from "common/NavigationConstants";
import AnalysesIcon from "components/icons/AnalysesIcon";
import DataIcon from "components/icons/DataIcon";
import { TeamIcon } from "components/teams/Icons";
import AdminDrawerItems from "./AdminDrawerItems";
import {
    Divider,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@material-ui/core";
import { useUserProfile } from "contexts/userProfile";
import { makeStyles } from "@material-ui/core/styles";
import AppsIcon from "@material-ui/icons/Apps";
import HelpIcon from "@material-ui/icons/Help";
import HomeIcon from "@material-ui/icons/Home";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import styles from "./styles";

const useStyles = makeStyles(styles);

export default function DrawerItems(props) {
    const { t } = useTranslation(["common"]);
    const classes = useStyles();
    const [userProfile] = useUserProfile();
    const router = useRouter();
    const { open, activeView, toggleDrawer, isXsDown, adminUser } = props;
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
            <DrawerItem
                title={t("teams")}
                id={ids.TEAMS_MI}
                icon={TeamIcon}
                thisView={NavigationConstants.TEAMS}
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
