/**
 *
 * @author Sriram
 * A component that displays app level navigation
 */
import React from "react";
import intlData from "./messages";
import NavigationConstants from "./NavigationConstants";
import ids from "./ids";
import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";
import { Button, Grid, Hidden, Paper, Tooltip } from "@material-ui/core";
import { useRouter } from "next/router";
import { makeStyles, useTheme } from "@material-ui/core/styles";

function getButtonStyle(theme, imageUrl, selectedImageUrl) {
    return {
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.white,
        color: theme.palette.info.main,
        "&:hover": {
            backgroundImage: `url(${selectedImageUrl})`,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.white,
        },
    };
}

function getSelectedButtonStyle(theme, imageUrl) {
    return {
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white,
    };
}

const useStyles = makeStyles((theme) => ({
    dashboardButton: getButtonStyle(
        theme,
        "/dashboard.png",
        "/dashboard_selected.png"
    ),

    selectedDashboardButton: getSelectedButtonStyle(
        theme,
        "/dashboard_selected.png"
    ),

    dataButton: getButtonStyle(theme, "/data.png", "/data_selected.png"),
    selectedDataButton: getSelectedButtonStyle(theme, "/data_selected.png"),

    appsButton: getButtonStyle(theme, "/apps.png", "/apps_selected.png"),
    selectedAppsButton: getSelectedButtonStyle(theme, "/apps_selected.png"),

    analysesButton: getButtonStyle(
        theme,
        "/analyses.png",
        "/analyses_selected.png"
    ),
    selectedAnalysesButton: getSelectedButtonStyle(
        theme,
        "/analyses_selected.png"
    ),

    moreButton: getButtonStyle(theme, "/more.png", "/more_selected.png"),
    selectedMoreButton: getSelectedButtonStyle(theme, "/more_selected.png"),

    nav: {
        backgroundColor: theme.palette.white,
        height: 50,
        paddingLeft: 30,
    },
}));

const DASHBOARD = "dashboard";
const DATA = "data";
const APPS = "apps";
const ANALYSES = "analyses";
const MORE = "more";

function Navigation(props) {
    const classes = useStyles();
    const router = useRouter();
    const { activeView } = props;
    const theme = useTheme();
    return (
        <Hidden xsDown>
            <Paper elevation={1} className={classes.nav}>
                <Grid container>
                    <Grid item xs>
                        <Tooltip title={getMessage("dashboard")}>
                            <Button
                                disableElevation
                                id={build(ids.NAVIGATION, ids.DASHBOARD_BTN)}
                                className={
                                    activeView === DASHBOARD
                                        ? classes.selectedDashboardButton
                                        : classes.dashboardButton
                                }
                                onClick={() => {
                                    router.push(
                                        "/" + NavigationConstants.DASHBOARD
                                    );
                                }}
                            >
                                {getMessage("dashboard")}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("data")}>
                            <Button
                                disableElevation
                                className={
                                    activeView === DATA
                                        ? classes.selectedDataButton
                                        : classes.dataButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.DATA);
                                }}
                            >
                                {getMessage("data")}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("apps")}>
                            <Button
                                disableElevation
                                className={
                                    activeView === APPS
                                        ? classes.selectedAppsButton
                                        : classes.appsButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.APPS);
                                }}
                            >
                                {getMessage("apps")}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("analyses")}>
                            <Button
                                disableElevation
                                className={
                                    activeView === ANALYSES
                                        ? classes.selectedAnalysesButton
                                        : classes.analysesButton
                                }
                                onClick={() => {
                                    router.push(
                                        "/" + NavigationConstants.ANALYSES
                                    );
                                }}
                            >
                                {getMessage("analyses")}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("more")}>
                            <Button
                                disableElevation
                                className={
                                    activeView === MORE
                                        ? classes.selectedMoreButton
                                        : classes.moreButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.MORE);
                                }}
                            >
                                {getMessage("more")}
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>
        </Hidden>
    );
}

export default withI18N(Navigation, intlData);
