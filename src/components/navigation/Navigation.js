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
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AppsIcon from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button, Grid, Hidden, Paper, Tooltip } from "@material-ui/core";
import { useRouter } from "next/router";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.white,
        color: theme.palette.info.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.white,
        },
    },
    selectedButton: {
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white,
    },

    dashboardButton: {
        backgroundImage: `url("/dashboard.png")`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.white,
        color: theme.palette.info.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.white,
        },
    },
    selectedDashboardButton: {
        backgroundImage: `url("/dashboard.png")`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white,
    },

    dataButton: {
        backgroundImage: `url("/data.png")`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.white,
        color: theme.palette.info.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.white,
        },
    },
    selectedDataButton: {
        backgroundImage: `url("/data.png")`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white,
    },

    appsButton: {
        backgroundImage: `url("/apps.png")`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.white,
        color: theme.palette.info.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.white,
        },
    },
    selectedAppsButton: {
        backgroundImage: `url("/apps.png")`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white,
    },

    analysesButton: {
        backgroundImage: `url("/analyses.png")`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.white,
        color: theme.palette.info.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.white,
        },
    },
    selectedanalysesButton: {
        backgroundImage: `url("/analyses.png")`,
        backgroundPosition: "15px 10px",
        backgroundRepeat: "no-repeat",
        margin: 0,
        borderRadius: 0,
        width: 200,
        height: 50,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white,
    },

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
                            <Hidden xsDown>{getMessage("dashboard")}</Hidden>
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
                            <Hidden xsDown>{getMessage("data")}</Hidden>
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
                            <Hidden xsDown>{getMessage("apps")}</Hidden>
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
                                router.push("/" + NavigationConstants.ANALYSES);
                            }}
                        >
                            <Hidden xsDown>{getMessage("analyses")}</Hidden>
                        </Button>
                    </Tooltip>
                </Grid>
                <Grid item xs>
                    <Button
                        disableElevation
                        className={
                            activeView === MORE
                                ? classes.selectedButton
                                : classes.button
                        }
                        onClick={() => {
                            router.push("/" + NavigationConstants.MORE);
                        }}
                    >
                        <Tooltip title={getMessage("more")}>
                            <MoreHorizIcon />
                        </Tooltip>
                        <Hidden xsDown>{getMessage("more")}</Hidden>
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default withI18N(Navigation, intlData);
