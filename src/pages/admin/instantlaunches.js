import React from "react";

import { useUserProfile } from "contexts/userProfile";

import { Tabs, Tab, Paper, Typography, makeStyles } from "@material-ui/core";

import InstantLaunchList from "components/instantlaunches/admin/InstantLaunchList";
import QuickLaunchList from "components/instantlaunches/admin/QuickLaunchList";
import InstantLaunchMapping from "components/instantlaunches/admin/InstantLaunchMapping";
import NotAuthorized from "components/utils/error/NotAuthorized";
import { useTranslation } from "i18n";

const useStyles = makeStyles((theme) => ({
    mainDescription: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    tabDescription: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },

    instantLaunches: {
        overflow: "auto",
        width: "100%",
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    tabAppBar: {
        backgroundColor: theme.palette.white,
    },
    tabs: {
        marginBottom: theme.spacing(2),
    },
    tabSelected: {
        backgroundColor: theme.palette.secondary,
        color: theme.palette.black,
    },
    tabRoot: {
        color: theme.palette.darkGray,
        "&:hover": {
            color: theme.palette.black,
        },
    },
    tabPanelRoot: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

export default function InstantLaunchesAdmin() {
    const classes = useStyles();
    const profile = useUserProfile()[0];
    const { t } = useTranslation("instantlaunches");
    const [tabValue, setTabValue] = React.useState(0);

    if (!profile?.admin) {
        return <NotAuthorized />;
    } else {
        const handleTabChange = (event, newValue) => {
            setTabValue(newValue);
        };
        return (
            <div className={classes.instantLaunches}>
                <Typography variant="h5">Instant Launches</Typography>

                <Typography variant="body1" className={classes.mainDescription}>
                    This page allows you to create new instant launches, add
                    them to the dashboard, delete them, and set them as a
                    default for files in the data listing.
                </Typography>

                <Tabs
                    value={tabValue}
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    className={classes.tabs}
                    centered
                >
                    <Tab
                        label={t("create")}
                        classes={{
                            root: classes.tabRoot,
                            selected: classes.tabSelected,
                        }}
                        value={0}
                    />
                    <Tab
                        label={t("update")}
                        classes={{
                            root: classes.tabRoot,
                            selected: classes.tabSelected,
                        }}
                        value={1}
                    />
                    <Tab
                        label={t("updateDataMapping")}
                        classes={{
                            root: classes.tabRoot,
                            selected: classes.tabSelected,
                        }}
                        value={2}
                    />
                </Tabs>

                <div hidden={tabValue !== 0}>
                    <Typography
                        variant="body2"
                        className={classes.tabDescription}
                    >
                        Create new instant launches from a quick launch in the
                        listing below.
                    </Typography>
                    <Paper>
                        <QuickLaunchList />
                    </Paper>
                </div>

                <div hidden={tabValue !== 1}>
                    <Typography
                        variant="body2"
                        className={classes.tabDescription}
                    >
                        Add existing instant launches to the dashboard or delete
                        them from existence.
                    </Typography>
                    <Paper>
                        <InstantLaunchList />
                    </Paper>
                </div>

                <div hidden={tabValue !== 2}>
                    <Typography
                        variant="body2"
                        className={classes.tabDescription}
                    >
                        Use globs or infoTypes along with instant launches to
                        match filenames in the data listing with a quick launch.
                    </Typography>
                    <Paper>
                        <InstantLaunchMapping />
                    </Paper>
                </div>
            </div>
        );
    }
}

InstantLaunchesAdmin.getInitialProps = async () => ({
    namespacesRequired: ["instantlaunches"],
});
