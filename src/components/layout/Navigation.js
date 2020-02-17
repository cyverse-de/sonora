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
<<<<<<< HEAD
import { makeStyles } from "@material-ui/core/styles";
=======
import { makeStyles, useTheme } from "@material-ui/core/styles";
>>>>>>> 1e3d422... Refactor code.

function getButtonStyle(theme, imageUrl, selectedImageUrl) {
    return {
        backgroundImage: `url(${imageUrl})`,
<<<<<<< HEAD
=======
        backgroundPosition: "15px 10px",
>>>>>>> 1e3d422... Refactor code.
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
<<<<<<< HEAD
            color: theme.palette.primary.contrastText,
        },
        [theme.breakpoints.down("md")]: {
            width: 50,
=======
            color: theme.palette.white,
>>>>>>> 1e3d422... Refactor code.
        },
    };
}

function getSelectedButtonStyle(theme, imageUrl) {
    return {
        backgroundImage: `url(${imageUrl})`,
<<<<<<< HEAD
=======
        backgroundPosition: "15px 10px",
>>>>>>> 1e3d422... Refactor code.
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.primary.main,
<<<<<<< HEAD
        color: theme.palette.primary.contrastText,
        [theme.breakpoints.down("md")]: {
            width: 50,
        },
=======
        color: theme.palette.white,
>>>>>>> 1e3d422... Refactor code.
    };
}

const useStyles = makeStyles((theme) => ({
<<<<<<< HEAD
    dashboardButton: {
        backgroundPosition: "15px 10px",
        ...getButtonStyle(theme, "/dashboard.png", "/dashboard_selected.png"),
    },

    selectedDashboardButton: {
        backgroundPosition: "15px 10px",
        ...getSelectedButtonStyle(theme, "/dashboard_selected.png"),
    },

    dataButton: {
        backgroundPosition: "15px 10px",
        ...getButtonStyle(theme, "/data.png", "/data_selected.png"),
    },
    selectedDataButton: {
        backgroundPosition: "15px 10px",
        ...getSelectedButtonStyle(theme, "/data_selected.png"),
    },

    appsButton: {
        backgroundPosition: "15px 10px",
        ...getButtonStyle(theme, "/apps.png", "/apps_selected.png"),
    },
    selectedAppsButton: {
        backgroundPosition: "15px 10px",
        ...getSelectedButtonStyle(theme, "/apps_selected.png"),
    },

    analysesButton: {
        backgroundPosition: "10px 5px",
        ...getButtonStyle(theme, "/analyses.png", "/analyses_selected.png"),
    },
    selectedAnalysesButton: {
        backgroundPosition: "10px 5px",
        ...getSelectedButtonStyle(theme, "/analyses_selected.png"),
    },

    moreButton: {
        backgroundPosition: "30px 20px",
        ...getButtonStyle(theme, "/more.png", "/more_selected.png"),
    },
    selectedMoreButton: {
        backgroundPosition: "30px 20px",
        ...getSelectedButtonStyle(theme, "/more_selected.png"),
    },
=======
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
>>>>>>> 1e3d422... Refactor code.

    nav: {
        backgroundColor: theme.palette.white,
        height: 50,
        paddingLeft: 30,
    },
}));

<<<<<<< HEAD
=======
const DASHBOARD = "dashboard";
const DATA = "data";
const APPS = "apps";
const ANALYSES = "analyses";
const MORE = "more";

>>>>>>> 1e3d422... Refactor code.
function Navigation(props) {
    const classes = useStyles();
    const router = useRouter();
    const { activeView } = props;
<<<<<<< HEAD

=======
    const theme = useTheme();
>>>>>>> 1e3d422... Refactor code.
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
<<<<<<< HEAD
                                    activeView === NavigationConstants.DASHBOARD
=======
                                    activeView === DASHBOARD
>>>>>>> 1e3d422... Refactor code.
                                        ? classes.selectedDashboardButton
                                        : classes.dashboardButton
                                }
                                onClick={() => {
                                    router.push(
                                        "/" + NavigationConstants.DASHBOARD
                                    );
                                }}
                            >
<<<<<<< HEAD
                                <Hidden mdDown>
                                    {getMessage("dashboard")}
                                </Hidden>
=======
                                {getMessage("dashboard")}
>>>>>>> 1e3d422... Refactor code.
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("data")}>
                            <Button
<<<<<<< HEAD
                                id={build(ids.NAVIGATION, ids.DATA_BTN)}
                                disableElevation
                                className={
                                    activeView === NavigationConstants.DATA
=======
                                disableElevation
                                className={
                                    activeView === DATA
>>>>>>> 1e3d422... Refactor code.
                                        ? classes.selectedDataButton
                                        : classes.dataButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.DATA);
                                }}
                            >
<<<<<<< HEAD
                                <Hidden mdDown>{getMessage("data")}</Hidden>
=======
                                {getMessage("data")}
>>>>>>> 1e3d422... Refactor code.
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("apps")}>
                            <Button
<<<<<<< HEAD
                                id={build(ids.NAVIGATION, ids.APPS_BTN)}
                                disableElevation
                                className={
                                    activeView === NavigationConstants.APPS
=======
                                disableElevation
                                className={
                                    activeView === APPS
>>>>>>> 1e3d422... Refactor code.
                                        ? classes.selectedAppsButton
                                        : classes.appsButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.APPS);
                                }}
                            >
<<<<<<< HEAD
                                <Hidden mdDown>{getMessage("apps")}</Hidden>
=======
                                {getMessage("apps")}
>>>>>>> 1e3d422... Refactor code.
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("analyses")}>
                            <Button
<<<<<<< HEAD
                                id={build(ids.NAVIGATION, ids.ANALYSES_BTN)}
                                disableElevation
                                className={
                                    activeView === NavigationConstants.ANALYSES
=======
                                disableElevation
                                className={
                                    activeView === ANALYSES
>>>>>>> 1e3d422... Refactor code.
                                        ? classes.selectedAnalysesButton
                                        : classes.analysesButton
                                }
                                onClick={() => {
                                    router.push(
                                        "/" + NavigationConstants.ANALYSES
                                    );
                                }}
                            >
<<<<<<< HEAD
                                <Hidden mdDown>{getMessage("analyses")}</Hidden>
=======
                                {getMessage("analyses")}
>>>>>>> 1e3d422... Refactor code.
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("more")}>
                            <Button
<<<<<<< HEAD
                                id={build(ids.NAVIGATION, ids.MORE_BTN)}
                                disableElevation
                                className={
                                    activeView === NavigationConstants.MORE
=======
                                disableElevation
                                className={
                                    activeView === MORE
>>>>>>> 1e3d422... Refactor code.
                                        ? classes.selectedMoreButton
                                        : classes.moreButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.MORE);
                                }}
                            >
<<<<<<< HEAD
                                <Hidden mdDown>{getMessage("more")}</Hidden>
=======
                                {getMessage("more")}
>>>>>>> 1e3d422... Refactor code.
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>
        </Hidden>
    );
}

export default withI18N(Navigation, intlData);
