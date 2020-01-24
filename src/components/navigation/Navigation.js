/**
 *
 * @author Sriram
 * A component that displays app level navigation
 */
import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AppsIcon from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button, Grid, Hidden, NoSsr, Paper } from "@material-ui/core";
import { useRouter } from "next/router";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        "&:hover": {
            backgroundColor: theme.palette.blue,
        },
    },

    selectedButton: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.blue,
        color: theme.palette.white,
    },

    paper: {
        margin: theme.spacing(1),
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
    const { navigate } = props;
    console.log("navigate->" + navigate);
    return (
        <NoSsr>
            <Paper elevation={10} className={classes.paper}>
                <Grid container>
                    <Grid item xs>
                        <Button
                            className={
                                navigate === DASHBOARD
                                    ? classes.selectedButton
                                    : classes.button
                            }
                            onClick={() => {
                                router.push("/dashboard");
                            }}
                        >
                            <DashboardIcon /> <Hidden xsDown>Dashboard</Hidden>
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button
                            className={
                                navigate === DATA
                                    ? classes.selectedButton
                                    : classes.button
                            }
                            onClick={() => {
                                router.push("/data");
                            }}
                        >
                            <CloudUploadIcon /> <Hidden xsDown>Data</Hidden>
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button
                            className={
                                navigate === APPS
                                    ? classes.selectedButton
                                    : classes.button
                            }
                            onClick={() => {
                                router.push("/apps");
                            }}
                        >
                            <AppsIcon /> <Hidden xsDown>Apps</Hidden>
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button
                            className={
                                navigate === ANALYSES
                                    ? classes.selectedButton
                                    : classes.button
                            }
                            onClick={() => {
                                router.push("/analyses");
                            }}
                        >
                            <AssessmentIcon /> <Hidden xsDown>Analyses</Hidden>
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button
                            className={
                                navigate === MORE
                                    ? classes.selectedButton
                                    : classes.button
                            }
                            onClick={() => {
                                router.push("/more");
                            }}
                        >
                            <MoreHorizIcon /> <Hidden xsDown>More</Hidden>
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </NoSsr>
    );
}

export default Navigation;
