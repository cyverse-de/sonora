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
        margin: 1,
        "&:hover": {
            backgroundColor: theme.palette.blue,
            color: theme.palette.white,
        },
    },

    selectedButton: {
        margin: 1,
        backgroundColor: theme.palette.blue,
        color: theme.palette.white,
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
        <Paper
            elevation={10}
            style={{ backgroundColor: theme.palette.lightGray }}
        >
            <Grid container>
                <Grid item xs>
                    <Button
                        id={build(ids.NAVIGATION, ids.DASHBOARD_BTN)}
                        className={
                            activeView === DASHBOARD
                                ? classes.selectedButton
                                : classes.button
                        }
                        onClick={() => {
                            router.push("/" + NavigationConstants.DASHBOARD);
                        }}
                    >
                        <Tooltip title={getMessage("dashboard")}>
                            <DashboardIcon />
                        </Tooltip>
                        <Hidden xsDown>{getMessage("dashboard")}</Hidden>
                    </Button>
                </Grid>
                <Grid item xs>
                    <Button
                        className={
                            activeView === DATA
                                ? classes.selectedButton
                                : classes.button
                        }
                        onClick={() => {
                            router.push("/" + NavigationConstants.DATA);
                        }}
                    >
                        <Tooltip title={getMessage("data")}>
                            <CloudUploadIcon />
                        </Tooltip>
                        <Hidden xsDown>{getMessage("data")}</Hidden>
                    </Button>
                </Grid>
                <Grid item xs>
                    <Button
                        className={
                            activeView === APPS
                                ? classes.selectedButton
                                : classes.button
                        }
                        onClick={() => {
                            router.push("/" + NavigationConstants.APPS);
                        }}
                    >
                        <Tooltip title={getMessage("apps")}>
                            <AppsIcon />
                        </Tooltip>
                        <Hidden xsDown>{getMessage("apps")}</Hidden>
                    </Button>
                </Grid>
                <Grid item xs>
                    <Button
                        className={
                            activeView === ANALYSES
                                ? classes.selectedButton
                                : classes.button
                        }
                        onClick={() => {
                            router.push("/" + NavigationConstants.ANALYSES);
                        }}
                    >
                        <Tooltip title={getMessage("analyses")}>
                            <AssessmentIcon />
                        </Tooltip>
                        <Hidden xsDown>{getMessage("analyses")}</Hidden>
                    </Button>
                </Grid>
                <Grid item xs>
                    <Button
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
