import React from "react";

import { useUserProfile } from "contexts/userProfile";

import { Tabs, Tab, Typography, makeStyles } from "@material-ui/core";

import InstantLaunchList from "components/instantlaunches/admin/InstantLaunchList";
import InstantLaunchMapping from "components/instantlaunches/admin/InstantLaunchMapping";
import NotAuthorized from "components/utils/error/NotAuthorized";
import { useTranslation } from "i18n";

const useStyles = makeStyles((theme) => ({
    mainDescription: {
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
    const { t } = useTranslation(["instantlaunches", "common"]);
    const [tabValue, setTabValue] = React.useState(0);

    if (!profile?.admin) {
        return <NotAuthorized />;
    } else {
        const handleTabChange = (event, newValue) => {
            setTabValue(newValue);
        };
        return (
            <div className={classes.instantLaunches}>
                <Typography variant="h4">{t("pageTitle")}</Typography>

                <Typography variant="body1" className={classes.mainDescription}>
                    {t("pageDescription")}
                </Typography>

                <Tabs
                    value={tabValue}
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    className={classes.tabs}
                    centered
                >
                    <Tab
                        label={t("common:list")}
                        classes={{
                            root: classes.tabRoot,
                            selected: classes.tabSelected,
                        }}
                        value={0}
                    />
                    <Tab
                        label={t("updateDataMapping")}
                        classes={{
                            root: classes.tabRoot,
                            selected: classes.tabSelected,
                        }}
                        value={1}
                    />
                </Tabs>

                <div hidden={tabValue !== 0}>
                    <InstantLaunchList />
                </div>

                <div hidden={tabValue !== 1}>
                    <InstantLaunchMapping />
                </div>
            </div>
        );
    }
}

InstantLaunchesAdmin.getInitialProps = async () => ({
    namespacesRequired: ["instantlaunches", "common"],
});
