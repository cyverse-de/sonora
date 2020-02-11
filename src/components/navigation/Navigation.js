/**
 *
 * @author Sriram
 * A component that displays app level navigation
 */
import React from "react";
import intlData from "./messages";
import ids from "./ids";
import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AppsIcon from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button, Grid, Hidden, Paper } from "@material-ui/core";
import { useRouter } from "next/router";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";

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
    const { navigate } = props;
    const theme = useTheme();
    return (
        <Paper elevation={10} style={{ backgroundColor: theme.palette.lightGray }}>
            <Grid container>
                <Grid item xs>
                    <Button
                        id={build(ids.NAVIGATION, ids.DASHBOARD_BTN)}
                        className={
                            navigate === DASHBOARD
                                ? classes.selectedButton
                                : classes.button
                        }
                        onClick={() => {
                            router.push("/dashboard");
                        }}
                    >
                        <DashboardIcon/> <Hidden xsDown>{getMessage("dashboard")}</Hidden>
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
                        <CloudUploadIcon/> <Hidden xsDown>{getMessage("data")}</Hidden>
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
                        <AppsIcon/> <Hidden xsDown>{getMessage("apps")}</Hidden>
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
                        <AssessmentIcon/> <Hidden xsDown>{getMessage("analyses")}</Hidden>
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
                        <MoreHorizIcon/> <Hidden xsDown>{getMessage("more")}</Hidden>
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default withI18N(injectIntl(Navigation), intlData);
