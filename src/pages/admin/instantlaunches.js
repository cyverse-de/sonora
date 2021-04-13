import React from "react";

import { useUserProfile } from "contexts/userProfile";

import { Tabs, Tab, Paper, Typography, makeStyles } from "@material-ui/core";

import InstantLaunchList from "components/instantlaunches/admin/InstantLaunchList";
import QuickLaunchList from "components/instantlaunches/admin/QuickLaunchList";
import InstantLaunchMapping from "components/instantlaunches/admin/InstantLaunchMapping";
import NotAuthorized from "components/utils/error/NotAuthorized";
import { useTranslation } from "i18n";

const useStyles = makeStyles((theme) => ({
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
            <>
                <Typography variant="h5">Instant Launches</Typography>
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

                <Paper hidden={tabValue !== 0} style={{ overflow: "auto" }}>
                    <QuickLaunchList />
                </Paper>

                <Paper hidden={tabValue !== 1} style={{ overflow: "auto" }}>
                    <InstantLaunchList />
                </Paper>

                <Paper hidden={tabValue !== 2} style={{ overflow: "auto" }}>
                    <InstantLaunchMapping />
                </Paper>
            </>
        );
    }
}

InstantLaunchesAdmin.getInitialProps = async () => ({
    namespacesRequired: ["instantlaunches"],
});
