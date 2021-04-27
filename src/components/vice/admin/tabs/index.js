import React, { useState, useEffect } from "react";

import { useMutation, queryCache } from "react-query";

import { useTranslation } from "i18n";

import { AppBar, Tab } from "@material-ui/core";

import { TabContext, TabList, TabPanel } from "@material-ui/lab";

import { makeStyles } from "@material-ui/styles";

import { build as id } from "@cyverse-de/ui-lib";

import CollapsibleTable from "components/vice/admin/table";

import {
    saveOutputFiles,
    downloadInputFiles,
    extendTimeLimit,
    saveAndExit,
    exit,
    VICE_ADMIN_QUERY_KEY,
} from "serviceFacades/vice/admin";

import columns from "./columns";
import ids from "components/vice/admin/ids";

const getAnalyses = ({ deployments = [] }) => {
    let analyses = {};

    // Should only need to interate through the deployments to find the
    // list of analyses in the data.
    deployments.forEach((element) => {
        if (!analyses.hasOwnProperty(element.externalID)) {
            analyses[element.externalID] = {
                externalID: element.externalID,
                username: element.username,
                analysisName: element.analysisName,
                appName: element.appName,
                creationTimestamp: element.creationTimestamp,
                appID: element.appID,
                userID: element.userID,
                namespace: element.namespace,
            };
        }
    });

    return Object.values(analyses);
};

const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(3),
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: theme.spacing(1),
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(0.5),
            paddingRight: theme.spacing(0.5),
            paddingTop: theme.spacing(0.5),
        },
        paddingBottom: 0,
        overflow: "auto",
        height: "90vh",
    },
    filterSkeleton: {
        marginBottom: theme.spacing(5),
    },
    footer: {
        width: "100%",
        height: theme.spacing(5),

        [theme.breakpoints.down("sm")]: {
            height: 32,
        },
    },
    refresh: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    tabAppBarColorPrimary: {
        backgroundColor: theme.palette.white,
    },
    tabRoot: {
        color: theme.palette.darkGray,
        "&:hover": {
            color: theme.palette.black,
        },
    },
    tabSelected: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    tabPanelRoot: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

const VICEAdminTabs = ({ data = {} }) => {
    const classes = useStyles();
    const { t } = useTranslation("vice-admin");

    const [value, setValue] = useState("0");

    const tabID = (name) => id(ids.ROOT, "admin", "tabs", name);
    const tabPanelID = (name) => id(ids.ROOT, "admin", "tab-panels", name);

    const [mutantExit] = useMutation(exit, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const [mutantSaveAndExit] = useMutation(saveAndExit, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const [mutantExtendTimeLimit] = useMutation(extendTimeLimit, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const [mutantUploadOutputs] = useMutation(saveOutputFiles, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const [mutantDownloadInputs] = useMutation(downloadInputFiles, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });

    const [analysisRows, setAnalysisRows] = useState([]);

    useEffect(() => {
        setAnalysisRows(getAnalyses(data));
    }, [data]);

    const orderOfTabs = [
        "analyses",
        "deployments",
        "services",
        "pods",
        "configMaps",
        "ingresses",
    ];

    return (
        <TabContext value={value}>
            <AppBar
                position="static"
                color="primary"
                classes={{ colorPrimary: classes.tabAppBarColorPrimary }}
            >
                <TabList
                    onChange={(_, newValue) => setValue(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="secondary"
                >
                    {orderOfTabs.map((tabName, index) => (
                        <Tab
                            label={t(tabName)}
                            id={tabID(tabName)}
                            key={tabID(tabName)}
                            value={`${index}`}
                            aria-controls={tabPanelID(tabName)}
                            classes={{
                                root: classes.tabRoot,
                                selected: classes.tabSelected,
                            }}
                        />
                    ))}
                </TabList>
            </AppBar>

            {orderOfTabs.map((tabName, index) => (
                <TabPanel
                    value={`${index}`}
                    id={tabPanelID(tabName)}
                    key={tabPanelID(tabName)}
                    classes={{ root: classes.tabPanelRoot }}
                >
                    <CollapsibleTable
                        data={analysisRows}
                        columns={columns[tabName]}
                        title={t(tabName)}
                        showActions={tabName === "analyses"}
                        handleExit={async (analysisID, externalID) => {
                            const data = await mutantExit({ analysisID });
                            setAnalysisRows(
                                analysisRows.filter(
                                    (obj) => obj.externalID !== externalID
                                )
                            );
                            return data;
                        }}
                        handleSaveAndExit={async (analysisID, externalID) => {
                            const data = await mutantSaveAndExit({
                                analysisID,
                            });
                            setAnalysisRows(
                                analysisRows.filter(
                                    (obj) => obj.externalID !== externalID
                                )
                            );
                            return data;
                        }}
                        handleExtendTimeLimit={async (
                            analysisID,
                            externalID
                        ) => {
                            const data = await mutantExtendTimeLimit({
                                analysisID,
                            });
                            return data;
                        }}
                        handleUploadOutputs={async (analysisID, externalID) => {
                            const data = await mutantUploadOutputs({
                                analysisID,
                            });
                            return data;
                        }}
                        handleDownloadInputs={async (
                            analysisID,
                            externalID
                        ) => {
                            const data = await mutantDownloadInputs({
                                analysisID,
                            });
                            return data;
                        }}
                    />
                </TabPanel>
            ))}
        </TabContext>
    );
};

export default VICEAdminTabs;
