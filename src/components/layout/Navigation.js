/**
 *
 * @author Sriram
 * A component that displays app level navigation
 */
import React from "react";
import intlData from "./messages";
import NavigationConstants from "../../common/NavigationConstants";
import ids from "./ids";
import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";
import { Button, Grid, Hidden, Paper, Tooltip } from "@material-ui/core";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";

function getButtonStyle(theme, imageUrl, selectedImageUrl) {
    return {
        backgroundImage: `url(${imageUrl})`,
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
            color: theme.palette.primary.contrastText,
        },
        [theme.breakpoints.down("md")]: {
            width: 50,
        },
    };
}

function getSelectedButtonStyle(theme, imageUrl) {
    return {
        backgroundImage: `url(${imageUrl})`,
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        [theme.breakpoints.down("md")]: {
            width: 50,
        },
    };
}

const useStyles = makeStyles((theme) => ({
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

    nav: {
        backgroundColor: theme.palette.white,
        height: 50,
        width: "100%",
        paddingLeft: 30,
        position: "fixed",
        zIndex: 4,
    },
}));

function Navigation(props) {
    const classes = useStyles();
    const router = useRouter();
    const { activeView } = props;

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
                                    activeView === NavigationConstants.DASHBOARD
                                        ? classes.selectedDashboardButton
                                        : classes.dashboardButton
                                }
                                onClick={() => {
                                    router.push(
                                        "/" + NavigationConstants.DASHBOARD
                                    );
                                }}
                            >
                                <Hidden mdDown>
                                    {getMessage("dashboard")}
                                </Hidden>
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("data")}>
                            <Button
                                id={build(ids.NAVIGATION, ids.DATA_BTN)}
                                disableElevation
                                className={
                                    activeView === NavigationConstants.DATA
                                        ? classes.selectedDataButton
                                        : classes.dataButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.DATA);
                                }}
                            >
                                <Hidden mdDown>{getMessage("data")}</Hidden>
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("apps")}>
                            <Button
                                id={build(ids.NAVIGATION, ids.APPS_BTN)}
                                disableElevation
                                className={
                                    activeView === NavigationConstants.APPS
                                        ? classes.selectedAppsButton
                                        : classes.appsButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.APPS);
                                }}
                            >
                                <Hidden mdDown>{getMessage("apps")}</Hidden>
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("analyses")}>
                            <Button
                                id={build(ids.NAVIGATION, ids.ANALYSES_BTN)}
                                disableElevation
                                className={
                                    activeView === NavigationConstants.ANALYSES
                                        ? classes.selectedAnalysesButton
                                        : classes.analysesButton
                                }
                                onClick={() => {
                                    router.push(
                                        "/" + NavigationConstants.ANALYSES
                                    );
                                }}
                            >
                                <Hidden mdDown>{getMessage("analyses")}</Hidden>
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Tooltip title={getMessage("more")}>
                            <Button
                                id={build(ids.NAVIGATION, ids.MORE_BTN)}
                                disableElevation
                                className={
                                    activeView === NavigationConstants.MORE
                                        ? classes.selectedMoreButton
                                        : classes.moreButton
                                }
                                onClick={() => {
                                    router.push("/" + NavigationConstants.MORE);
                                }}
                            >
                                <Hidden mdDown>{getMessage("more")}</Hidden>
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>
        </Hidden>
    );
}

export default withI18N(Navigation, intlData);
